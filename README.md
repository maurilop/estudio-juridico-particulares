# Sitio web: abogada laboralista en Montevideo

Sitio estático (HTML, CSS y JavaScript, sin dependencias ni compilación) para trabajadoras y trabajadores. Muestra las situaciones que atiende, calcula la indemnización por despido y recibe consultas por WhatsApp o correo. Se publica con GitHub Pages desde la rama `main`.

## Archivos

| Archivo | Qué tiene |
| --- | --- |
| `index.html` | Página principal: portada con calculadora rápida, situaciones, calculadora completa, cómo trabajo, quién soy, preguntas y contacto. |
| `guia-despido.html` | Guía "Qué hacer si te despiden". |
| `privacidad.html` | Política de privacidad (Ley 18.331). |
| `styles.css` | Diseño. Los colores y medidas están al principio, en `:root`: petróleo, lino y un acento miel mínimo. |
| `script.js` | Datos de contacto (`CONFIG`), menú, calculadora en pantalla y formulario. |
| `calculo.js` | Reglas y cuentas de la calculadora (`REGLAS`). |
| `fonts/` | Tipografías Faustina (títulos) y Source Sans 3 (texto), con licencia OFL, servidas desde el propio sitio. |
| `favicon.svg` | Ícono de la pestaña. |

## Datos para completar antes de difundir el sitio

1. **WhatsApp, teléfono y correo:** al principio de `script.js`, en `CONFIG`. El WhatsApp va con 598 y sin el 0 inicial (099 123 456 → `59899123456`).
2. **En los tres archivos `.html`:**
   - `Nombre Apellido`.
   - `Nombre`, en el botón "WhatsApp con Nombre".
   - `N.º 00000`, la matrícula.
   - `Dirección de la oficina`.
3. **En "Quién soy" (`index.html`):**
   - Los nombres de los posgrados.
   - Los idiomas.
   - Docencia y publicaciones, que está comentado y se activa si corresponde.
   - Los dos párrafos de presentación: el de compliance hay que confirmarlo.
4. **Foto:** guardarla como `foto.jpg`, en retrato vertical 4:5. Aparece en dos lugares de `index.html`, cada uno marcado con un comentario: la firma de la portada, en círculo, y "Quién soy". Mientras no esté la foto se ven las iniciales `NA`; si se prefiere dejar iniciales, hay que cambiarlas por las reales.

Para encontrar todo lo pendiente:

```sh
grep -n "Nombre Apellido\|WhatsApp con Nombre\|00000\|Dirección de la oficina\|ejemplo.com\|>NA<" *.html script.js
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
