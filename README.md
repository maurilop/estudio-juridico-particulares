# Sitio web: abogada laboralista para empresas en Montevideo

Sitio estático (HTML, CSS y JavaScript, sin dependencias ni compilación) para empresas. Muestra los servicios ordenados por situación (cumplimiento, desvinculaciones, reclamos en el Ministerio de Trabajo, inspecciones, acoso y accidentes de trabajo), calcula el costo de un egreso y recibe consultas por WhatsApp o correo. Se publica con GitHub Pages desde la rama `main`.

**La versión para trabajadoras y trabajadores** quedó guardada, tal como estaba antes del cambio de foco, en la rama `version-trabajadores`. Para volver a publicarla, se puede fusionar esa rama en `main` o elegirla como rama de publicación en *Settings → Pages* del repositorio.

## El diseño

El sitio toma la sobriedad editorial de los grandes estudios jurídicos: titulares serif livianos, mucho aire, bloques geométricos y fotografías que representan ideas. Le suma una identidad propia, el sello de lacre de la abogada. Las fotos que muestran lugares son de Montevideo, para que se note que el estudio es uruguayo.

- **Portada:** el titular, la propuesta y la primera reunión sin costo, junto a una foto de una puerta abierta, enmarcada con dos bloques en L y con el sello estampado encima.
- **Declaración:** una franja oscura con la frase que resume a quién asesora y en qué temas. Cada tema es un enlace a su situación.
- **Banda "Antes de decidir":** el Palacio Salvo entre la niebla, a todo el ancho, con una tarjeta superpuesta que invita a consultar antes de despedir, sancionar o cambiar condiciones de trabajo.
- **Quién soy:** una galería de la Facultad de Derecho de la Udelar, hasta que haya un retrato.
- **Sello:** lleva sus iniciales en el centro y, en el aro, su nombre, "Abogada laboralista" y la matrícula. Se repite como logotipo, en la portada, en el membrete de la calculadora, en el pie y en el favicon. En "Quién soy" está además el sello profesional rectangular.
- **Formulario:** se completa como una frase ("Me llamo… y soy… en… Te escribo por…"). Lo que escribe la persona aparece en cursiva color lacre.
- **Colores:** blanco, marfil para los fondos alternos, tinta (azul petróleo casi negro), pizarra para los bloques y lacre (bordó) para las acciones. Están al principio de `styles.css`, en `:root`.
- **Tipografías:** Newsreader, de Production Type, para títulos y frases; usa su eje óptico, que afina el dibujo en los tamaños grandes. Host Grotesk, de Element Type, para el texto y la interfaz.

## Movimiento

La idea es "primero se lee, después se firma": todo entra en el orden de lectura (etiqueta, título, texto y acciones), la foto se revela a la par y los bloques y el sello llegan al final. Los recorridos son cortos, las curvas frenan al llegar y cada cosa se mueve una sola vez.

- **Tiempos y curvas:** están al principio de `styles.css`, en `:root`: breve (160 ms, para los cambios al pasar el puntero), medio (480 ms, textos y tarjetas), largo (900 ms, fotos y bloques), un escalón de 80 ms entre un elemento y el siguiente, y las curvas "calma" y "firme".
- **Al cargar:** la portada y el comienzo de las páginas internas entran con animaciones de CSS.
- **Al bajar:** `script.js` marca lo que se mueve (la lista `MOVIMIENTOS`) y lo muestra cuando entra en pantalla: los encabezados, las listas y las tarjetas aparecen de a uno; las fotos se revelan desde abajo; los bloques en L crecen desde su esquina y el sello profesional se estampa al final. Para sumar un elemento, alcanza con agregar una fila a esa lista.
- **Fotos:** se bajan apenas se abre la página, con prioridad baja para no demorar la de la portada, así ya están listas cuando llegás a su sección. Cada foto aparece recién cuando está lista para dibujarse: si alguna tarda, su sección la espera hasta 3 segundos y después entra con su transición.
- **Resaltador:** en la declaración ("Para empresas"), al pasar el puntero por un enlace entra una franja lacre claro, como un resaltador, y las letras se vuelven tinta a su paso. Con el teclado pasa lo mismo al llegar con Tab. Para que un enlace nuevo se resalte, su texto va dentro de un `<span>`: `<a href="#desvinculacion"><span>desvinculaciones</span></a>`. Sin el `<span>` queda subrayado común.
- **Movimiento reducido:** si el dispositivo pide reducir el movimiento, no se anima nada. Al imprimir, todo aparece.

