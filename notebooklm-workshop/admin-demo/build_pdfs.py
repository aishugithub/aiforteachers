"""Build PDFs of the admin demo sources (sources/*.md -> pdf/*.pdf) with Edge headless.

Usage: python build_pdfs.py
"""
import pathlib
import subprocess
import tempfile

import markdown

HERE = pathlib.Path(__file__).resolve().parent
SRC = HERE / "sources"
OUT = HERE / "pdf"
EDGE = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"

CSS = """
@page { size: A4; margin: 18mm 16mm; }
body { font: 11.5pt/1.5 "Segoe UI", Arial, sans-serif; color: #111; }
h2 { font-size: 16pt; margin: 0 0 4px; }
h3 { font-size: 12.5pt; margin: 16px 0 6px; }
table { border-collapse: collapse; width: 100%; margin: 8px 0 12px; font-size: 10.5pt; }
th, td { border: 1px solid #999; padding: 4px 6px; text-align: left; vertical-align: top; }
th { background: #eee; }
hr { border: 0; border-top: 1.5px solid #333; margin: 10px 0; }
"""


def main():
    OUT.mkdir(exist_ok=True)
    with tempfile.TemporaryDirectory() as tmp:
        for md_file in sorted(SRC.glob("*.md")):
            body = markdown.markdown(
                md_file.read_text(encoding="utf-8"),
                extensions=["tables", "md_in_html", "nl2br"],
            )
            html = pathlib.Path(tmp) / (md_file.stem + ".html")
            html.write_text(
                f"<!doctype html><meta charset='utf-8'><title>{md_file.stem}</title>"
                f"<style>{CSS}</style>{body}",
                encoding="utf-8",
            )
            pdf = OUT / (md_file.stem + ".pdf")
            subprocess.run(
                [EDGE, "--headless", "--disable-gpu", "--no-pdf-header-footer",
                 f"--user-data-dir={tmp}\\edge-profile",
                 f"--print-to-pdf={pdf}", html.as_uri()],
                check=True, capture_output=True,
            )
            print(pdf.name, pdf.stat().st_size)


if __name__ == "__main__":
    main()
