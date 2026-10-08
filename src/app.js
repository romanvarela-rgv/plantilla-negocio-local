import { ahoraEn, estadoActual } from './horario.mjs';

const fuente = document.getElementById('datos-horario');
const cartel = document.querySelector('[data-cartel]');

function actualizar() {
  const { zona, horarios } = JSON.parse(fuente.textContent);
  const ahora = ahoraEn(zona);

  document.querySelectorAll('.horarios tr').forEach((fila) => {
    fila.classList.toggle('hoy', fila.dataset.dia === ahora.dia);
  });

  const estado = estadoActual(horarios, ahora);
  if (!cartel || !estado) return;
  cartel.dataset.estado = estado.estado;
  cartel.querySelector('[data-cartel-titulo]').textContent = estado.titulo;
  cartel.querySelector('[data-cartel-detalle]').textContent = estado.detalle;
  cartel.hidden = false;
}

if (fuente) {
  try {
    actualizar();
    setInterval(actualizar, 60_000);
  } catch {
    // Si algo falla, el cartel queda oculto y la tabla de horarios sigue visible.
  }
}
