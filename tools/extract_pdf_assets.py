from pathlib import Path

import fitz


ROOT = Path(__file__).resolve().parents[1]
PDF_PATH = ROOT / "source" / "20260611075405.pdf"
IMAGE_DIR = ROOT / "source_images"
TEXT_PATH = ROOT / "source" / "pdf_text.txt"
DPI = 180


def main() -> None:
    IMAGE_DIR.mkdir(exist_ok=True)
    zoom = DPI / 72
    matrix = fitz.Matrix(zoom, zoom)

    with fitz.open(PDF_PATH) as doc:
        text_chunks = []
        for index, page in enumerate(doc, start=1):
            pix = page.get_pixmap(matrix=matrix, alpha=False)
            image_path = IMAGE_DIR / f"{PDF_PATH.stem}_page_{index}.png"
            pix.save(image_path)

            text = page.get_text("text").strip()
            text_chunks.append(f"--- page {index} ---\n{text}\n")

        TEXT_PATH.write_text("\n".join(text_chunks), encoding="utf-8")
        print(f"exported {len(doc)} pages")


if __name__ == "__main__":
    main()
