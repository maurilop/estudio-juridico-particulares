"""Genera favicon.svg: el sello de lacre con las iniciales en contornos.

Uso, desde la carpeta del sitio:
    pip install fonttools brotli
    python3 herramientas/sello.py AP

Las iniciales del sello dentro de las páginas son texto: se cambian a mano
en los <text> de #sello y #sello-simple de cada archivo .html.
"""
import math
import sys
from pathlib import Path

from fontTools.pens.boundsPen import BoundsPen
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont

RAIZ = Path(__file__).resolve().parent.parent
LACRE, CLARO = "#7a1f2b", "#f6e4e1"


def cera(cx, cy, radio, puntos=180):
    """Contorno de un sello de lacre: un círculo con el borde irregular y dos gotas."""
    coords = []
    for i in range(puntos):
        t = i / puntos * 2 * math.pi
        r = (radio + 0.032 * radio * math.sin(7 * t + 0.4) + 0.024 * radio * math.sin(12 * t + 1.3)
             + 0.016 * radio * math.sin(19 * t + 2.1))
        for centro, ancho, alto in ((0.55, 0.16, 0.07), (3.9, 0.12, 0.05)):
            d = math.atan2(math.sin(t - centro), math.cos(t - centro))
            r += alto * radio * math.exp(-(d / ancho) ** 2)
        coords.append((cx + r * math.cos(t), cy + r * math.sin(t)))
    return "M" + " L".join(f"{x:.1f} {y:.1f}" for x, y in coords) + "Z"


def monograma(iniciales, cx, cy, alto_objetivo):
    fuente = TTFont(RAIZ / "fonts" / "petrona-latin-wght-italic.woff2")
    instantiateVariableFont(fuente, {"wght": 560}, inplace=True)
    glifos = fuente.getGlyphSet()
    mapa = fuente.getBestCmap()
    nombres = [mapa[ord(letra)] for letra in iniciales]

    partes, avance = [], 0
    for i, nombre in enumerate(nombres):
        partes.append((avance, nombre))
        avance += glifos[nombre].width - (60 if i < len(nombres) - 1 else 0)

    limites = BoundsPen(glifos)
    for x, nombre in partes:
        glifos[nombre].draw(TransformPen(limites, (1, 0, 0, 1, x, 0)))
    xmin, ymin, xmax, ymax = limites.bounds
    escala = alto_objetivo / (ymax - ymin)
    dx = cx - (xmin + (xmax - xmin) / 2) * escala
    dy = cy + (ymin + (ymax - ymin) / 2) * escala

    lapiz = SVGPathPen(glifos, ntos=lambda v: f"{v:.2f}".rstrip("0").rstrip("."))
    for x, nombre in partes:
        glifos[nombre].draw(TransformPen(lapiz, (escala, 0, 0, -escala, dx + x * escala, dy)))
    return lapiz.getCommands()


if __name__ == "__main__":
    iniciales = sys.argv[1] if len(sys.argv) > 1 else "AP"
    svg = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">'
           f'<path d="{cera(32, 32, 29)}" fill="{LACRE}"/>'
           f'<path d="{monograma(iniciales, 32, 33, 24)}" fill="{CLARO}"/></svg>\n')
    (RAIZ / "favicon.svg").write_text(svg, encoding="utf-8")
    print(f"favicon.svg generado con las iniciales {iniciales}")
