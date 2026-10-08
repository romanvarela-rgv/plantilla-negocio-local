import { test } from 'node:test';
import assert from 'node:assert/strict';
import { estadoActual, ahoraEn, formatoHora } from '../src/lib/horario.mjs';

const cortado = { lun: [['08:00', '13:00'], ['16:00', '20:00']], mar: [['08:00', '13:00']] };
const t = (dia, hhmm) => ({ dia, minutos: Number(hhmm.slice(0, 2)) * 60 + Number(hhmm.slice(3)) });

test('abierto en horario cortado', () => {
  assert.deepEqual(estadoActual(cortado, t('lun', '10:00')),
    { estado: 'abierto', titulo: 'Abierto', detalle: 'Cierra a las 13:00' });
  assert.equal(estadoActual(cortado, t('lun', '17:00')).detalle, 'Cierra a las 20:00');
});

test('cierra pronto en los últimos 30 minutos', () => {
  assert.deepEqual(estadoActual(cortado, t('lun', '12:40')),
    { estado: 'cierra-pronto', titulo: 'Abierto', detalle: 'Cierra en 20 min' });
});

test('el minuto de cierre ya cuenta como cerrado', () => {
  assert.equal(estadoActual(cortado, t('lun', '13:00')).estado, 'cerrado');
});

test('cerrado entre turnos abre hoy', () => {
  assert.equal(estadoActual(cortado, t('lun', '14:00')).detalle, 'Abre hoy a las 16:00');
});

test('cerrado a la noche abre mañana', () => {
  assert.equal(estadoActual(cortado, t('lun', '21:00')).detalle, 'Abre mañana a las 8:00');
});

test('después del último día abre el lunes', () => {
  assert.equal(estadoActual(cortado, t('mar', '14:00')).detalle, 'Abre el lunes a las 8:00');
});

test('turno que pasa la medianoche', () => {
  const bar = { vie: [['20:00', '02:00']] };
  assert.equal(estadoActual(bar, t('vie', '23:00')).detalle, 'Cierra a las 2:00');
  assert.equal(estadoActual(bar, t('sab', '01:00')).estado, 'abierto');
  assert.equal(estadoActual(bar, t('sab', '01:45')).estado, 'cierra-pronto');
  assert.equal(estadoActual(bar, t('sab', '02:00')).estado, 'cerrado');
});

test('turno del domingo que sigue el lunes de madrugada', () => {
  const bar = { dom: [['22:00', '03:00']] };
  assert.equal(estadoActual(bar, t('lun', '01:00')).estado, 'abierto');
  assert.equal(estadoActual(bar, t('lun', '04:00')).detalle, 'Abre el domingo a las 22:00');
});

test('abierto las 24 horas un día', () => {
  assert.equal(estadoActual({ sab: [['00:00', '00:00']] }, t('sab', '15:00')).estado, 'abierto');
});

test('sin horarios devuelve null', () => {
  assert.equal(estadoActual({}, t('lun', '10:00')), null);
});

test('usa la zona del negocio y no la del visitante', () => {
  // 2026-10-05 13:30 UTC es lunes 10:30 en Buenos Aires (UTC-3).
  const fecha = new Date('2026-10-05T13:30:00Z');
  assert.deepEqual(ahoraEn('America/Argentina/Buenos_Aires', fecha), { dia: 'lun', minutos: 630 });
  assert.deepEqual(ahoraEn('Asia/Tokyo', fecha), { dia: 'lun', minutos: 22 * 60 + 30 });
});

test('formato de hora sin cero adelante', () => {
  assert.equal(formatoHora(8 * 60), '8:00');
  assert.equal(formatoHora(24 * 60 + 90), '1:30');
});
