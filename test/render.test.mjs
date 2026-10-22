import { test } from 'node:test';
import assert from 'node:assert/strict';
import { normalizar, jsonLd, robots, sitemap, csp, urlFuentes, renderPagina } from '../src/lib/render.mjs';

// Lo que ven Google y WhatsApp: si esto se rompe, el sitio se ve bien pero no aparece o se comparte mal.

const valido = () => ({
  nombre: 'Kiosco Test',
  rubro: 'Kiosco',
  descripcion: 'Un kiosco de prueba.',
  url: 'https://ejemplo.com',
  whatsapp: '5491123456789',
  direccion: { calle: 'Calle 1', localidad: 'Merlo', provincia: 'Buenos Aires' },
});

test('normalizar agrega la barra final a la url y completa los valores por defecto', () => {
  const n = normalizar(valido());
  assert.equal(n.url, 'https://ejemplo.com/');
  assert.equal(normalizar({ ...valido(), url: 'https://ejemplo.com/' }).url, 'https://ejemplo.com/');
  assert.equal(n.tipoSchema, 'LocalBusiness');
  assert.equal(n.indexar, true);
  assert.deepEqual(n.servicios, []);
});

test('el JSON-LD lleva un turno por franja y los días en inglés', () => {
  const [negocio] = jsonLd(normalizar({ ...valido(), horarios: { lun: [['08:00', '13:00'], ['16:00', '20:00']], dom: [['10:00', '14:00']] } }));
  assert.deepEqual(negocio.openingHoursSpecification.map((t) => [t.dayOfWeek, t.opens, t.closes]), [
    ['Monday', '08:00', '13:00'], ['Monday', '16:00', '20:00'], ['Sunday', '10:00', '14:00'],
  ]);
  assert.equal(negocio.address.addressCountry, 'AR');
});

test('el JSON-LD omite lo que no se cargó', () => {
  const bloques = jsonLd(normalizar(valido()));
  assert.equal(bloques.length, 1);
  for (const campo of ['telephone', 'image', 'sameAs', 'openingHoursSpecification']) {
    assert.ok(!(campo in bloques[0]), campo);
  }
  assert.ok(!('postalCode' in bloques[0].address));
});

test('las preguntas frecuentes suman un bloque FAQPage', () => {
  const bloques = jsonLd(normalizar({ ...valido(), preguntas: [{ pregunta: '¿Abren feriados?', respuesta: 'Sí, de 10 a 14.' }] }));
  assert.equal(bloques[1]['@type'], 'FAQPage');
  assert.equal(bloques[1].mainEntity[0].acceptedAnswer.text, 'Sí, de 10 a 14.');
});

test('robots apunta al sitemap o bloquea todo si no se indexa', () => {
  assert.equal(robots(valido()), 'User-agent: *\nAllow: /\n\nSitemap: https://ejemplo.com/sitemap.xml\n');
  assert.equal(robots({ ...valido(), indexar: false }), 'User-agent: *\nDisallow: /\n');
});

test('el sitemap usa la url canónica y la fecha del build', () => {
  const xml = sitemap(valido(), '2026-10-22');
  assert.ok(xml.includes('<loc>https://ejemplo.com/</loc><lastmod>2026-10-22</lastmod>'));
});

test('urlFuentes no repite la familia y sin fuentes no pide nada a Google', () => {
  assert.equal(urlFuentes({ titulos: 'Bricolage Grotesque', texto: 'Figtree' }),
    'https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@700;800&family=Figtree:wght@400;600;700&display=swap');
  assert.equal(urlFuentes({ titulos: 'Inter', texto: 'Inter' }), 'https://fonts.googleapis.com/css2?family=Inter:wght@700;800&display=swap');
  assert.equal(urlFuentes({}), null);
});

test('la CSP solo abre Google Fonts y Maps cuando se usan', () => {
  const abierta = csp(normalizar(valido()));
  assert.ok(abierta.includes('https://fonts.googleapis.com') && abierta.includes("frame-src https://www.google.com"));
  const cerrada = csp(normalizar({ ...valido(), mapa: false, tema: { fuentes: {} } }));
  assert.ok(!cerrada.includes('googleapis') && !cerrada.includes('gstatic'));
  assert.ok(cerrada.includes("frame-src 'none'"));
});

test('el menú solo enlaza secciones que existen', () => {
  const html = renderPagina(valido(), { anio: 2026 });
  assert.ok(html.includes('href="#ubicacion"'));
  for (const id of ['servicios', 'horarios', 'galeria', 'resenas', 'preguntas']) {
    assert.ok(!html.includes(`href="#${id}"`), id);
    assert.ok(!html.includes(`id="${id}"`), id);
  }
  assert.ok(html.includes('<meta name="twitter:card" content="summary">'));
  assert.ok(html.includes('© 2026 Kiosco Test'));
});

test('con imagen para compartir arma las etiquetas de Open Graph', () => {
  const html = renderPagina({ ...valido(), imagenes: { compartir: { src: 'og.jpg', alt: 'Frente del kiosco' } } });
  assert.ok(html.includes('<meta property="og:image" content="https://ejemplo.com/img/og.jpg">'));
  assert.ok(html.includes('<meta name="twitter:card" content="summary_large_image">'));
});
