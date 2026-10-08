import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { esc, jsonSeguro } from '../src/lib/html.mjs';
import { validar } from '../src/lib/validar.mjs';
import { textoSobre, contraste } from '../src/lib/color.mjs';
import { build } from '../scripts/build.mjs';

const valido = () => ({
  nombre: 'Kiosco Test',
  rubro: 'Kiosco',
  descripcion: 'Un kiosco de prueba.',
  url: 'https://ejemplo.com',
  whatsapp: '5491123456789',
  direccion: { calle: 'Calle 1', localidad: 'Merlo', provincia: 'Buenos Aires' },
  horarios: { lun: [['09:00', '18:00']] },
});

test('esc escapa los caracteres peligrosos', () => {
  assert.equal(esc(`<img src=x onerror="a('b')">&`), '&lt;img src=x onerror=&quot;a(&#39;b&#39;)&quot;&gt;&amp;');
  assert.equal(esc(undefined), '');
});

test('jsonSeguro no deja cerrar el <script>', () => {
  const salida = jsonSeguro({ x: '</script><script>alert(1)</script>' });
  assert.ok(!salida.includes('<'));
  assert.deepEqual(JSON.parse(salida), { x: '</script><script>alert(1)</script>' });
});

test('un negocio válido no tiene errores', () => {
  assert.deepEqual(validar(valido()), []);
});

test('rechaza URLs que no son https', () => {
  for (const url of ['javascript:alert(1)', 'http://ejemplo.com', 'data:text/html,hola', 'ejemplo.com', 'https://ejemplo.com/\nDisallow: /', 'https://ejemplo.com/"x']) {
    assert.ok(validar({ ...valido(), url }).some((e) => e.startsWith('url:')), url);
    assert.ok(validar({ ...valido(), redes: { instagram: url } }).some((e) => e.startsWith('redes.instagram')), url);
  }
});

test('rechaza colores que podrían inyectar CSS', () => {
  const errores = validar({ ...valido(), tema: { colores: { marca: 'red; } body { display:none' } } });
  assert.ok(errores.some((e) => e.startsWith('tema.colores.marca')));
});

test('rechaza colores sin contraste suficiente', () => {
  const errores = validar({ ...valido(), tema: { colores: { marca: '#3A7BD5' } } });
  assert.ok(errores.some((e) => e.startsWith('tema.colores.marca') && e.includes('contraste')));
});

test('rechaza fuentes con caracteres raros', () => {
  const errores = validar({ ...valido(), tema: { fuentes: { titulos: 'Roboto"); @import url(x' } } });
  assert.ok(errores.some((e) => e.startsWith('tema.fuentes.titulos')));
});

test('rechaza rutas de imagen fuera de negocio/img', () => {
  for (const src of ['../../secreto.png', '/etc/passwd.png', 'https://x.com/a.png', 'foto.html']) {
    const errores = validar({ ...valido(), imagenes: { galeria: [{ src, alt: 'x' }] } });
    assert.ok(errores.some((e) => e.startsWith('imagenes.galeria[0].src')), src);
  }
});

test('exige alt en las imágenes y que existan', () => {
  const errores = validar({ ...valido(), imagenes: { portada: { src: 'frente.webp' } } }, { existeImagen: () => false });
  assert.ok(errores.includes('imagenes.portada.src: no existe negocio/img/frente.webp'));
  assert.ok(errores.includes('imagenes.portada.alt: es obligatorio (describí la foto)'));
});

test('rechaza WhatsApp y horarios mal cargados', () => {
  assert.ok(validar({ ...valido(), whatsapp: '+54 9 11 2345-6789' }).some((e) => e.startsWith('whatsapp')));
  const errores = validar({ ...valido(), horarios: { lunes: [], mar: [['9', '18:00']], mie: [['25:00', '18:00']] } });
  assert.equal(errores.length, 3);
});

test('elige texto con contraste AA sobre la marca', () => {
  for (const fondo of ['#9E2B25', '#F2C14E', '#0F6B5A', '#FFFFFF', '#000000']) {
    assert.ok(contraste(fondo, textoSobre(fondo)) >= 4.5, fondo);
  }
});

test('el build escapa datos maliciosos en todo el HTML', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'negocio-'));
  try {
    const malo = '</script><script>alert(1)</script><img src=x onerror=alert(2)>';
    const negocio = {
      ...valido(),
      nombre: malo,
      eslogan: malo,
      servicios: [{ titulo: malo, descripcion: malo }],
      preguntas: [{ pregunta: malo, respuesta: malo }],
      resenas: [{ texto: malo, autor: malo }],
      mensajeWhatsapp: '"><script>alert(3)</script>',
    };
    await mkdir(join(dir, 'negocio'));
    await writeFile(join(dir, 'negocio', 'negocio.json'), JSON.stringify(negocio));
    await build(join(dir, 'negocio'), join(dir, 'dist'), { anio: 2026, fecha: '2026-10-08' });
    const html = await readFile(join(dir, 'dist', 'index.html'), 'utf8');

    assert.ok(!html.includes('<script>alert'), 'hay un <script> inyectado');
    assert.ok(!html.includes('<img src=x'), 'hay un <img> inyectado');
    // Los únicos <script> son el módulo propio, los JSON-LD y los datos de horario.
    const scripts = html.match(/<script[^>]*>/g);
    assert.deepEqual([...new Set(scripts)].sort(), [
      '<script type="application/json" id="datos-horario">',
      '<script type="application/ld+json">',
      '<script type="module" src="js/app.js">',
    ]);
    assert.match(html, /Content-Security-Policy" content="default-src &#39;self&#39;; script-src &#39;self&#39;;/);
    assert.ok(!html.includes("'unsafe-inline'"));
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test('el build falla con la lista de errores', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'negocio-'));
  try {
    await writeFile(join(dir, 'negocio.json'), JSON.stringify({ ...valido(), url: 'javascript:alert(1)', whatsapp: 'x' }));
    await assert.rejects(build(dir, join(dir, 'dist')), (e) => e.errores.length === 2);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});
