// Lógica de horarios. Corre en el navegador y en Node: no usar APIs de Node acá.

export const DIAS = ['lun', 'mar', 'mie', 'jue', 'vie', 'sab', 'dom'];
export const NOMBRES_DIA = {
  lun: 'Lunes', mar: 'Martes', mie: 'Miércoles', jue: 'Jueves',
  vie: 'Viernes', sab: 'Sábado', dom: 'Domingo',
};
export const HORA_VALIDA = /^([01]\d|2[0-3]):[0-5]\d$/;

const DIA_MIN = 1440;
const SEMANA = DIA_MIN * 7;
const DESDE_INGLES = { Mon: 'lun', Tue: 'mar', Wed: 'mie', Thu: 'jue', Fri: 'vie', Sat: 'sab', Sun: 'dom' };
const CIERRA_PRONTO_MIN = 30;

export function aMinutos(hhmm) {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
}

// "08:00" -> "8:00", como se dice en Argentina.
export function formatoHora(minutos) {
  const m = ((minutos % DIA_MIN) + DIA_MIN) % DIA_MIN;
  return `${Math.floor(m / 60)}:${String(m % 60).padStart(2, '0')}`;
}

// Día y minuto actuales en la zona del negocio, sin importar dónde esté el visitante.
export function ahoraEn(zona, fecha = new Date()) {
  const partes = new Intl.DateTimeFormat('en-US', {
    timeZone: zona, weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
  }).formatToParts(fecha);
  const valor = (tipo) => partes.find((p) => p.type === tipo).value;
  return { dia: DESDE_INGLES[valor('weekday')], minutos: Number(valor('hour')) * 60 + Number(valor('minute')) };
}

// Pasa los horarios a intervalos en minutos desde el lunes 00:00.
// Si el cierre es menor o igual a la apertura, el turno pasa la medianoche.
export function intervalos(horarios = {}) {
  const lista = [];
  DIAS.forEach((dia, i) => {
    for (const [desde, hasta] of horarios[dia] ?? []) {
      const inicio = i * DIA_MIN + aMinutos(desde);
      let fin = i * DIA_MIN + aMinutos(hasta);
      if (fin <= inicio) fin += DIA_MIN;
      lista.push({ inicio, fin });
    }
  });
  return lista;
}

// Devuelve el estado para el cartel, o null si no hay horarios cargados.
export function estadoActual(horarios, { dia, minutos }) {
  const lista = intervalos(horarios);
  if (lista.length === 0) return null;
  const ahora = DIAS.indexOf(dia) * DIA_MIN + minutos;

  // El turno del domingo a la noche puede seguir el lunes temprano: también se mira una semana atrás.
  for (const { inicio, fin } of lista) {
    for (const t of [ahora, ahora + SEMANA]) {
      if (t >= inicio && t < fin) {
        const faltan = fin - t;
        if (faltan <= CIERRA_PRONTO_MIN) {
          return { estado: 'cierra-pronto', titulo: 'Abierto', detalle: `Cierra en ${faltan} min` };
        }
        return { estado: 'abierto', titulo: 'Abierto', detalle: `Cierra a las ${formatoHora(fin)}` };
      }
    }
  }

  const espera = Math.min(...lista.map(({ inicio }) => (((inicio - ahora) % SEMANA) + SEMANA) % SEMANA));
  const apertura = ahora + espera;
  const diasDespues = Math.floor(apertura / DIA_MIN) - Math.floor(ahora / DIA_MIN);
  const hora = formatoHora(apertura);
  let cuando;
  if (diasDespues === 0) cuando = `Abre hoy a las ${hora}`;
  else if (diasDespues === 1) cuando = `Abre mañana a las ${hora}`;
  else cuando = `Abre el ${NOMBRES_DIA[DIAS[Math.floor(apertura / DIA_MIN) % 7]].toLowerCase()} a las ${hora}`;
  return { estado: 'cerrado', titulo: 'Cerrado', detalle: cuando };
}
