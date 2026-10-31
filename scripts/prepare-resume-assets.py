"""Copy reviewed CVs and render actual first-page previews. Needs Pillow, pypdf and Poppler."""
import hashlib
import json
import shutil
import subprocess
import sys
from pathlib import Path

from PIL import Image
from pypdf import PdfReader

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public"
PREVIEWS = PUBLIC / "images/resumes"
PREVIEWS.mkdir(parents=True, exist_ok=True)
TEMP = ROOT / "tmp/pdfs/resume-previews"
TEMP.mkdir(parents=True, exist_ok=True)
bundled = Path(sys.executable).parent.parent / "native/poppler/Library/bin/pdftoppm.exe"
poppler = shutil.which("pdftoppm") or (str(bundled) if bundled.is_file() else None)
if not poppler:
    raise SystemExit("Poppler pdftoppm is required to render the reviewed CVs.")

metadata = {}
for identity, source_name, public_name in [
    ("software", "Software-Engineer", "joshua-ogallo-cv"),
    ("creative", "Digital-Creative-Marketer", "joshua-ogallo-creative-cv"),
]:
    pdf = ROOT / f"output/pdf/Joshua-Ogallo-{source_name}-Resume.pdf"
    word = ROOT / f"output/docx/Joshua-Ogallo-{source_name}-Resume.docx"
    pages = len(PdfReader(pdf).pages)
    pdf_hash = hashlib.sha256(pdf.read_bytes()).hexdigest()[:12]
    word_hash = hashlib.sha256(word.read_bytes()).hexdigest()[:12]
    shutil.copyfile(pdf, PUBLIC / f"{public_name}.pdf")
    shutil.copyfile(word, PUBLIC / f"{public_name}.docx")
    prefix = TEMP / identity
    subprocess.run([poppler, "-f", "1", "-singlefile", "-scale-to", "1400", "-png", str(pdf), str(prefix)], check=True)
    with Image.open(prefix.with_suffix(".png")) as image:
        width, height = image.size
        for target in (400, 800):
            resized = image.convert("RGB").resize((target, round(height * target / width)), Image.Resampling.LANCZOS)
            resized.save(PREVIEWS / f"{identity}-{target}.webp", "WEBP", quality=88, method=6)
    prefix.with_suffix(".png").unlink()
    metadata[identity] = {
        "pdf": f"/{public_name}.pdf?v={pdf_hash}",
        "word": f"/{public_name}.docx?v={word_hash}",
        "pdfFilename": f"Joshua-Ogallo-{source_name}-CV.pdf",
        "wordFilename": f"Joshua-Ogallo-{source_name}-CV.docx",
        "pages": pages,
        "pdfKB": round(pdf.stat().st_size / 1024),
        "preview": f"/images/resumes/{identity}-800.webp?v={pdf_hash}",
        "previewSmall": f"/images/resumes/{identity}-400.webp?v={pdf_hash}",
        "previewWidth": 800,
        "previewHeight": round(height * 800 / width),
    }
    print(f"Prepared {identity}: {pages} page(s), PDF, Word and two document previews.")
(ROOT / "src/data/resume-assets.json").write_text(json.dumps(metadata, indent=2) + "\n", encoding="utf-8")
