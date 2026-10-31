"""Create matching editable and printable resumes from reviewed profile content.

Run with the bundled Codex Python runtime. Sources remain separate from outputs;
unknown dates and credentials must be confirmed rather than filled automatically.
"""
from pathlib import Path
import argparse
import json
from html import escape

from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, KeepTogether

ROOT = Path(__file__).resolve().parent.parent
PROFILE = ROOT / 'documents/resume/resume-content.json'


def blocks(profile, variant):
    data = profile[variant]
    result = [
        ('name', profile['name']),
        ('subtitle', data['title']),
        ('contact', {key: profile.get(key) for key in ('location', 'phone', 'email')}),
        ('links', profile['links']),
        ('heading', 'Profile'),
        ('body', data['summary']),
        ('heading', 'Technical skills' if variant == 'software' else 'Core capabilities'),
    ]
    result += [('skill', skill) for skill in data['skills']]
    if variant == 'creative':
        result += [('heading', 'Selected campaign and digital work')]
        result += [('project', project) for project in data['projects']]
    result.append(('heading', 'Professional experience'))
    for experience in data['experience']:
        result += [('role', experience)]
        result += [('bullet', bullet) for bullet in experience['bullets']]
    if variant == 'creative':
        result += [('heading', 'Selected brand experience'), ('body', data['brands']), ('small', data['brandContext'])]
    if variant == 'software':
        result += [('heading', 'Selected projects'), ('small', 'Frontend and UI/UX contributions to all projects listed below.')]
        result += [('project', project) for project in data['projects']]
    if data.get('additional'):
        result += [('heading', 'Additional experience'), ('body', data['additional'])]
    result += [('heading', 'Education and training'), ('body', profile['education']), ('small', data['training']), ('small', 'Languages: ' + data['languages'])]
    return result


