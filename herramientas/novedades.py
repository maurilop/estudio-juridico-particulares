#!/usr/bin/env python3
"""Copia las tres últimas novedades de novedades.html a la portada (index.html).

Uso, desde la carpeta del sitio:

    python3 herramientas/novedades.py

En novedades.html, las novedades van de la más nueva a la más vieja. Cada una es un
<article class="novedad" id="..."> con su tema, su fecha (<time>), su título (<h2>)
y un resumen (<p class="novedad-resumen">). El script:

1. Arma las tarjetas de las tres primeras y las pone en index.html, entre los
   comentarios <!-- NOVEDADES:INICIO --> y <!-- NOVEDADES:FIN -->.
2. Pone la fecha de la más nueva como "Última actualización" en novedades.html.

No usa dependencias: alcanza con Python 3.
"""
import pathlib
import re
import sys

RAIZ = pathlib.Path(__file__).resolve().parent.parent
CANTIDAD = 3


def buscar(patron, texto, que, ident):
    encontrado = re.search(patron, texto, re.S)
    if not encontrado:
        sys.exit(f"Falta {que} en la novedad «{ident}» de novedades.html.")
    return encontrado.groups() if encontrado.lastindex > 1 else encontrado.group(1).strip()


def main():
    ruta_novedades = RAIZ / "novedades.html"
    ruta_portada = RAIZ / "index.html"
    novedades = ruta_novedades.read_text(encoding="utf-8")
    portada = ruta_portada.read_text(encoding="utf-8")

    articulos = re.findall(r'<article class="novedad" id="([^"]+)">(.*?)</article>', novedades, re.S)
    if len(articulos) < CANTIDAD:
        sys.exit(f"novedades.html tiene {len(articulos)} novedades; hacen falta al menos {CANTIDAD}.")

    ids = [ident for ident, _ in articulos]
    repetidos = sorted({i for i in ids if ids.count(i) > 1})
    if repetidos:
        sys.exit("Hay novedades con el mismo id: " + ", ".join(repetidos))

    tarjetas = []
    fechas = []
    for ident, cuerpo in articulos:
        fecha_iso, fecha = buscar(r'<time datetime="([^"]+)">(.*?)</time>', cuerpo, "la fecha", ident)
        fechas.append(fecha_iso)
        if len(tarjetas) == CANTIDAD:
            continue
        tema = buscar(r'<span class="novedad-tema">(.*?)</span>', cuerpo, "el tema", ident)
        titulo = buscar(r"<h2>(.*?)</h2>", cuerpo, "el título", ident)
        resumen = buscar(r'<p class="novedad-resumen">(.*?)</p>', cuerpo, "el resumen", ident)
        tarjetas.append(
            "          <article class=\"novedad-tarjeta\">\n"
            f"            <p class=\"novedad-meta\"><span class=\"novedad-tema\">{tema}</span> <time datetime=\"{fecha_iso}\">{fecha}</time></p>\n"
            f"            <h3><a href=\"novedades.html#{ident}\">{titulo}</a></h3>\n"
            f"            <p>{resumen}</p>\n"
            "          </article>"
        )

    if fechas != sorted(fechas, reverse=True):
        sys.exit("Las novedades de novedades.html tienen que ir de la más nueva a la más vieja.")

    bloque = "        <div class=\"novedades-grilla\">\n" + "\n".join(tarjetas) + "\n        </div>\n"
    portada, cambios = re.subn(
        r"(<!-- NOVEDADES:INICIO -->\n).*?([ \t]*<!-- NOVEDADES:FIN -->)",
        lambda m: m.group(1) + bloque + m.group(2),
        portada,
        flags=re.S,
    )
    if cambios != 1:
        sys.exit("No encontré los comentarios NOVEDADES:INICIO y NOVEDADES:FIN en index.html.")

    fecha_iso, fecha = buscar(r'<time datetime="([^"]+)">(.*?)</time>', articulos[0][1], "la fecha", articulos[0][0])
    novedades, cambios = re.subn(
        r'(<p class="pagina-fecha">Última actualización: )<time datetime="[^"]+">.*?</time>',
        lambda m: m.group(1) + f'<time datetime="{fecha_iso}">{fecha}</time>',
        novedades,
    )
    if cambios != 1:
        sys.exit("No encontré la línea «Última actualización» en novedades.html.")

    ruta_portada.write_text(portada, encoding="utf-8")
    ruta_novedades.write_text(novedades, encoding="utf-8")
    print(f"Listo: la portada muestra {CANTIDAD} de {len(articulos)} novedades. Última actualización: {fecha}.")


if __name__ == "__main__":
    main()
