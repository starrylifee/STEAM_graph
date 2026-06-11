from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
SOURCE_DIR = ROOT / "source_images"
OUT_DIR = ROOT / "source_images_review"


def main() -> None:
    OUT_DIR.mkdir(exist_ok=True)
    for image_path in sorted(SOURCE_DIR.glob("*.png")):
        image = Image.open(image_path)
        rotated = image.rotate(90, expand=True)
        rotated.save(OUT_DIR / image_path.name)
    print(f"rotated {len(list(SOURCE_DIR.glob('*.png')))} pages")


if __name__ == "__main__":
    main()
