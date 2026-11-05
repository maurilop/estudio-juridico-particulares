/* =========================================================
   Calculadora de despido: reglas y cuentas
   ---------------------------------------------------------
   Reglas generales de la ley uruguaya, simplificadas para dar
   una estimación orientativa. Si hay que ajustar un criterio,
   se cambia en REGLAS y el resto del sitio se actualiza solo.
   ========================================================= */
(function (global) {
  "use strict";

  const REGLAS = {
    // Mensuales: un sueldo por cada año o fracción trabajada, con un máximo de seis.
    sueldosMaximos: 6,
    // true: cualquier fracción de año cuenta como un año completo.
    // false: solo cuenta la fracción mayor a seis meses.
    fraccionCuentaComoAnio: true,

    // Jornaleros (Ley 12.597): 25 jornales por cada año con 240 jornales trabajados o más.
    // En los años (o fracciones) con menos, 2 jornales por cada 25 trabajados.
    jornalesPorAnio: 25,
    umbralJornalesAnio: 240,
    jornalesPorCada25: 2,
    jornalesMinimos: 100, // con menos de 100 jornales trabajados no hay indemnización común
    jornalesMaximos: 150,

    // Licencia: 20 días por año. Desde el quinto año, un día más cada cuatro años.
    diasLicenciaBase: 20,
    // Salario vacacional: 100 % del jornal líquido de licencia.
    // El líquido se estima como el 80 % del nominal (aportes personales aproximados).
    factorLiquido: 0.8,
    // Valor de un día para un sueldo mensual: sueldo / 30.
    diasDelMes: 30,
  };

  /* ---------- Fechas ---------- */

  function soloFecha(d) {
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  }

  function diasEntre(desde, hasta) {
    return Math.round((soloFecha(hasta) - soloFecha(desde)) / 86400000);
  }

  function diasDelAnio(anio) {
    return (anio % 4 === 0 && anio % 100 !== 0) || anio % 400 === 0 ? 366 : 365;
  }

  // El aguinaldo se genera por semestre: del 1 de diciembre al 31 de mayo
  // y del 1 de junio al 30 de noviembre.
  function inicioSemestre(fecha) {
    const anio = fecha.getFullYear();
    const mes = fecha.getMonth();
    if (mes === 11) return new Date(anio, 11, 1);
    if (mes >= 5) return new Date(anio, 5, 1);
    return new Date(anio - 1, 11, 1);
  }

  function fechaIngreso(egreso, mesesTrabajados) {
    const base = soloFecha(egreso);
    return new Date(base.getFullYear(), base.getMonth() - mesesTrabajados, base.getDate() + 1);
  }

  /* ---------- Reglas ---------- */

  function mesesTotales(anios, meses) {
    return Math.max(0, Math.floor(anios || 0) * 12 + Math.floor(meses || 0));
  }

  function sueldosPorDespido(anios, meses) {
    const total = mesesTotales(anios, meses);
    if (total === 0) return 0;
    const enteros = Math.floor(total / 12);
    const resto = total % 12;
    const fraccion = REGLAS.fraccionCuentaComoAnio ? resto > 0 : resto > 6;
    return Math.min(enteros + (fraccion ? 1 : 0), REGLAS.sueldosMaximos);
  }

  function jornalesPorDespido(anios, meses, jornalesAnio) {
    const porAnioTrabajados = Math.max(0, jornalesAnio || 0);
    const total = mesesTotales(anios, meses);
    const trabajados = (porAnioTrabajados * total) / 12;
    if (trabajados < REGLAS.jornalesMinimos) return 0;

    const enteros = Math.floor(total / 12);
    const fraccion = (total % 12) / 12;
    const porAnio =
      porAnioTrabajados >= REGLAS.umbralJornalesAnio
        ? REGLAS.jornalesPorAnio
        : REGLAS.jornalesPorCada25 * Math.floor(porAnioTrabajados / 25);
    const porFraccion = REGLAS.jornalesPorCada25 * Math.floor((porAnioTrabajados * fraccion) / 25);
    return Math.min(enteros * porAnio + porFraccion, REGLAS.jornalesMaximos);
  }

  function diasLicenciaAnual(aniosCompletos) {
    const extra = aniosCompletos >= 5 ? Math.floor((aniosCompletos - 1) / 4) : 0;
    return REGLAS.diasLicenciaBase + extra;
  }

  /* ---------- Liquidación completa ----------
     datos = {
       forma: "mes" | "jornal",
       monto: sueldo nominal mensual,
       jornal: valor del jornal nominal,
       jornalesAnio: jornales trabajados por año,
       anios, meses: tiempo trabajado,
       egreso: Date,
       licenciaPendiente: días sin tomar de años anteriores,
     } */
  function calcularLiquidacion(datos) {
    const esJornal = datos.forma === "jornal";
    const total = mesesTotales(datos.anios, datos.meses);
    const egreso = soloFecha(datos.egreso || new Date());
    const ingreso = fechaIngreso(egreso, total);
    const valorBase = Math.max(0, esJornal ? datos.jornal || 0 : datos.monto || 0);
    const jornalesAnio = Math.max(0, datos.jornalesAnio || 0);

    // Indemnización por despido común
    const unidades = esJornal
      ? jornalesPorDespido(datos.anios, datos.meses, jornalesAnio)
      : sueldosPorDespido(datos.anios, datos.meses);
    const indemnizacion = Math.round(unidades * valorBase);
    const enTope = esJornal ? unidades >= REGLAS.jornalesMaximos : unidades >= REGLAS.sueldosMaximos;

    // Licencia no gozada: la proporcional del año de egreso + la pendiente de años anteriores
    const valorDia = esJornal ? valorBase : valorBase / REGLAS.diasDelMes;
    const inicioAnio = new Date(egreso.getFullYear(), 0, 1);
    const desdeLicencia = ingreso > inicioAnio ? ingreso : inicioAnio;
    const diasEnElAnio = total === 0 ? 0 : Math.max(0, diasEntre(desdeLicencia, egreso) + 1);
    const diasProporcionales =
      (diasLicenciaAnual(Math.floor(total / 12)) * diasEnElAnio) / diasDelAnio(egreso.getFullYear());
    const diasLicencia = diasProporcionales + Math.max(0, datos.licenciaPendiente || 0);
    const licencia = Math.round(diasLicencia * valorDia);
    const vacacional = Math.round(diasLicencia * valorDia * REGLAS.factorLiquido);

    // Aguinaldo proporcional: la doceava parte de lo ganado en el semestre
    const semestre = inicioSemestre(egreso);
    const desdeAguinaldo = ingreso > semestre ? ingreso : semestre;
    const diasSemestre = total === 0 ? 0 : Math.max(0, diasEntre(desdeAguinaldo, egreso) + 1);
    const ganadoPorDia = esJornal ? (valorBase * jornalesAnio) / 365 : (valorBase * 12) / 365;
    const aguinaldo = Math.round((ganadoPorDia * diasSemestre) / 12);

    return {
      unidades,
      enTope,
      indemnizacion,
      diasLicencia,
      licencia,
      vacacional,
      aguinaldo,
      desdeAguinaldo,
      total: indemnizacion + licencia + vacacional + aguinaldo,
      sinMinimoJornales: esJornal && total > 0 && (jornalesAnio * total) / 12 < REGLAS.jornalesMinimos,
      posiblePrueba: total > 0 && total < 3,
    };
  }

  const Calculo = {
    REGLAS,
    mesesTotales,
    sueldosPorDespido,
    jornalesPorDespido,
    diasLicenciaAnual,
    inicioSemestre,
    calcularLiquidacion,
  };

  global.Calculo = Calculo;
  if (typeof module !== "undefined" && module.exports) module.exports = Calculo;
})(typeof window !== "undefined" ? window : globalThis);
