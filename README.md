# Sitio web: abogada laboralista en Montevideo

Sitio estático (HTML, CSS y JavaScript, sin dependencias ni compilación) para trabajadoras y trabajadores. Muestra las situaciones que atiende, calcula la indemnización por despido y recibe consultas por WhatsApp o correo. Se publica con GitHub Pages desde la rama `main`.

## La identidad: "Lacre"

El sello de lacre es el que cierra una carta personal: confidencialidad, compromiso y firma propia. El sitio funciona como la papelería de la abogada:

- **Portada:** es una carta, con fecha de Montevideo, firma, aclaración, sello y posdata ("P. D.") con la primera consulta gratis.
- **Sello:** lleva sus iniciales en el centro y, en el aro, su nombre, "Abogada laboralista" y la matrícula. Es la "firma y sello" con que firma los escritos, y se repite como logotipo, en el favicon, en los pasos de "Cómo trabajo" y en la estimación de la calculadora.
- **Formulario:** es tu respuesta a la carta ("Para Ana Pérez"). Lo que completa la persona aparece en cursiva color lacre, como escrito a mano.
- **Colores:** papel blanco, papel secante (rosado muy pálido) para los fondos alternos, lacre (bordó) y tinta.
- **Tipografía:** Petrona, de Ringo Seeber, en todo el sitio. La cursiva hace de firma.

## Archivos

| Archivo | Qué tiene |
| --- | --- |
| `index.html` | Página principal: la carta, situaciones, calculadora, cómo trabajo, quién soy, preguntas y contacto. |
| `guia-despido.html` | Guía "Qué hacer si te despiden". |
| `privacidad.html` | Política de privacidad (Ley 18.331). |
| `styles.css` | Diseño. Los colores y medidas están al principio, en `:root`. |
| `script.js` | Datos de contacto (`CONFIG`), menú, pestañas de situaciones, calculadora en pantalla y formulario. |
| `calculo.js` | Reglas y cuentas de la calculadora (`REGLAS`). |
| `fonts/` | Tipografía Petrona, normal y cursiva, con licencia OFL, servida desde el propio sitio. |
| `favicon.svg` | Ícono de la pestaña: el sello con las iniciales en contornos. |
| `herramientas/sello.py` | Regenera `favicon.svg` con otras iniciales. |

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
6. **Foto:** cuando haya un retrato, guardarlo como `foto.jpg` y agregarlo en "Quién soy", donde lo indica el comentario.

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

## Privacidad

El sitio no usa cookies, analítica ni servicios externos: la tipografía se sirve desde el propio sitio. El formulario no guarda datos; arma el mensaje y lo abre en el WhatsApp o en el correo de la persona. Si más adelante se agrega analítica, hay que sumar un aviso de cookies con opción de rechazar y actualizar `privacidad.html`.

## Cómo agregar contenido

- **Nueva guía:** copiar `guia-despido.html`, cambiar el título, la descripción y los pasos, y enlazarla desde "Preguntas frecuentes" en `index.html`.
- **Novedades laborales:** la idea es publicar alertas breves y fechadas sobre cambios normativos o fallos relevantes, como una serie con nombre propio. Conviene sumarlas cuando estén las primeras, para no mostrar una sección vacía.

## Ver el sitio en la computadora

```sh
python3 -m http.server 8000
```

Después, abrir http://localhost:8000 en el navegador.
