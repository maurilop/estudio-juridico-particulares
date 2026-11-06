# Sitio web: abogada laboralista en Montevideo

Sitio estático (HTML, CSS y JavaScript, sin dependencias ni compilación) para trabajadoras y trabajadores. Muestra las situaciones que atiende, calcula la indemnización por despido y recibe consultas por WhatsApp o correo. Se publica con GitHub Pages desde la rama `main`.

## El diseño

El sitio toma la sobriedad editorial de los grandes estudios jurídicos: titulares serif livianos, mucho aire, bloques geométricos y fotografías abstractas. Le suma una identidad propia, el sello de lacre de la abogada.

- **Portada:** el titular, la propuesta y la primera consulta gratuita, junto a una foto de una puerta abierta, enmarcada con dos bloques en L y con el sello estampado encima.
- **Declaración:** una franja oscura con la frase que resume a quién representa y en qué casos. Cada caso es un enlace a su situación.
- **Banda "Antes de firmar":** una foto de arquitectura a todo el ancho, con una tarjeta superpuesta.
- **Sello:** lleva sus iniciales en el centro y, en el aro, su nombre, "Abogada laboralista" y la matrícula. Se repite como logotipo, en la portada, en el membrete de la calculadora, en el pie y en el favicon. En "Quién soy" está además el sello profesional rectangular.
- **Formulario:** se completa como una frase ("Me llamo… Te escribo porque…"). Lo que escribe la persona aparece en cursiva color lacre.
- **Colores:** blanco, marfil para los fondos alternos, tinta (azul petróleo casi negro), pizarra para los bloques y lacre (bordó) para las acciones. Están al principio de `styles.css`, en `:root`.
- **Tipografías:** Newsreader, de Production Type, para títulos y frases; usa su eje óptico, que afina el dibujo en los tamaños grandes. Host Grotesk, de Element Type, para el texto y la interfaz.

## Archivos

| Archivo | Qué tiene |
| --- | --- |
| `index.html` | Página principal: portada, declaración, situaciones, calculadora, antes de firmar, cómo trabajo, quién soy, preguntas y contacto. |
| `guia-despido.html` | Guía "Qué hacer si te despiden". |
| `privacidad.html` | Política de privacidad (Ley 18.331). |
| `novedades.html` | Novedades laborales: cada una con su fecha, su explicación y su fuente. |
| `styles.css` | Diseño. Los colores y medidas están al principio, en `:root`. |
| `script.js` | Datos de contacto (`CONFIG`), menú, pestañas de situaciones, calculadora en pantalla y formulario. |
| `calculo.js` | Reglas y cuentas de la calculadora (`REGLAS`). |
| `fonts/` | Newsreader (normal y cursiva) y Host Grotesk, con licencia OFL, servidas desde el propio sitio. |
| `fotos/` | Las fotos del sitio, en WebP. |
| `favicon.svg` | Ícono de la pestaña: el sello con las iniciales en contornos. |
| `herramientas/sello.py` | Regenera `favicon.svg` con otras iniciales. |
| `herramientas/novedades.py` | Copia las tres últimas novedades a la portada. |

## Datos para completar antes de difundir el sitio

El sitio usa un nombre de ejemplo, **Ana Pérez**, con las iniciales **AP**. Hay que reemplazarlo en todos los lugares:

1. **WhatsApp, teléfono y correo:** al principio de `script.js`, en `CONFIG`. El WhatsApp va con 598 y sin el 0 inicial (099 123 456 → `59899123456`).
2. **En los tres archivos `.html`:**
   - `Ana Pérez` (y `Ana`, en el botón "WhatsApp con Ana").
   - `Dra. Ana Pérez`, en el sello profesional de "Quién soy".
   - `N.º 00000` y `MAT. 00000`, la matrícula.
   - `Dirección de la oficina`.
3. **El sello:** en cada `.html`, al principio, hay un bloque marcado con el comentario `SELLO`. Ahí se cambian las iniciales (`AP`, en dos lugares) y el texto del aro (`DRA. ANA PÉREZ • ABOGADA LABORALISTA • MAT. 00000 •`). Si el texto nuevo es mucho más largo o más corto, conviene revisar que el aro quede parejo.
4. **El favicon:** se regenera con las iniciales nuevas:

   ```sh
   pip install fonttools brotli
   python3 herramientas/sello.py AP
   ```

5. **En "Quién soy" (`index.html`):**
   - Los nombres de los posgrados.
   - Los idiomas.
   - Docencia y publicaciones, que está comentado y se activa si corresponde.
   - Los dos párrafos de presentación: el de compliance hay que confirmarlo.
   - El título: "Doctora en Derecho y Ciencias Sociales", que es el que otorga la Udelar.
6. **Retrato:** cuando haya una foto de la abogada, guardarla como `fotos/retrato.webp` (vertical, 4:5, unos 1000 × 1250 px) y reemplazar la foto de la biblioteca en "Quién soy", donde lo indica el comentario.

Para encontrar todo lo pendiente:

```sh
grep -n "Ana Pérez\|Ana<\|>AP<\|00000\|Dirección de la oficina\|ejemplo.com" *.html script.js
```

## Revisión legal pendiente

