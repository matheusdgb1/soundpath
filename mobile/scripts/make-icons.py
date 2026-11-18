"""Gera os ícones e a splash do SoundPath em assets/ (requer Pillow).

Uso (na pasta mobile/):  python scripts/make-icons.py

A geometria é a mesma do componente <Mark> em src/components/Icons.tsx (viewBox 0..100).
"""
import math
from pathlib import Path

from PIL import Image, ImageDraw

INK = (22, 21, 19)
SIGNAL = (255, 201, 41)
OUT = Path(__file__).resolve().parent.parent / "assets"
SS = 4  # supersampling


def mark_mask(size: int, scale: float = 1.0) -> Image.Image:
    """Máscara (L) da marca: 255 = tinta."""
    S = size * SS
    m = Image.new("L", (S, S), 0)
    d = ImageDraw.Draw(m)
    u = S / 100 * scale
    off = S * (1 - scale) / 2

    def p(x, y):
        return (off + x * u, off + y * u)

    def rect(x0, y0, x1, y1):
        d.rectangle([*p(x0, y0), *p(x1, y1)], fill=255)

    def disc(cx, cy, r, fill=255, start=0, end=360):
        (x0, y0), (x1, y1) = p(cx - r, cy - r), p(cx + r, cy + r)
        d.pieslice([x0, y0, x1, y1], start, end, fill=fill)

    # seta de conversão
    rect(20, 52, 36, 86)              # haste
    disc(44, 52, 24, start=180, end=270)  # curva externa
    disc(44, 52, 8, fill=0, start=180, end=270)  # curva interna
    rect(44, 28, 54, 44)              # braço
    d.polygon([p(52, 12), p(80, 36), p(52, 60)], fill=255)  # ponta

    # ondas de som
    w = 6
    for cx, r in ((52, 10), (56, 20)):
        cy = 78
        R = r + w / 2
        (x0, y0), (x1, y1) = p(cx - R, cy - R), p(cx + R, cy + R)
        d.arc([x0, y0, x1, y1], 307, 53, fill=255, width=int(w * u))
        for ang in (-53, 53):
            a = math.radians(ang)
            ex, ey = cx + r * math.cos(a), cy + r * math.sin(a)
            disc(ex, ey, w / 2)
    return m.resize((size, size), Image.LANCZOS)


def compose(size: int, scale: float, bg, radius: int | None = None) -> Image.Image:
    img = Image.new("RGBA", (size, size), (*bg, 255) if bg else (0, 0, 0, 0))
    img.paste(Image.new("RGBA", (size, size), (*INK, 255)), (0, 0), mark_mask(size, scale))
    if radius is not None:
        mask = Image.new("L", (size, size), 0)
        ImageDraw.Draw(mask).rounded_rectangle([0, 0, size - 1, size - 1], radius=radius, fill=255)
        out = Image.new("RGBA", (size, size), (0, 0, 0, 0))
        out.paste(img, (0, 0), mask)
        return out
    return img


def main():
    compose(1024, 0.86, SIGNAL).save(OUT / "icon.png")
    compose(1024, 0.56, None).save(OUT / "android-icon-foreground.png")
    Image.new("RGBA", (1024, 1024), (*SIGNAL, 255)).save(OUT / "android-icon-background.png")
    mono = Image.new("RGBA", (1024, 1024), (0, 0, 0, 0))
    mono.paste(Image.new("RGBA", (1024, 1024), (0, 0, 0, 255)), (0, 0), mark_mask(1024, 0.56))
    mono.save(OUT / "android-icon-monochrome.png")
    compose(1024, 0.86, SIGNAL, radius=184).save(OUT / "splash-icon.png")
    compose(48, 0.86, SIGNAL).save(OUT / "favicon.png")
    print("ícones gerados em", OUT)


if __name__ == "__main__":
    main()
