/* =========================================================
   CONFIGURACIÓN: datos de contacto
   ========================================================= */
const CONFIG = {
  // WhatsApp en formato internacional, solo dígitos: 598 + el número sin el 0 inicial.
  whatsapp: "59899000000",
  // Teléfono tal como se muestra en el sitio.
  telefono: "099 000 000",
  // Correo donde llegan las consultas.
  email: "contacto@ejemplo.com",
};

/* ========================================================= */

(function () {
  "use strict";

  const $ = (sel, raiz) => (raiz || document).querySelector(sel);
  const $$ = (sel, raiz) => Array.from((raiz || document).querySelectorAll(sel));
  const sinMovimiento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const fmtEntero = new Intl.NumberFormat("es-UY", { maximumFractionDigits: 0, useGrouping: "always" });
  const fmtDecimal = new Intl.NumberFormat("es-UY", { maximumFractionDigits: 1 });
  const pesos = (n) => "$ " + fmtEntero.format(Math.round(n || 0));
  const numero = (texto) => {
    const n = parseInt(String(texto).replace(/\D/g, ""), 10);
    return Number.isFinite(n) ? n : 0;
  };
  const waUrl = (texto) =>
    "https://wa.me/" + CONFIG.whatsapp + (texto ? "?text=" + encodeURIComponent(texto) : "");
  const fechaLarga = (d) => d.toLocaleDateString("es-UY", { day: "numeric", month: "long", year: "numeric" });
  const fechaCorta = (d) => d.toLocaleDateString("es-UY");

  /* ---------- Datos de contacto, año y fecha de la carta ---------- */
  $$(".js-wa").forEach((a) => { a.href = waUrl(a.dataset.texto); });
  $$(".js-email").forEach((a) => { a.href = "mailto:" + CONFIG.email; a.textContent = CONFIG.email; });
  $$(".js-tel").forEach((a) => { a.href = "tel:+" + CONFIG.whatsapp; a.textContent = CONFIG.telefono.replace(/ /g, " "); });
  $$(".js-anio").forEach((el) => { el.textContent = String(new Date().getFullYear()); });
  $$(".js-fecha").forEach((el) => { el.textContent = "Montevideo, " + fechaLarga(new Date()); });

  /* ---------- Menú en pantallas chicas ---------- */
  const menuBoton = $(".menu-boton");
  const menu = $("#menu");
  if (menuBoton && menu) {
    const cerrar = () => {
      menu.classList.remove("abierto");
      menuBoton.setAttribute("aria-expanded", "false");
      menuBoton.textContent = "Menú";
    };
    menuBoton.addEventListener("click", () => {
      const abierto = menu.classList.toggle("abierto");
      menuBoton.setAttribute("aria-expanded", String(abierto));
      menuBoton.textContent = abierto ? "Cerrar" : "Menú";
    });
    $$("a", menu).forEach((a) => a.addEventListener("click", cerrar));
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && menu.classList.contains("abierto")) { cerrar(); menuBoton.focus(); }
    });
  }

  /* ---------- WhatsApp fijo ----------
     Se oculta mientras se ven los botones de la carta o la sección de contacto,
     que ya ofrecen escribir por WhatsApp. */
  const flotante = $(".wa-flotante");
  const zonasConBoton = $$(".carta-acciones, #contacto");
  if (flotante && zonasConBoton.length && "IntersectionObserver" in window) {
    const visibles = new Set();
    const observador = new IntersectionObserver((entradas) => {
      entradas.forEach((e) => (e.isIntersecting ? visibles.add(e.target) : visibles.delete(e.target)));
      const oculto = visibles.size > 0;
      flotante.classList.toggle("oculto", oculto);
      flotante.setAttribute("tabindex", oculto ? "-1" : "0");
      flotante.setAttribute("aria-hidden", String(oculto));
    }, { threshold: 0.1 });
    zonasConBoton.forEach((zona) => observador.observe(zona));
  }

  /* ---------- Anchos de los espacios para completar ----------
     Cada renglón mide lo mismo que lo que tiene escrito. */
  const medidor = document.createElement("span");
  medidor.setAttribute("aria-hidden", "true");
  medidor.style.cssText = "position:absolute;left:-9999px;top:0;white-space:pre;visibility:hidden;";
  document.body.appendChild(medidor);

  function medir(el, contenido) {
    const estilo = getComputedStyle(el);
    medidor.style.fontFamily = estilo.fontFamily;
    medidor.style.fontSize = estilo.fontSize;
    medidor.style.fontWeight = estilo.fontWeight;
    medidor.style.fontStyle = estilo.fontStyle;
    medidor.style.letterSpacing = estilo.letterSpacing;
    medidor.style.fontVariantNumeric = estilo.fontVariantNumeric;
    medidor.textContent = contenido;
    return { ancho: medidor.getBoundingClientRect().width, em: parseFloat(estilo.fontSize) };
  }

  function ajustarAncho(el) {
    if (!el.matches(".frase-texto .blanco, .formulario-frase .blanco")) return;
    // Relleno horizontal de .blanco: 0,12em de cada lado.
    if (el.tagName === "SELECT") {
      const opcion = el.options[el.selectedIndex];
      const { ancho, em } = medir(el, opcion ? opcion.text : "");
      el.style.width = Math.ceil(ancho + em * (0.12 + 1.2) + 4) + "px";
      return;
    }
    const { ancho, em } = medir(el, el.value || el.placeholder || "0");
    el.style.width = Math.ceil(Math.max(ancho, em * 0.8) + em * 0.24 + 4) + "px";
  }

  function ajustarTodos() { $$(".frase-texto .blanco, .formulario-frase .blanco").forEach(ajustarAncho); }
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(ajustarTodos);
  let esperaRedimension;
  window.addEventListener("resize", () => {
    clearTimeout(esperaRedimension);
    esperaRedimension = setTimeout(ajustarTodos, 150);
  });

  /* ---------- Anuncios para lectores de pantalla ---------- */
  const anuncio = document.createElement("p");
  anuncio.className = "sr";
  anuncio.setAttribute("aria-live", "polite");
  document.body.appendChild(anuncio);
  let anuncioPendiente;
  function anunciar(texto) {
    clearTimeout(anuncioPendiente);
    anuncioPendiente = setTimeout(() => { anuncio.textContent = texto; }, 800);
  }

  /* ---------- Cifras que cambian ----------
     La cifra se reemplaza al instante y se tiñe un momento para que se note el cambio. */
  const ultimoValor = new WeakMap();
  function mostrarMonto(el, valor) {
    if (!el) return;
    const anterior = ultimoValor.get(el);
    ultimoValor.set(el, valor);
    el.textContent = pesos(valor);
    if (anterior === undefined || anterior === valor || sinMovimiento) return;
    el.classList.remove("cambio");
    void el.offsetWidth;
    el.classList.add("cambio");
  }

  /* =========================================================
     Situaciones: el índice se convierte en pestañas
     Sin JavaScript, el índice son enlaces y todas las hojas se ven.
     ========================================================= */
  const consultorio = $("[data-pestanas]");
  if (consultorio) {
    const lista = $(".indice", consultorio);
    const hojas = $$(".hoja", consultorio);
    const ids = hojas.map((h) => h.id);
    lista.setAttribute("role", "tablist");
    lista.setAttribute("aria-orientation", "vertical");
    lista.setAttribute("aria-label", "Situaciones");

    const pestanas = $$("a", lista).map((a) => {
      const id = a.getAttribute("href").slice(1);
      const boton = document.createElement("button");
      boton.type = "button";
      boton.id = "pestana-" + id;
      boton.textContent = a.textContent;
      boton.setAttribute("role", "tab");
      boton.setAttribute("aria-controls", id);
      a.parentElement.setAttribute("role", "presentation");
      a.replaceWith(boton);
      return boton;
    });
    hojas.forEach((h) => {
      h.setAttribute("role", "tabpanel");
      h.setAttribute("aria-labelledby", "pestana-" + h.id);
      h.tabIndex = 0;
    });
    consultorio.classList.add("con-pestanas");

    const elegir = (id, opciones) => {
      const { enfocar = false, mostrar = false } = opciones || {};
      pestanas.forEach((b) => {
        const activa = b.getAttribute("aria-controls") === id;
        b.setAttribute("aria-selected", String(activa));
        b.tabIndex = activa ? 0 : -1;
        if (activa && enfocar) b.focus();
      });
      hojas.forEach((h) => { h.hidden = h.id !== id; });
      if (mostrar && window.matchMedia("(max-width: 1000px)").matches) {
        document.getElementById(id).scrollIntoView({ behavior: sinMovimiento ? "auto" : "smooth", block: "start" });
      }
    };

    pestanas.forEach((boton, i) => {
      boton.addEventListener("click", () => {
        const id = boton.getAttribute("aria-controls");
        elegir(id, { mostrar: true });
        history.replaceState(null, "", "#" + id);
      });
      boton.addEventListener("keydown", (e) => {
        const pasos = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 };
        let destino = null;
        if (e.key in pasos) destino = pestanas[(i + pasos[e.key] + pestanas.length) % pestanas.length];
        else if (e.key === "Home") destino = pestanas[0];
        else if (e.key === "End") destino = pestanas[pestanas.length - 1];
        if (!destino) return;
        e.preventDefault();
        elegir(destino.getAttribute("aria-controls"), { enfocar: true });
      });
    });

    // Los enlaces de la carta (#despido, #acoso…) abren su hoja antes de desplazarse.
    $$('a[href^="#"]').forEach((a) => {
      const id = a.getAttribute("href").slice(1);
      if (ids.includes(id)) a.addEventListener("click", () => elegir(id));
    });
    const desdeDireccion = () => {
      const id = decodeURIComponent(location.hash.slice(1));
      if (ids.includes(id)) { elegir(id); return true; }
      return false;
    };
    window.addEventListener("hashchange", desdeDireccion);
    if (!desdeDireccion()) elegir(ids[0]);
  }

  /* =========================================================
     Calculadora: la frase, los detalles y la estimación
     ========================================================= */
  const C = window.Calculo;
  const campos = $$("[data-campo]");

  if (C && campos.length) {
    const hoy = new Date();
    const estado = {
      forma: "mes",
      monto: 45000,
      jornal: 2000,
      jornalesAnio: 290,
      anios: 4,
      meses: 2,
      egreso: new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate()),
      licenciaPendiente: 0,
      especial: false,
    };

    const dos = (n) => String(n).padStart(2, "0");
    const isoFecha = (d) => d.getFullYear() + "-" + dos(d.getMonth() + 1) + "-" + dos(d.getDate());
    const leerFecha = (texto) => {
      const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(texto || "");
      return m ? new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3])) : null;
    };

    const dinero = $("#c-dinero");
    const periodo = $("#c-periodo");
    const dineroEtiqueta = $("#c-dinero-etiqueta");

    // Si cobra por jornal, el monto de la frase pasa a ser el jornal.
    function actualizarForma() {
      const esJornal = estado.forma === "jornal";
      if (dinero) dinero.dataset.campo = esJornal ? "jornal" : "monto";
      if (periodo) periodo.textContent = esJornal ? "por jornal" : "por mes";
      if (dineroEtiqueta) dineroEtiqueta.textContent = esJornal ? "Valor del jornal nominal, en pesos" : "Sueldo nominal por mes, en pesos";
      $$("[data-solo]").forEach((el) => { el.hidden = el.dataset.solo !== estado.forma; });
    }

    function antiguedad() {
      const total = C.mesesTotales(estado.anios, estado.meses);
      const a = Math.floor(total / 12);
      const m = total % 12;
      const partes = [];
      if (a > 0) partes.push(a === 1 ? "1 año" : a + " años");
      if (m > 0) partes.push(m === 1 ? "1 mes" : m + " meses");
      return { total, texto: partes.join(" y ") };
    }

    function valorParaCampo(el) {
      const clave = el.dataset.campo;
      if (clave === "monto" || clave === "jornal") return estado[clave] ? fmtEntero.format(estado[clave]) : "";
      if (clave === "egreso") return isoFecha(estado.egreso);
      return String(estado[clave]);
    }

    function sincronizar(origen) {
      campos.forEach((el) => {
        if (el === origen) return;
        const clave = el.dataset.campo;
        if (el.type === "radio") el.checked = el.value === estado.forma;
        else if (el.type === "checkbox") el.checked = Boolean(estado[clave]);
        else el.value = valorParaCampo(el);
        ajustarAncho(el);
      });
    }

    function leerCampo(el) {
      const clave = el.dataset.campo;
      if (el.type === "radio") { if (el.checked) estado.forma = el.value; }
      else if (el.type === "checkbox") estado[clave] = el.checked;
      else if (clave === "egreso") { const f = leerFecha(el.value); if (f) estado.egreso = f; }
      else estado[clave] = numero(el.value);
    }

    // Al salir de un campo: meses de más pasan a años, y los montos se escriben con puntos.
    function ordenar() {
      const total = C.mesesTotales(estado.anios, estado.meses);
      estado.anios = Math.min(Math.floor(total / 12), 60);
      estado.meses = total % 12;
      sincronizar(null);
    }

    const notasBase = [
      "No incluye horas extra, diferencias de sueldo ni los días trabajados del último mes.",
      "Muchos reclamos suman a la base de la indemnización la incidencia del aguinaldo, la licencia y el salario vacacional, y eso puede aumentar el monto.",
      "No aplica a la industria de la construcción, que tiene un régimen propio.",
    ];

    const texto = (sel, valor) => { const el = $(sel); if (el) el.textContent = valor; };

    function mensajeCuenta(r, ant) {
      const lineas = ["Hola, hice la cuenta en tu sitio y quiero revisarla en la consulta gratuita."];
      if (estado.forma === "jornal") {
        lineas.push("Cobro por jornal: " + pesos(estado.jornal) + ", unos " + estado.jornalesAnio + " jornales por año.");
      } else {
        lineas.push("Sueldo nominal: " + pesos(estado.monto) + " por mes.");
      }
      lineas.push("Tiempo trabajado: " + (ant.texto || "sin completar") + ".");
      lineas.push("Fecha de egreso: " + fechaCorta(estado.egreso) + ".");
      if (estado.especial) lineas.push("Creo que fue un despido especial.");
      lineas.push("Total estimado: " + pesos(r.total) + " (indemnización: " + pesos(r.indemnizacion) + ").");
      return lineas.join("\n");
    }

    function render(conAnuncio) {
      if (!$("#c-ipd")) return;
      const r = C.calcularLiquidacion(estado);
      const ant = antiguedad();

      let detalleIpd;
      if (ant.total === 0) detalleIpd = "Completá el tiempo trabajado";
      else if (estado.forma === "jornal") {
        detalleIpd = r.sinMinimoJornales
          ? "Con menos de 100 jornales trabajados no corresponde"
          : r.unidades + " jornales" + (r.enTope ? ", el máximo legal" : "");
      } else {
        detalleIpd = r.unidades + (r.unidades === 1 ? " sueldo" : " sueldos") + " por " + ant.texto + (r.enTope ? ", el máximo legal" : "");
      }

      mostrarMonto($("#c-ipd"), r.indemnizacion);
      texto("#c-ipd-detalle", detalleIpd);
      texto("#c-lic", pesos(r.licencia));
      texto("#c-lic-detalle", fmtDecimal.format(r.diasLicencia) + (r.diasLicencia === 1 ? " día" : " días"));
      texto("#c-sv", pesos(r.vacacional));
      texto("#c-ag", pesos(r.aguinaldo));
      texto("#c-ag-detalle", "Desde el " + fechaLarga(r.desdeAguinaldo));
      mostrarMonto($("#c-total"), r.total);

      const lista = $("#c-notas");
      if (lista) {
        const notas = [];
        if (estado.especial) notas.push(["En un despido especial la indemnización puede ser mayor que la común. La calculamos en la consulta.", true]);
        if (r.posiblePrueba && estado.forma === "mes") notas.push(["Si te despidieron durante un período de prueba acordado por escrito, puede no corresponder indemnización.", true]);
        notasBase.forEach((n) => notas.push([n, false]));
        lista.replaceChildren(...notas.map(([contenido, fuerte]) => {
          const li = document.createElement("li");
          li.textContent = contenido;
          if (fuerte) li.className = "nota-fuerte";
          return li;
        }));
      }

      const enlace = $(".js-wa-cuenta");
      if (enlace) enlace.href = waUrl(mensajeCuenta(r, ant));
      if (conAnuncio) anunciar("Total estimado: " + pesos(r.total) + ". Indemnización por despido: " + pesos(r.indemnizacion) + ".");
    }

    campos.forEach((el) => {
      const evento = el.type === "radio" || el.type === "checkbox" ? "change" : "input";
      el.addEventListener(evento, () => {
        leerCampo(el);
        if (el.type === "radio") actualizarForma();
        sincronizar(el);
        ajustarAncho(el);
        render(true);
      });
      if (el.classList.contains("blanco") && el.type !== "date") {
        el.addEventListener("focus", () => { requestAnimationFrame(() => el.select()); });
        el.addEventListener("blur", ordenar);
      }
    });

    actualizarForma();
    sincronizar(null);
    render(false);
  }

  /* =========================================================
     Formulario de contacto
     ========================================================= */
  const form = $("#formulario");
  if (form) {
    const campo = (nombre) => form.elements[nombre];
    const errorBox = $("#form-error");
    const horario = $(".js-horario", form);
    const preferencia = campo("preferencia");

    const actualizarHorario = () => {
      horario.hidden = preferencia.value !== "llamada";
      if (!horario.hidden) ajustarAncho(campo("horario"));
    };
    preferencia.addEventListener("change", actualizarHorario);
    actualizarHorario();

    $$(".formulario-frase .blanco", form).forEach((el) => {
      ajustarAncho(el);
      el.addEventListener(el.tagName === "SELECT" ? "change" : "input", () => {
        ajustarAncho(el);
        el.removeAttribute("aria-invalid");
      });
    });
    campo("acepto").addEventListener("change", () => campo("acepto").removeAttribute("aria-invalid"));

    // Los enlaces "Consultar sobre esto" eligen el tema en el formulario.
    $$("[data-tema]").forEach((a) => a.addEventListener("click", () => {
      campo("tema").value = a.dataset.tema;
      ajustarAncho(campo("tema"));
    }));

    let canalElegido = "whatsapp";
    $$("button[data-via]", form).forEach((b) => b.addEventListener("click", () => { canalElegido = b.dataset.via; }));

    const textoOpcion = (select) => select.options[select.selectedIndex].text.trim();

    function validar(canal) {
      const errores = [];
      const nombre = campo("nombre").value.trim();
      const contacto = campo("contacto").value.trim();
      const pref = preferencia.value;

      if (!nombre) errores.push([campo("nombre"), "Escribí tu nombre."]);

      const necesitaContacto =
        (canal === "email" && (pref === "whatsapp" || pref === "llamada")) ||
        (canal === "whatsapp" && pref === "correo");
      if (necesitaContacto && !contacto) {
        errores.push([campo("contacto"), pref === "correo" ? "Dejame tu correo para responderte." : "Dejame tu teléfono para responderte."]);
      }
      if (!campo("acepto").checked) errores.push([campo("acepto"), "Marcá la casilla para aceptar el uso de tus datos."]);
      return errores;
    }

    function construirMensaje() {
      const nombre = campo("nombre").value.trim();
      const empresa = campo("empresa").value.trim();
      const anios = numero(campo("antiguedad").value);
      const contacto = campo("contacto").value.trim();
      const mensaje = campo("mensaje").value.trim();
      const tema = campo("tema").value;
      const pref = preferencia.value;

      const lineas = ["Hola, me llamo " + nombre + "."];
      lineas.push(tema === "otra" ? "Te escribo por otro tema." : "Me pasó que " + textoOpcion(campo("tema")) + ".");
      const textoAnios = anios === 1 ? "1 año" : anios + " años";
      if (empresa && anios) lineas.push("La empresa es " + empresa + " y mi antigüedad es de " + textoAnios + ".");
      else if (empresa) lineas.push("La empresa es " + empresa + ".");
      else if (anios) lineas.push("Mi antigüedad es de " + textoAnios + ".");
      lineas.push("Esto " + textoOpcion(campo("urgencia")) + ".");
      if (pref === "llamada") lineas.push("Prefiero que me respondas por una llamada, " + textoOpcion(campo("horario")) + ".");
      else lineas.push("Prefiero que me respondas por " + textoOpcion(preferencia) + ".");
      if (contacto) lineas.push("Mi teléfono o correo es " + contacto + ".");
      if (mensaje) lineas.push("", mensaje);
      return lineas.join("\n");
    }

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const canal = (e.submitter && e.submitter.dataset.via) || canalElegido;

      $$("[aria-invalid]", form).forEach((el) => el.removeAttribute("aria-invalid"));
      const errores = validar(canal);
      if (errores.length) {
        errorBox.replaceChildren(...errores.map(([, mensaje], i) => {
          const linea = document.createElement("span");
          linea.textContent = mensaje;
          if (i < errores.length - 1) linea.append(document.createElement("br"));
          return linea;
        }));
        errorBox.hidden = false;
        errores.forEach(([el]) => el.setAttribute("aria-invalid", "true"));
        errores[0][0].focus();
        return;
      }
      errorBox.hidden = true;

      const mensaje = construirMensaje();
      if (canal === "email") {
        const tema = textoOpcion(campo("tema"));
        const asunto = "Consulta laboral: " + tema.charAt(0).toUpperCase() + tema.slice(1);
        window.location.href = "mailto:" + CONFIG.email + "?subject=" + encodeURIComponent(asunto) + "&body=" + encodeURIComponent(mensaje);
      } else {
        window.open(waUrl(mensaje), "_blank", "noopener");
      }
    });
  }
})();