## Archivos

| Archivo | Qué tiene |
| --- | --- |
| `index.html` | Página principal: portada, declaración, servicios por situación, calculadora, antes de decidir, cómo trabajo, quién soy, novedades, preguntas y contacto. |
| `guia-despido.html` | Guía "Cómo desvincular a un trabajador". |
| `privacidad.html` | Política de privacidad (Ley 18.331). |
| `novedades.html` | Novedades laborales: cada una con su fecha, su explicación y su fuente. |
| `styles.css` | Diseño. Los colores y medidas están al principio, en `:root`. |
| `script.js` | Datos de contacto (`CONFIG`), menú, pestañas de servicios, calculadora en pantalla y formulario. |
| `calculo.js` | Reglas y cuentas de la calculadora (`REGLAS`). |
| `fonts/` | Newsreader (normal y cursiva) y Host Grotesk, con licencia OFL, servidas desde el propio sitio. |
| `fotos/` | Las fotos del sitio, en WebP. |
| `favicon.svg` | Ícono de la pestaña: el sello con las iniciales en contornos. |
| `herramientas/sello.py` | Regenera `favicon.svg` con otras iniciales. |
| `herramientas/novedades.py` | Copia las tres últimas novedades a la portada. |

## Datos para completar antes de difundir el sitio

El sitio usa un nombre de ejemplo, **Verónica Hernández**, con las iniciales **VH**. Hay que reemplazarlo en todos los lugares:

1. **WhatsApp, teléfono y correo:** al principio de `script.js`, en `CONFIG`. El WhatsApp va con 598 y sin el 0 inicial (099 123 456 → `59899123456`).
2. **En los cuatro archivos `.html`:**
   - `Verónica Hernández`, también en el botón "WhatsApp con Verónica Hernández".
   - `Dra. Verónica Hernández`, en el sello profesional de "Quién soy".
   - `N.º 00000` y `MAT. 00000`, la matrícula.
   - `Dirección de la oficina`.
3. **El sello:** en cada `.html`, al principio, hay un bloque marcado con el comentario `SELLO`. Ahí se cambian las iniciales (`VH`, en dos lugares) y el texto del aro (`DRA. VERÓNICA HERNÁNDEZ • ABOGADA LABORALISTA • MAT. 00000 •`). Si el texto nuevo es mucho más largo o más corto, hay que ajustar el tamaño de la letra del aro (`font-size`, hoy 9.8) para que no quede ni apretado ni con un hueco.
4. **El favicon:** se regenera con las iniciales nuevas:

   ```sh
   pip install fonttools brotli
   python3 herramientas/sello.py VH
   ```

5. **En "Quién soy" (`index.html`):**
   - Los nombres de los posgrados.
   - Los idiomas.
   - Docencia y publicaciones, que está comentado y se activa si corresponde.
   - Los dos párrafos de presentación: el de compliance hay que confirmarlo.
   - La atención: hoy dice que se reúne en la empresa o en la oficina y que trabaja online en todo el país.
   - El título: "Doctora en Derecho y Ciencias Sociales", que es el que otorga la Udelar.
6. **Retrato:** cuando haya una foto de la abogada, guardarla como `fotos/retrato.webp` (vertical, 4:5, unos 1000 × 1250 px) y reemplazar la foto de la Facultad de Derecho en "Quién soy", donde lo indica el comentario. En ese caso, quitar también su crédito del pie.

Para encontrar todo lo pendiente:

```sh
grep -n "Verónica Hernández\|VERÓNICA\|>VH<\|00000\|Dirección de la oficina\|ejemplo.com" *.html script.js
```

## Decisiones del estudio por confirmar

El sitio da por hechas algunas condiciones comerciales que tiene que confirmar la abogada:

- **Primera reunión sin costo:** aparece en la portada, en el contacto, en las preguntas y en los cierres de las páginas internas.
- **Formas de trabajo:** una iguala mensual para el asesoramiento permanente y un presupuesto por asunto para lo puntual, siempre por escrito ("Cómo trabajo" y "Preguntas frecuentes").
- **Respuesta en el día**, de lunes a viernes, y atención en todo el país.
- **Tono:** el sitio le habla a quien decide en la empresa y la tutea con voseo ("Contame qué necesita tu empresa"). Si se prefiere un trato de usted, hay que cambiarlo en todos los textos.

## Revisión legal pendiente

