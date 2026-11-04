"""Build the two date-free, single-column CV editions from reviewed content.

Run with the Codex bundled Python runtime. PDF fonts are embedded; DOCX text
remains editable and uses semantic styles and native hyperlinks.
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
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import SimpleDocTemplate, Paragraph

ROOT = Path(__file__).resolve().parent.parent
PROFILE = ROOT / 'documents/resume/resume-content.json'
FONT = 'Segoe UI'
INK = '242824'
MUTED = '555F57'
LINK = '254C3E'
BODY_SIZE = 11
LEADING = 13.8


def blocks(profile, variant):
    data = profile[variant]
    result = [
        ('name', profile['name']), ('subtitle', data['title']),
        ('contact', {key: profile.get(key) for key in ('location', 'phone', 'email')}),
        ('links', [{'label': 'Portfolio', 'url': data['portfolio']}, *profile['links']]),
        ('heading', 'Profile'), ('body', data['summary']),
        ('heading', 'Technical skills' if variant == 'software' else 'Core skills'),
    ]
    result += [('skill', skill) for skill in data['skills']]
    result.append(('heading', 'Professional experience'))
    for experience in data['experience']:
        result += [('company', experience['company']), ('role', experience['role'])]
        result += [('bullet', bullet) for bullet in experience['bullets']]
    result.append(('heading', 'Selected frontend projects' if variant == 'software' else 'Selected creative work'))
    if data.get('projectContext'):
        result.append(('small', data['projectContext']))
    result += [('project', project) for project in data['projects']]
    if variant == 'creative':
        result += [('heading', 'Selected brand experience'), ('body', data['brands']), ('small', data['brandContext'])]
    result += [('heading', 'Education and development'), ('body', profile['education']), ('small', data['training']), ('small', 'Languages: ' + data['languages'])]
    return result


def link_run(paragraph, text, url, size=10):
    rel = paragraph.part.relate_to(url, 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/hyperlink', is_external=True)
    hyperlink = OxmlElement('w:hyperlink'); hyperlink.set(qn('r:id'), rel)
    run = OxmlElement('w:r'); properties = OxmlElement('w:rPr')
    fonts = OxmlElement('w:rFonts')
    for face in ('ascii', 'hAnsi', 'eastAsia', 'cs'): fonts.set(qn('w:' + face), FONT)
    properties.append(fonts)
    color = OxmlElement('w:color'); color.set(qn('w:val'), LINK); properties.append(color)
    underline = OxmlElement('w:u'); underline.set(qn('w:val'), 'single'); properties.append(underline)
    font_size = OxmlElement('w:sz'); font_size.set(qn('w:val'), str(round(size * 2))); properties.append(font_size)
    run.append(properties)
    value = OxmlElement('w:t'); value.text = text; run.append(value)
    hyperlink.append(run); paragraph._p.append(hyperlink)


def write_docx(profile, variant, output):
    document = Document(); section = document.sections[0]
    section.page_width = Inches(8.5); section.page_height = Inches(11)
    section.top_margin = section.bottom_margin = Inches(.55)
    section.left_margin = section.right_margin = Inches(.64)
    definitions = {
        'Normal': (BODY_SIZE, LEADING, 0, 3, False, INK),
        'Title': (30, 34, 0, 4, False, '000000'),
        'Subtitle': (12.5, 16, 0, 8, True, '000000'),
        'Heading 1': (10.5, 14, 11, 5, True, '000000'),
        'Heading 2': (11, 14, 5, 1, True, '000000'),
        'List Bullet': (BODY_SIZE, LEADING, 0, 3, False, INK),
    }
    for name, (size, leading, before, after, bold, color) in definitions.items():
        style = document.styles[name]
        style.font.name = FONT; style.font.size = Pt(size)
        style.font.color.rgb = RGBColor.from_string(color)
        style.font.bold = bold; style.font.italic = False
        fmt = style.paragraph_format
        fmt.line_spacing = Pt(leading); fmt.space_before = Pt(before); fmt.space_after = Pt(after)
        fmt.widow_control = True
        fmt.keep_with_next = name in ('Heading 1', 'Heading 2')
    bullet = document.styles['List Bullet'].paragraph_format
    bullet.left_indent = Inches(.13); bullet.first_line_indent = Inches(-.13)
    props = document.core_properties
    props.author = profile['name']; props.title = profile[variant]['title'] + ' CV'
    props.subject = 'Professional experience and selected work'
    props.keywords = ''; props.comments = ''
    for kind, value in blocks(profile, variant):
        style = {'name': 'Title', 'subtitle': 'Subtitle', 'heading': 'Heading 1', 'company': 'Heading 2', 'bullet': 'List Bullet'}.get(kind, 'Normal')
        paragraph = document.add_paragraph(style=style)
        fmt = paragraph.paragraph_format
        if kind == 'contact':
            fmt.space_after = Pt(3); fmt.line_spacing = Pt(13)
            paragraph.add_run(value['location'] + '  |  ')
            link_run(paragraph, value['email'], 'mailto:' + value['email'])
            if value.get('phone'):
                paragraph.add_run('  |  '); link_run(paragraph, value['phone'], 'tel:' + value['phone'].replace(' ', ''))
            for run in paragraph.runs: run.font.size = Pt(10)
        elif kind == 'links':
            fmt.space_after = Pt(2); fmt.line_spacing = Pt(13)
            for index, link in enumerate(value):
                if index: paragraph.add_run('    /    ')
                link_run(paragraph, link['label'], link['url'])
            for run in paragraph.runs: run.font.size = Pt(10)
        elif kind in ('skill', 'project'):
            paragraph.add_run((value['label'] if kind == 'skill' else value['name']) + ': ').bold = True
            paragraph.add_run(value['text'])
        else:
            run = paragraph.add_run(value)
            if kind in ('small', 'role'):
                run.font.size = Pt(10); run.font.color.rgb = RGBColor.from_string(MUTED)
                fmt.line_spacing = Pt(12.5)
            if kind == 'role': fmt.keep_with_next = True; fmt.space_after = Pt(4)
        fmt.widow_control = True
    # Remove Word template theme aliases, border rules and expanded tracking.
    for style in document.styles:
        for node in style.element.xpath('.//w:pBdr | .//w:rPr/w:spacing'):
            node.getparent().remove(node)
        for fonts in style.element.xpath('.//w:rFonts'):
            for attribute in list(fonts.attrib):
                if attribute.endswith('Theme'): del fonts.attrib[attribute]
    document.save(output)


def write_pdf(profile, variant, output):
    font_dir = Path('C:/Windows/Fonts')
    pdfmetrics.registerFont(TTFont('ResumeSegoe', str(font_dir / 'segoeui.ttf')))
    pdfmetrics.registerFont(TTFont('ResumeSegoeBold', str(font_dir / 'segoeuib.ttf')))
    pdfmetrics.registerFontFamily('ResumeSegoe', normal='ResumeSegoe', bold='ResumeSegoeBold')
    normal = ParagraphStyle('body', fontName='ResumeSegoe', fontSize=BODY_SIZE, leading=LEADING, spaceAfter=3, textColor=colors.HexColor('#' + INK))
    styles = {
        'body': normal,
        'name': ParagraphStyle('name', parent=normal, fontSize=30, leading=34, spaceAfter=4, textColor=colors.black),
        'subtitle': ParagraphStyle('subtitle', parent=normal, fontName='ResumeSegoeBold', fontSize=12.5, leading=16, spaceAfter=8, textColor=colors.black),
        'heading': ParagraphStyle('heading', parent=normal, fontName='ResumeSegoeBold', fontSize=10.5, leading=14, spaceBefore=11, spaceAfter=5, keepWithNext=True, textColor=colors.black),
        'company': ParagraphStyle('company', parent=normal, fontName='ResumeSegoeBold', fontSize=11, leading=14, spaceBefore=5, spaceAfter=1, keepWithNext=True, textColor=colors.black),
        'role': ParagraphStyle('role', parent=normal, fontSize=10, leading=12.5, spaceAfter=4, keepWithNext=True, textColor=colors.HexColor('#' + MUTED)),
        'small': ParagraphStyle('small', parent=normal, fontSize=10, leading=12.5, textColor=colors.HexColor('#' + MUTED)),
        'contact': ParagraphStyle('contact', parent=normal, fontSize=10, leading=13, spaceAfter=3),
        'links': ParagraphStyle('links', parent=normal, fontSize=10, leading=13, spaceAfter=2),
        'bullet': ParagraphStyle('bullet', parent=normal, leftIndent=9.36, firstLineIndent=-9.36),
    }
    def link(label, url):
        return f'<link href="{escape(url, quote=True)}" color="#{LINK}"><u>{escape(label)}</u></link>'
    flow = []
    for kind, value in blocks(profile, variant):
        if kind == 'contact':
            text = escape(value['location']) + '  |  ' + link(value['email'], 'mailto:' + value['email'])
            if value.get('phone'): text += '  |  ' + link(value['phone'], 'tel:' + value['phone'].replace(' ', ''))
        elif kind == 'links': text = '    /    '.join(link(item['label'], item['url']) for item in value)
        elif kind in ('skill', 'project'):
            label = value['label'] if kind == 'skill' else value['name']
            text = '<b>' + escape(label) + ':</b> ' + escape(value['text'])
        else: text = ('&#8226; ' if kind == 'bullet' else '') + escape(value)
        flow.append(Paragraph(text, styles.get(kind, normal)))
    document = SimpleDocTemplate(str(output), pagesize=letter, leftMargin=.64*72, rightMargin=.64*72, topMargin=.55*72, bottomMargin=.55*72, title=profile[variant]['title'] + ' CV', author=profile['name'])
    document.build(flow)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--format', choices=['docx', 'pdf', 'all'], default='all')
    args = parser.parse_args()
    profile = json.loads(PROFILE.read_text(encoding='utf-8-sig'))
    for variant, suffix in [('software', 'Software-Engineer'), ('creative', 'Digital-Creative-Marketer')]:
        stem = 'Joshua-Ogallo-' + suffix + '-Resume'
        for format_name, writer in [('docx', write_docx), ('pdf', write_pdf)]:
            if args.format not in ('all', format_name): continue
            folder = ROOT / 'output' / format_name; folder.mkdir(parents=True, exist_ok=True)
            target = folder / (stem + '.' + format_name)
            writer(profile, variant, target)
            print(target)


if __name__ == '__main__': main()
