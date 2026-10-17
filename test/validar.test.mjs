import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validar } from '../src/lib/validar.mjs';

// Errores de carga que no son de seguridad: los que dejarían un sitio incompleto o con SEO roto.

const valido = () => ({
  nombre: 'Kiosco Test',
  rubro: 'Kiosco',
  descripcion: 'Un kiosco de prueba.',
  url: 'https://ejemplo.com',
  whatsapp: '5491123456789',
  direccion: { calle: 'Calle 1', localidad: 'Merlo', provincia: 'Buenos Aires' },
});

const campos = (errores) => errores.map((e) => e.split(':')[0]);

test('rechaza algo que no es un objeto', () => {
  for (const n of [null, [], 'hola', 42]) {
    assert.deepEqual(validar(n), ['negocio.json: tiene que ser un objeto']);
  }
});

test('exige los campos obligatorios', () => {
  const errores = validar({});
  assert.deepEqual(campos(errores), ['nombre', 'rubro', 'descripcion', 'url', 'whatsapp', 'direccion']);
});

test('exige calle, localidad y provincia', () => {
  const errores = validar({ ...valido(), direccion: { calle: '  ' } });
  assert.deepEqual(campos(errores), ['direccion.calle', 'direccion.localidad', 'direccion.provincia']);
});

test('limita el largo del nombre y de la meta description', () => {
  assert.ok(validar({ ...valido(), nombre: 'x'.repeat(81) }).some((e) => e.startsWith('nombre: máximo')));
  assert.ok(validar({ ...valido(), descripcion: 'x'.repeat(161) }).some((e) => e.startsWith('descripcion: máximo')));
  assert.deepEqual(validar({ ...valido(), descripcion: 'x'.repeat(160) }), []);
});

test('los textos opcionales no pueden quedar vacíos', () => {
  const errores = validar({ ...valido(), eslogan: '', mensajeWhatsapp: 3 });
  assert.deepEqual(campos(errores), ['eslogan', 'mensajeWhatsapp']);
});

test('indexar y mapa tienen que ser booleanos', () => {
  const errores = validar({ ...valido(), indexar: 'false', mapa: 0 });
  assert.deepEqual(campos(errores), ['indexar', 'mapa']);
});

test('valida idioma, tipoSchema y zona horaria', () => {
  assert.deepEqual(validar({ ...valido(), idioma: 'es-AR', tipoSchema: 'Bakery', zonaHoraria: 'America/Argentina/Cordoba' }), []);
  const errores = validar({ ...valido(), idioma: 'español', tipoSchema: 'Local Business', zonaHoraria: 'Marte/Olympus' });
  assert.deepEqual(campos(errores), ['idioma', 'tipoSchema', 'zonaHoraria']);
});

test('acepta teléfonos con formato local', () => {
  for (const telefono of ['+54 11 2345-6789', '(0220) 482-1234']) {
    assert.deepEqual(validar({ ...valido(), telefono }), [], telefono);
  }
  assert.ok(validar({ ...valido(), telefono: 'llamar al kiosco' }).some((e) => e.startsWith('telefono')));
});

test('rechaza turnos que abren y cierran a la misma hora', () => {
  const errores = validar({ ...valido(), horarios: { sab: [['09:00', '13:00'], ['17:00', '17:00']] } });
  assert.deepEqual(errores, ['horarios.sab[1]: apertura y cierre iguales']);
});

test('acepta un turno que pasa la medianoche', () => {
  assert.deepEqual(validar({ ...valido(), horarios: { vie: [['20:00', '02:00']] } }), []);
});

test('exige los campos de servicios, reseñas y preguntas', () => {
  const errores = validar({
    ...valido(),
    servicios: [{ descripcion: 'sin título' }],
    resenas: [{ texto: 'Muy bueno' }],
    preguntas: [{ pregunta: '¿Abren feriados?' }],
  });
  assert.deepEqual(campos(errores), ['servicios[0].titulo', 'resenas[0].autor', 'preguntas[0].respuesta']);
  assert.deepEqual(campos(validar({ ...valido(), servicios: 'fotocopias' })), ['servicios']);
});

test('las estrellas van de 1 a 5 y son enteras', () => {
  for (const estrellas of [0, 6, 4.5, '5']) {
    const errores = validar({ ...valido(), resenas: [{ texto: 'Bien', autor: 'Ana', estrellas }] });
    assert.deepEqual(campos(errores), ['resenas[0].estrellas'], String(estrellas));
  }
});

test('solo acepta las redes soportadas', () => {
  const errores = validar({ ...valido(), redes: { instagram: 'https://instagram.com/kiosco', twitter: 'https://x.com/kiosco' } });
  assert.deepEqual(campos(errores), ['redes.twitter']);
});

test('el crédito necesita texto', () => {
  assert.deepEqual(campos(validar({ ...valido(), credito: { url: 'https://romangaelvarela.online' } })), ['credito.texto']);
});

test('solo se usan los colores marca y acento', () => {
  const errores = validar({ ...valido(), tema: { colores: { marca: '#9E2B25', fondo: '#FFFFFF' } } });
  assert.deepEqual(campos(errores), ['tema.colores.fondo']);
});