La calculadora y algunos textos citan reglas generales de la ley uruguaya. Las tomé de fuentes secundarias y tienen que pasar por la revisión de la abogada antes de difundir el sitio.

**Calculadora (`calculo.js`, objeto `REGLAS`).** Cada criterio se cambia en una línea:

- **Mensuales:** un sueldo por cada año o fracción, con un máximo de seis. Con `fraccionCuentaComoAnio: true`, cualquier fracción cuenta como año completo. Algunas fuentes dicen que solo cuenta la fracción mayor a seis meses; para ese criterio va `false`.
- **Jornaleros:** 25 jornales por cada año con 240 jornales o más; si son menos, 2 jornales por cada 25 trabajados. Hacen falta 100 jornales como mínimo y el máximo es de 150.
- **Licencia:** 20 días por año, más un día cada cuatro años desde el quinto, proporcional a los días trabajados en el año de egreso. Se suman los días pendientes que la persona indica.
- **Salario vacacional:** 100 % del jornal líquido. El líquido se estima como el 80 % del nominal (`factorLiquido`).
- **Aguinaldo:** la doceava parte de lo ganado en el semestre en curso (del 1/12 al 31/5 y del 1/6 al 30/11).
- **No calcula:** la incidencia del aguinaldo y la licencia en la base de la indemnización, los despidos especiales, las partidas variables, los aportes patronales ni el régimen de la construcción. La pantalla lo aclara.

**Textos del sitio que citan normas o plazos.** Los verifiqué en noviembre de 2026 con búsquedas en IMPO, Justia, gub.uy y estudios uruguayos, pero sin poder abrir el texto completo de IMPO desde la sesión de trabajo:

- **Plazos para reclamar:** un año desde el egreso, y créditos de hasta cinco años (Ley 18.091). Están en "Recibí una citación", en las preguntas y en la guía.
- **Ministerio de Trabajo:** la audiencia de conciliación es previa al juicio, y si la empresa no concurre ni lo justifica puede recibir una multa (Decreto 520/984, de uno a diez jornales mínimos por cada trabajador involucrado).
- **Demanda:** en el proceso laboral común, la empresa tiene diez días hábiles para contestarla (Ley 18.572, con la redacción de la Ley 18.847). Las fuentes numeran el artículo de forma distinta.
- **Acoso sexual:** la Ley 18.561 y el Decreto 256/017. La empresa debe prevenir y proteger a quien denuncia; la investigación interna es por escrito, reservada, con las dos partes y de 60 días como máximo; si la empresa no puede investigar, envía la denuncia a la Inspección de Trabajo en cinco días.
- **Accidentes de trabajo:** el seguro obligatorio del BSE (Ley 16.074), que le cobra los costos a la empresa no asegurada; la reparación integral si hubo culpa grave, y la responsabilidad penal del empleador cuando no adopta las medidas de seguridad y pone en peligro grave la vida o la salud de un trabajador (Ley 19.196).
- **Tercerizaciones:** la responsabilidad solidaria de la empresa que contrata, que pasa a subsidiaria si controla la documentación de la contratista (Leyes 18.099 y 18.251).
- **Inspecciones:** la IGTSS actúa de oficio o por denuncia (Decreto 371/022), y la empresa puede presentar descargos. El Decreto 224/026, que regula de nuevo sus procedimientos, es reciente: conviene revisarlo y, quizás, contarlo como novedad.
- **Sindicatos:** la Ley 17.940, de protección de la actividad sindical, y la posibilidad de pedir el reintegro.
- **Despidos especiales:** embarazo, certificación médica, reintegro después de un accidente de trabajo, actividad sindical, denuncia de acoso, y licencia por paternidad o adopción y los 30 días posteriores al regreso, que llevan tres meses de sueldo además de la indemnización (Ley 19.161, art. 8 bis). Aparecen en "Tengo que desvincular a alguien", en la calculadora y en la guía.
- **Guía para desvincular:** el reclamo por daño moral si el despido es abusivo, los recargos por pagar tarde la liquidación, la baja en el BPS y el valor de un acuerdo firmado en el Ministerio de Trabajo.

**Otros puntos a revisar:**

- **Publicidad:** qué dice el Código de Ética del Colegio de Abogados del Uruguay sobre anunciar la "primera reunión sin costo".
- **Datos personales:** con la Ley 18.331, si corresponde inscribir la base de datos de clientes ante la URCDP.

## Fotos

Las fotos están recortadas y guardadas en `fotos/`, así que el sitio no depende de otros servicios. Si una foto muestra un lugar, tiene que ser de Montevideo; la portada todavía tiene una foto genérica que hay que reemplazar.