La calculadora y algunos textos citan reglas generales de la ley uruguaya. Las tomé de fuentes secundarias y tienen que pasar por la revisión de la abogada antes de difundir el sitio.

**Calculadora (`calculo.js`, objeto `REGLAS`).** Cada criterio se cambia en una línea:

- **Mensuales:** un sueldo por cada año o fracción, con un máximo de seis. Con `fraccionCuentaComoAnio: true`, cualquier fracción cuenta como año completo. Algunas fuentes dicen que solo cuenta la fracción mayor a seis meses; para ese criterio va `false`.
- **Jornaleros:** 25 jornales por cada año con 240 jornales o más; si son menos, 2 jornales por cada 25 trabajados. Hacen falta 100 jornales como mínimo y el máximo es de 150.
- **Licencia:** 20 días por año, más un día cada cuatro años desde el quinto, proporcional a los días trabajados en el año de egreso. Se suman los días pendientes que la persona indica.
- **Salario vacacional:** 100 % del jornal líquido. El líquido se estima como el 80 % del nominal (`factorLiquido`).
- **Aguinaldo:** la doceava parte de lo ganado en el semestre en curso (del 1/12 al 31/5 y del 1/6 al 30/11).
- **No calcula:** la incidencia del aguinaldo y la licencia en la base de la indemnización, los despidos especiales, las partidas variables ni el régimen de la construcción. La pantalla lo aclara.

**Textos del sitio que citan normas o plazos:**

- **Plazos:** un año desde el egreso para reclamar, y créditos de hasta cinco años (Ley 18.091).
- **Ministerio de Trabajo:** la audiencia de conciliación es previa al juicio, y desde 20 UR hay que ir con abogado.
- **Acoso sexual:** la Ley 18.561.
- **Accidentes de trabajo:** la cobertura del BSE.

**Otros puntos a revisar:**

- **Publicidad:** qué dice el Código de Ética del Colegio de Abogados del Uruguay sobre anunciar la "primera consulta gratis".
- **Datos personales:** con la Ley 18.331, si corresponde inscribir la base de datos de clientes ante la URCDP.

## Fotos

Son de [Unsplash](https://unsplash.com/license): se pueden usar gratis, también con fines comerciales, y no exigen mencionar al autor. Lo que la licencia no permite es venderlas sin modificarlas ni usarlas para armar un servicio de fotos que compita con Unsplash. Están recortadas y guardadas en `fotos/`, así que el sitio no depende de Unsplash.

| Archivo | Dónde va | Original |
| --- | --- | --- |
| `puertas.webp` | Portada | `images.unsplash.com/photo-1481277542470-605612bd2d61` |
| `arquitectura.webp` | Banda "Antes de firmar" | `images.unsplash.com/photo-1518005020951-eccb494ad742` |
| `conversacion.webp` | Cómo trabajo | `images.unsplash.com/photo-1517245386807-bb43f82c33c4` |
| `biblioteca.webp` | Quién soy (hasta que haya un retrato) | `images.unsplash.com/photo-1505664194779-8beaceb93744` |
| `pluma.webp` | Guía "Qué hacer si te despiden" | `images.unsplash.com/photo-1455390582262-044cdead277a` |

Para cambiar una foto alcanza con reemplazar el archivo por otro con la misma proporción: 4:5 en la portada y en las columnas, 2:1 en la banda y 16:9 en la guía.

## Privacidad

El sitio no usa cookies, analítica ni servicios externos: las tipografías y las fotos se sirven desde el propio sitio. El formulario no guarda datos; arma el mensaje y lo abre en el WhatsApp o en el correo de la persona. Si más adelante se agrega analítica, hay que sumar un aviso de cookies con opción de rechazar y actualizar `privacidad.html`.

## Novedades laborales

La portada muestra las tres últimas y `novedades.html` tiene todas. Para que el sitio se vea al día, conviene sumar al menos una por mes.

Para agregar una:

1. En `novedades.html`, copiar un bloque `<article class="novedad">` completo y pegarlo **al principio** de la lista, porque van de la más nueva a la más vieja.
2. Cambiar el `id` (sin espacios ni tildes, por ejemplo `aumento-salario-minimo-2027`), el tema, la fecha (el `datetime` en formato año-mes-día y el texto visible), el título, el resumen, el texto, "Qué significa para vos" y la fuente. Cada novedad lleva al menos un enlace a una fuente oficial o a un medio reconocido.
3. Actualizar la portada:

   ```sh
   python3 herramientas/novedades.py
   ```

   El script copia las tres primeras a `index.html` y pone la fecha de la última como "Última actualización". Si falta algún dato o el orden de las fechas está mal, avisa y no cambia nada.

Las ocho novedades iniciales (noviembre de 2026) las verifiqué en IMPO, el Ministerio de Trabajo, Presidencia y El Observador, pero están escritas en primera persona y la abogada tiene que revisarlas antes de difundir el sitio, como el resto de los textos.

## Cómo agregar contenido

- **Nueva guía:** copiar `guia-despido.html`, cambiar el título, la descripción y los pasos, y enlazarla desde "Preguntas frecuentes" en `index.html`.
- **Novedades laborales:** ver la sección siguiente.

## Ver el sitio en la computadora

```sh
python3 -m http.server 8000
```

Después, abrir http://localhost:8000 en el navegador.
