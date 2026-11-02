# Sitio web – Abogada laboral

Sitio estático (HTML + CSS + JS, sin dependencias ni build) para presentar los servicios y recibir consultas.

## Archivos
- `index.html` – contenido del sitio (textos, servicios, preguntas frecuentes).
- `styles.css` – diseño.
- `script.js` – menú móvil, formulario de contacto y **datos de contacto**.

## Qué personalizar
1. **WhatsApp y correo**: al inicio de `script.js`, en `CONFIG`.
2. En `index.html` busca y reemplaza:
   - `Nombre Apellido` (aparece en el encabezado, "Sobre mí" y el pie).
   - Los datos marcados con `(completar)` (universidad, posgrados, colegio de abogados).
   - Teléfono visible `+00 0000 0000`, dirección y horario (sección Contacto).
   - Cifras del recuadro principal (`+10` años, `+500` casos).
3. **Foto**: guarda una imagen como `foto.jpg` y en `index.html` reemplaza
   `<div class="about-photo" ...><span>Foto</span></div>` por
   `<img class="about-photo" src="foto.jpg" alt="Foto de Nombre Apellido">`.

## Formulario de contacto
No requiere servidor: arma el mensaje con los datos ingresados y lo abre en
WhatsApp o en el programa de correo de la persona, dirigido a los datos de `CONFIG`.

## Ver en local
Abre `index.html` en el navegador.