La de la Facultad de Derecho es de [Wikimedia Commons](https://commons.wikimedia.org) y tiene licencia [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/deed.es): se puede usar, también con fines comerciales, siempre que se mencione al autor y la licencia. Por eso su crédito está en el pie de `index.html`. La versión recortada se comparte con la misma licencia. Si se usa en redes, el crédito va en la descripción del posteo.

| Archivo | Dónde va | Original | Autor y licencia |
| --- | --- | --- | --- |
| `facultad.webp` | Quién soy (hasta que haya un retrato) | [Facultad de Derecho, exterior 14](https://commons.wikimedia.org/wiki/File:Facultad_de_Derecho,_exterior_14.jpg) | Marcos Mendizábal, CC BY-SA 3.0 |

Las demás son de [Unsplash](https://unsplash.com/license): se pueden usar gratis, también con fines comerciales, y no exigen mencionar al autor. Lo que la licencia no permite es venderlas sin modificarlas ni usarlas para armar un servicio de fotos que compita con Unsplash.

| Archivo | Dónde va | Original |
| --- | --- | --- |
| `puertas.webp` | Portada (a reemplazar por una de Montevideo) | `images.unsplash.com/photo-1481277542470-605612bd2d61` |
| `salvo-niebla.webp` | Banda "Antes de decidir" (en prueba) | [Nikolai Kolosov](https://unsplash.com/photos/jjYSryAmA8o) |
| `arquitectura.webp` | Ya no se usa: era la foto anterior de la banda. Se conserva mientras se prueba la nueva. | `images.unsplash.com/photo-1518005020951-eccb494ad742` |
| `firma.webp` | Cómo trabajo (espejada) | [Gabrielle Henderson](https://unsplash.com/es/fotos/woman-signing-on-white-printer-paper-beside-woman-about-to-touch-the-documents-HJckKnwCXxQ) |
| `pluma.webp` | Guía "Cómo desvincular a un trabajador" | `images.unsplash.com/photo-1455390582262-044cdead277a` |

Para cambiar una foto alcanza con reemplazar el archivo por otro con la misma proporción: 4:5 en la portada y en las columnas, 2:1 en la banda y 16:9 en la guía. Si la nueva foto pide crédito, hay que agregarlo en el pie de `index.html`.

## Privacidad

El sitio no usa cookies, analítica ni servicios externos: las tipografías y las fotos se sirven desde el propio sitio. El formulario no guarda datos; arma el mensaje y lo abre en el WhatsApp o en el correo de la persona. Si más adelante se agrega analítica, hay que sumar un aviso de cookies con opción de rechazar y actualizar `privacidad.html`.

## Novedades laborales

La portada muestra las tres últimas y `novedades.html` tiene todas. Para que el sitio se vea al día, conviene sumar al menos una por mes.

Para agregar una:

1. En `novedades.html`, copiar un bloque `<article class="novedad">` completo y pegarlo **al principio** de la lista, porque van de la más nueva a la más vieja.
2. Cambiar el `id` (sin espacios ni tildes, por ejemplo `aumento-salario-minimo-2027`), el tema, la fecha (el `datetime` en formato año-mes-día y el texto visible), el título, el resumen, el texto, "Qué significa para tu empresa" y la fuente. Cada novedad lleva al menos un enlace a una fuente oficial o a un medio reconocido.
3. Actualizar la portada:

   ```sh
   python3 herramientas/novedades.py
   ```

   El script copia las tres primeras a `index.html` y pone la fecha de la última como "Última actualización". Si falta algún dato o el orden de las fechas está mal, avisa y no cambia nada.

Las ocho novedades iniciales (noviembre de 2026) las verifiqué en IMPO, el Ministerio de Trabajo, Presidencia y El Observador. Con el cambio de foco se reescribió lo que significa cada una para las empresas, sin cambiar los hechos ni las fuentes. Están escritas en primera persona y la abogada tiene que revisarlas antes de difundir el sitio, como el resto de los textos.

## Cómo agregar contenido

- **Nueva guía:** copiar `guia-despido.html`, cambiar el título, la descripción y los pasos, y enlazarla desde "Preguntas frecuentes" en `index.html`.
- **Novedades laborales:** ver la sección siguiente.

## Ver el sitio en la computadora

```sh
python3 -m http.server 8000
```

Después, abrir http://localhost:8000 en el navegador.