def link_run(paragraph, text, url, color_value='263E65'):
    rel = paragraph.part.relate_to(url, 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/hyperlink', is_external=True)
    hyperlink = OxmlElement('w:hyperlink')
    hyperlink.set(qn('r:id'), rel)
    run = OxmlElement('w:r')
    properties = OxmlElement('w:rPr')
    fonts = OxmlElement('w:rFonts')
    for face in ('ascii', 'hAnsi', 'eastAsia', 'cs'): fonts.set(qn('w:' + face), 'Arial')
    properties.append(fonts)
    color = OxmlElement('w:color'); color.set(qn('w:val'), color_value); properties.append(color)
    size = OxmlElement('w:sz'); size.set(qn('w:val'), '20'); properties.append(size)
    run.append(properties)
    value = OxmlElement('w:t'); value.text = text; run.append(value)
    hyperlink.append(run)
    paragraph._p.append(hyperlink)


def write_docx(profile, variant, output):
    document = Document()
    section = document.sections[0]
    section.page_width = Inches(8.5); section.page_height = Inches(11)
    section.top_margin = section.bottom_margin = Inches(.58)
    section.left_margin = section.right_margin = Inches(.68)
    for name in ['Normal', 'Title', 'Subtitle', 'Heading 1', 'Heading 2', 'List Bullet']:
        style = document.styles[name]
        style.font.name = 'Arial'
        style.font.color.rgb = RGBColor(0, 0, 0)
        style.font.size = Pt(10.5)
        style.font.italic = False
        style.paragraph_format.line_spacing = Pt(12.6)
        style.paragraph_format.space_before = Pt(0)
        style.paragraph_format.space_after = Pt(4)
    document.styles['Title'].font.size = Pt(25)
    document.styles['Title'].font.bold = True
    document.styles['Title'].paragraph_format.line_spacing = Pt(29)
    document.styles['Title'].paragraph_format.space_after = Pt(4)
    document.styles['Subtitle'].font.size = Pt(12)
    document.styles['Subtitle'].font.bold = True
    document.styles['Subtitle'].paragraph_format.line_spacing = Pt(15)
    heading = document.styles['Heading 1']
    heading.font.size = Pt(11)
    heading.font.bold = True
    heading.paragraph_format.line_spacing = Pt(14)
    heading.paragraph_format.space_before = Pt(12)
    heading.paragraph_format.space_after = Pt(5)
    heading.paragraph_format.keep_with_next = True
    bullet = document.styles['List Bullet']
    bullet.paragraph_format.left_indent = Inches(.13)
    bullet.paragraph_format.first_line_indent = Inches(-.13)
    document.core_properties.author = profile['name']
    document.core_properties.title = profile[variant]['title'] + ' Resume'
    document.core_properties.subject = 'Professional experience and selected work'
    document.core_properties.keywords = ''
    document.core_properties.comments = ''
    for kind, value in blocks(profile, variant):
        if kind == 'name': document.add_paragraph(value, 'Title')
        elif kind == 'subtitle': document.add_paragraph(value, 'Subtitle')
        elif kind == 'heading': document.add_paragraph(value, 'Heading 1')
        elif kind == 'contact':
            paragraph = document.add_paragraph()
            paragraph.add_run(value['location'])
            if value.get('phone'):
                paragraph.add_run(' | ')
                link_run(paragraph, value['phone'], 'tel:' + value['phone'].replace(' ', ''), '000000')
            paragraph.add_run(' | ')
            link_run(paragraph, value['email'], 'mailto:' + value['email'], '000000')
            for run in paragraph.runs: run.font.size = Pt(10)
        elif kind == 'links':
            paragraph = document.add_paragraph()
            for index, link in enumerate(value):
                if index: paragraph.add_run(' | ')
                link_run(paragraph, link['label'], link['url'])
        elif kind == 'role':
            paragraph = document.add_paragraph()
            paragraph.paragraph_format.keep_with_next = True
            paragraph.paragraph_format.space_before = Pt(5)
            paragraph.add_run(value['role']).bold = True
            paragraph.add_run(' | ' + value['company'])
            if value.get('dates'): paragraph.add_run(' | ' + value['dates'])
        elif kind in ('skill', 'project'):
            paragraph = document.add_paragraph()
            paragraph.add_run((value.get('label') if kind == 'skill' else value['name']) + ': ').bold = True
            paragraph.add_run(value['text'])
            if value.get('url'):
                paragraph.add_run(' ')
                link_run(paragraph, value.get('label') or value['url'], value['url'])
        else:
            paragraph = document.add_paragraph(value, 'List Bullet' if kind == 'bullet' else 'Normal')
            if kind in ('contact', 'small'):
                for run in paragraph.runs: run.font.size = Pt(10)
        if document.paragraphs:
            document.paragraphs[-1].paragraph_format.widow_control = True
    # Word's template carries theme-font aliases alongside named fonts. Remove
    # those aliases so the editable file really renders in the intended face.
    for style in document.styles:
        for border in style.element.xpath('.//w:pBdr'):
            border.getparent().remove(border)
        for tracking in style.element.xpath('.//w:rPr/w:spacing'):
            tracking.getparent().remove(tracking)
        for fonts in style.element.xpath('.//w:rFonts'):
            for attribute in list(fonts.attrib):
                if attribute.endswith('Theme'): del fonts.attrib[attribute]
    for paragraph in document.paragraphs:
        for run in paragraph.runs: run.font.name = 'Arial'
    document.save(output)


def write_pdf(profile, variant, output):
    font_dir = Path('C:/Windows/Fonts')
    pdfmetrics.registerFont(TTFont('ResumeArial', str(font_dir / 'arial.ttf')))
    pdfmetrics.registerFont(TTFont('ResumeArialBold', str(font_dir / 'arialbd.ttf')))
    pdfmetrics.registerFontFamily('ResumeArial', normal='ResumeArial', bold='ResumeArialBold')
    styles = {
        'name': ParagraphStyle('name', fontName='ResumeArialBold', fontSize=25, leading=28, spaceAfter=5, textColor=colors.black),
        'subtitle': ParagraphStyle('subtitle', fontName='ResumeArialBold', fontSize=12, leading=15, spaceAfter=5),
        'heading': ParagraphStyle('heading', fontName='ResumeArialBold', fontSize=11, leading=14, spaceBefore=12, spaceAfter=5, keepWithNext=True),
        'body': ParagraphStyle('body', fontName='ResumeArial', fontSize=10.5, leading=12.6, spaceAfter=4),
        'small': ParagraphStyle('small', fontName='ResumeArial', fontSize=10, leading=12, spaceAfter=4),
        'role': ParagraphStyle('role', fontName='ResumeArial', fontSize=10.5, leading=12.6, spaceBefore=5, spaceAfter=4, keepWithNext=True),
        'bullet': ParagraphStyle('bullet', fontName='ResumeArial', fontSize=10.5, leading=12.6, spaceAfter=4, leftIndent=10, firstLineIndent=-10),
    }
    flow = []
    for kind, value in blocks(profile, variant):
        style = styles.get(kind, styles['body'])
        if kind == 'contact':
            contact = escape(value['location'])
            if value.get('phone'):
                contact += f' | <link href="tel:{escape(value["phone"].replace(" ", ""), quote=True)}">{escape(value["phone"])}</link>'
            contact += f' | <link href="mailto:{escape(value["email"], quote=True)}">{escape(value["email"])}</link>'
            value = contact
            style = styles['small']
        elif kind == 'links':
            value = ' | '.join(f'<link href="{escape(item["url"], quote=True)}" color="#263E65">{escape(item["label"])}</link>' for item in value)
            style = styles['small']
        elif kind == 'role':
            value = '<b>' + escape(value['role']) + '</b> | ' + escape(value['company']) + (' | ' + escape(value['dates']) if value.get('dates') else '')
        elif kind in ('skill', 'project'):
            label = value.get('label') if kind == 'skill' else value['name']
            value_text = '<b>' + escape(label) + ':</b> ' + escape(value['text'])
            if value.get('url'): value_text += f' <link href="{escape(value["url"], quote=True)}" color="#263E65">{escape(value.get("label") or value["url"])}</link>'
            value = value_text
        else:
            value = escape(value)
            if kind == 'bullet': value = '&#8226; ' + value
            if kind == 'contact': style = styles['small']
        flow.append(Paragraph(value, style))
    document = SimpleDocTemplate(str(output), pagesize=letter, leftMargin=.68*72, rightMargin=.68*72, topMargin=.58*72, bottomMargin=.58*72, title=profile[variant]['title'] + ' Resume', author=profile['name'])
    document.build(flow)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--format', choices=['docx', 'pdf', 'all'], default='all')
    args = parser.parse_args()
    profile = json.loads(PROFILE.read_text(encoding='utf-8'))
    for variant, suffix in [('software', 'Software-Engineer'), ('creative', 'Digital-Creative-Marketer')]:
        stem = 'Joshua-Ogallo-' + suffix + '-Resume'
        for format_name, writer in [('docx', write_docx), ('pdf', write_pdf)]:
            if args.format not in ('all', format_name): continue
            folder = ROOT / 'output' / format_name
            folder.mkdir(parents=True, exist_ok=True)
            target = folder / (stem + '.' + format_name)
            writer(profile, variant, target)
            print(target)


if __name__ == '__main__': main()
