/* =========================================================
   CONFIGURACIÓN — edita estos datos de contacto
   ========================================================= */
const CONFIG = {
  // Número de WhatsApp en formato internacional, solo dígitos (sin +, espacios ni guiones)
  whatsapp: "5491100000000",
  // Correo donde llegarán las consultas
  email: "contacto@ejemplo.com",
};

/* ========================================================= */

// Aplica la configuración a todos los enlaces del sitio
document.querySelectorAll(".js-whatsapp").forEach((a) => {
  a.href = `https://wa.me/${CONFIG.whatsapp}`;
});
document.querySelectorAll(".js-email").forEach((a) => {
  a.href = `mailto:${CONFIG.email}`;
  a.textContent = CONFIG.email;
});

// Año en el pie de página
document.getElementById("year").textContent = new Date().getFullYear();

// Menú móvil
const toggle = document.querySelector(".nav-toggle");
const menu = document.getElementById("menu");
toggle.addEventListener("click", () => {
  const open = menu.classList.toggle("open");
  toggle.setAttribute("aria-expanded", String(open));
  toggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
});
menu.querySelectorAll("a").forEach((a) =>
  a.addEventListener("click", () => {
    menu.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
  })
);

// Formulario: arma el mensaje y lo envía por WhatsApp o correo
const form = document.getElementById("contact-form");
const errorBox = document.getElementById("form-error");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const via = e.submitter?.dataset.via || "whatsapp";
  const data = Object.fromEntries(new FormData(form));

  const errors = [];
  if (!data.nombre.trim()) errors.push("tu nombre");
  if (!data.mensaje.trim()) errors.push("una breve descripción de tu caso");
  if (errors.length) {
    errorBox.textContent = `Por favor, indica ${errors.join(" y ")}.`;
    errorBox.hidden = false;
    return;
  }
  errorBox.hidden = true;

  const lines = [`Hola, mi nombre es ${data.nombre.trim()}.`, `Tema: ${data.tema}`];
  if (data.telefono.trim()) lines.push(`Teléfono: ${data.telefono.trim()}`);
  if (data.correo.trim()) lines.push(`Correo: ${data.correo.trim()}`);
  lines.push("", data.mensaje.trim());
  const text = lines.join("\n");

  if (via === "email") {
    const subject = `Consulta laboral: ${data.tema}`;
    window.location.href = `mailto:${CONFIG.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(text)}`;
  } else {
    window.open(`https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(text)}`, "_blank", "noopener");
  }
});
