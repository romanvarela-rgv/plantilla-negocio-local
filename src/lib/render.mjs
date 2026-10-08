import { esc, jsonSeguro } from './html.mjs';
import { DIAS, NOMBRES_DIA } from './horario.mjs';
import { textoSobre } from './color.mjs';

export const PREDETERMINADO = {
  idioma: 'es-AR',
  zonaHoraria: 'America/Argentina/Buenos_Aires',
  tipoSchema: 'LocalBusiness',
  mensajeWhatsapp: 'Hola! Quería hacer una consulta.',
  colores: { marca: '#0F6B5A', acento: '#F3B23A' },
  fuentes: { titulos: 'Bricolage Grotesque', texto: 'Figtree' },
};

const SCHEMA_DIA = {
  lun: 'Monday', mar: 'Tuesday', mie: 'Wednesday', jue: 'Thursday',
  vie: 'Friday', sab: 'Saturday', dom: 'Sunday',
};

const ICONOS = {
  whatsapp: '<svg class="icono" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.4.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3Z"/></svg>',
  mapa: '<svg class="icono" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a7 7 0 0 0-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5Z"/></svg>',
  instagram: '<svg class="icono" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 7.3a4.7 4.7 0 1 0 0 9.4 4.7 4.7 0 0 0 0-9.4Zm0 7.7a3 3 0 1 1 0-6 3 3 0 0 1 0 6Zm6-7.9a1.1 1.1 0 1 1-2.2 0 1.1 1.1 0 0 1 2.2 0ZM21.9 8c-.1-1.6-.4-3-1.6-4.2C19.1 2.6 17.6 2.2 16 2.1 14.4 2 9.6 2 8 2.1c-1.6.1-3 .4-4.2 1.6S2.2 6.4 2.1 8C2 9.6 2 14.4 2.1 16c.1 1.6.4 3 1.6 4.2 1.2 1.2 2.6 1.5 4.2 1.6 1.6.1 6.4.1 8 0 1.6-.1 3-.4 4.2-1.6 1.2-1.2 1.5-2.6 1.6-4.2.1-1.6.1-6.4.2-8Zm-2.1 9.7a3.2 3.2 0 0 1-1.8 1.8c-1.3.5-4.3.4-5.6.4s-4.4.1-5.6-.4a3.2 3.2 0 0 1-1.8-1.8C4.5 16.4 4.6 13.4 4.6 12s-.1-4.4.4-5.6A3.2 3.2 0 0 1 6.8 4.6C8 4.1 11 4.2 12.4 4.2s4.4-.1 5.6.4a3.2 3.2 0 0 1 1.8 1.8c.5 1.3.4 4.3.4 5.6s.1 4.4-.4 5.7Z"/></svg>',
  facebook: '<svg class="icono" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.3v7A10 10 0 0 0 22 12Z"/></svg>',
  tiktok: '<svg class="icono" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M16.6 2h-3.3v13.4a2.8 2.8 0 1 1-2-2.7V9.3a6.1 6.1 0 1 0 5.3 6.1V8.6a7.8 7.8 0 0 0 4.4 1.4V6.7a4.4 4.4 0 0 1-4.4-4.4Z"/></svg>',
};
const NOMBRE_RED = { instagram: 'Instagram', facebook: 'Facebook', tiktok: 'TikTok' };

// Completa los valores opcionales para no repetir `??` en todo el render.
export function normalizar(n) {
  return {
    ...n,
    idioma: n.idioma ?? PREDETERMINADO.idioma,
    zonaHoraria: n.zonaHoraria ?? PREDETERMINADO.zonaHoraria,
    tipoSchema: n.tipoSchema ?? PREDETERMINADO.tipoSchema,
    mensajeWhatsapp: n.mensajeWhatsapp ?? PREDETERMINADO.mensajeWhatsapp,
    indexar: n.indexar ?? true,
    mapa: n.mapa ?? true,
    url: n.url.endsWith('/') ? n.url : `${n.url}/`,
    horarios: n.horarios ?? {},
    servicios: n.servicios ?? [],
    resenas: n.resenas ?? [],
    preguntas: n.preguntas ?? [],
    redes: n.redes ?? {},
    imagenes: { galeria: [], ...n.imagenes },
    colores: { ...PREDETERMINADO.colores, ...n.tema?.colores },
    // `tema.fuentes: {}` = fuentes del sistema, sin pedir nada a Google.
    fuentes: n.tema?.fuentes ?? PREDETERMINADO.fuentes,
  };
}

export const direccionTexto = (d) =>
  [d.calle, d.localidad, d.provincia, d.codigoPostal, d.pais ?? 'Argentina'].filter(Boolean).join(', ');

export const linkWhatsapp = (n) => `https://wa.me/${n.whatsapp}?text=${encodeURIComponent(n.mensajeWhatsapp)}`;

const linkComoLlegar = (n) =>
  n.mapsUrl ?? `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(direccionTexto(n.direccion))}`;

export function urlFuentes(fuentes) {
  const familias = [];
  if (fuentes.titulos) familias.push(`family=${fuentes.titulos.replace(/ /g, '+')}:wght@700;800`);
  if (fuentes.texto && fuentes.texto !== fuentes.titulos) familias.push(`family=${fuentes.texto.replace(/ /g, '+')}:wght@400;600;700`);
  return familias.length ? `https://fonts.googleapis.com/css2?${familias.join('&')}&display=swap` : null;
}

export function csp(n) {
  const fuentes = urlFuentes(n.fuentes);
  return [
    "default-src 'self'",
    "script-src 'self'",
    `style-src 'self'${fuentes ? ' https://fonts.googleapis.com' : ''}`,
    `font-src 'self'${fuentes ? ' https://fonts.gstatic.com' : ''}`,
    "img-src 'self' data:",
    `frame-src ${n.mapa ? 'https://www.google.com' : "'none'"}`,
    "connect-src 'none'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'none'",
  ].join('; ');
}

export function themeCss(n) {
  const { marca, acento } = n.colores;
  const pila = (f, resto) => (f ? `"${f}", ${resto}` : resto);
  return `:root {
  --marca: ${marca};
  --sobre-marca: ${textoSobre(marca)};
  --acento: ${acento};
  --sobre-acento: ${textoSobre(acento)};
  --fuente-titulos: ${pila(n.fuentes.titulos, 'ui-sans-serif, system-ui, sans-serif')};
  --fuente-texto: ${pila(n.fuentes.texto, 'ui-sans-serif, system-ui, sans-serif')};
}
`;
}

export function favicon(n) {
  const inicial = esc([...n.nombre.trim()][0].toUpperCase());
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="${n.colores.marca}"/><text x="32" y="44" text-anchor="middle" font-family="system-ui, sans-serif" font-size="36" font-weight="800" fill="${textoSobre(n.colores.marca)}">${inicial}</text></svg>\n`;
}

export function jsonLd(n) {
  const d = n.direccion;
  const negocio = {
    '@context': 'https://schema.org',
    '@type': n.tipoSchema,
    name: n.nombre,
    description: n.descripcion,
    url: n.url,
    address: {
      '@type': 'PostalAddress',
      streetAddress: d.calle,
      addressLocality: d.localidad,
      addressRegion: d.provincia,
      ...(d.codigoPostal && { postalCode: d.codigoPostal }),
      addressCountry: d.pais ?? 'AR',
    },
  };
  if (n.telefono) negocio.telephone = n.telefono;
  if (n.imagenes.compartir) negocio.image = n.url + 'img/' + n.imagenes.compartir.src;
  const redes = Object.values(n.redes);
  if (redes.length) negocio.sameAs = redes;
  const turnos = DIAS.flatMap((dia) =>
    (n.horarios[dia] ?? []).map(([opens, closes]) => ({
      '@type': 'OpeningHoursSpecification', dayOfWeek: SCHEMA_DIA[dia], opens, closes,
    })));
  if (turnos.length) negocio.openingHoursSpecification = turnos;

  const bloques = [negocio];
  if (n.preguntas.length) {
    bloques.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: n.preguntas.map((p) => ({
        '@type': 'Question', name: p.pregunta,
        acceptedAnswer: { '@type': 'Answer', text: p.respuesta },
      })),
    });
  }
  return bloques;
}

const externo = (url, contenido, clase = '') =>
  `<a href="${esc(url)}"${clase ? ` class="${clase}"` : ''} target="_blank" rel="noopener noreferrer">${contenido}</a>`;

const botonWhatsapp = (n, texto = 'Escribinos por WhatsApp', extra = '') =>
  externo(linkWhatsapp(n), `${ICONOS.whatsapp}<span>${esc(texto)}</span>`, `btn btn--primario${extra}`);

function seccionHero(n) {
  const portada = n.imagenes.portada;
  const lugar = [n.rubro, n.direccion.localidad].map(esc).join(' · ');
  const hayHorarios = Object.keys(n.horarios).length > 0;
  return `
<section class="hero${portada ? ' hero--con-foto' : ''}" aria-labelledby="titulo-negocio">
  <div class="contenedor hero__grilla">
    <div class="hero__texto">
      <p class="hero__lugar">${lugar}</p>
      <h1 id="titulo-negocio" class="hero__nombre">${esc(n.nombre)}</h1>
      ${n.eslogan ? `<p class="hero__eslogan">${esc(n.eslogan)}</p>` : ''}
      <div class="hero__acciones">
        ${botonWhatsapp(n)}
        ${externo(linkComoLlegar(n), `${ICONOS.mapa}<span>Cómo llegar</span>`, 'btn btn--secundario')}
      </div>
    </div>
    <div class="hero__vidriera">
      ${hayHorarios ? `
      <a class="cartel" href="#horarios" data-cartel hidden aria-live="polite">
        <span class="cartel__titulo" data-cartel-titulo></span>
        <span class="cartel__detalle" data-cartel-detalle></span>
      </a>` : ''}
      ${portada ? `<img class="hero__foto" src="img/${esc(portada.src)}" alt="${esc(portada.alt)}" fetchpriority="high">` : ''}
    </div>
  </div>
</section>`;
}

function seccionServicios(n) {
  if (!n.servicios.length) return '';
  const items = n.servicios.map((s) => `
      <li class="servicio">
        <h3 class="servicio__titulo">${esc(s.titulo)}</h3>
        ${s.descripcion ? `<p>${esc(s.descripcion)}</p>` : ''}
        ${s.precio ? `<p class="servicio__precio">${esc(s.precio)}</p>` : ''}
      </li>`).join('');
  return `
<section id="servicios" class="seccion" aria-labelledby="titulo-servicios">
  <div class="contenedor">
    <h2 id="titulo-servicios">${esc(n.tituloServicios ?? 'Qué hacemos')}</h2>
    <ul class="servicios" role="list">${items}
    </ul>
  </div>
</section>`;
}

function seccionHorarios(n) {
  if (!Object.keys(n.horarios).length) return '';
  const filas = DIAS.map((dia) => {
    const turnos = n.horarios[dia] ?? [];
    const texto = turnos.length
      ? turnos.map(([a, b]) => `<span class="turno">${a.replace(/^0/, '')} a ${b.replace(/^0/, '')}</span>`).join('')
      : 'Cerrado';
    return `
        <tr data-dia="${dia}"${turnos.length ? '' : ' class="cerrado"'}><th scope="row">${NOMBRES_DIA[dia]}</th><td>${texto}</td></tr>`;
  }).join('');
  return `
<section id="horarios" class="seccion seccion--horarios" aria-labelledby="titulo-horarios">
  <div class="contenedor">
    <h2 id="titulo-horarios">Horarios</h2>
    <table class="horarios">
      <caption class="sr-only">Horarios de atención de ${esc(n.nombre)}</caption>
      <tbody>${filas}
      </tbody>
    </table>
    ${n.notaHorarios ? `<p class="nota">${esc(n.notaHorarios)}</p>` : ''}
  </div>
</section>`;
}

function seccionGaleria(n) {
  const fotos = n.imagenes.galeria;
  if (!fotos.length) return '';
  return `
<section id="galeria" class="seccion" aria-labelledby="titulo-galeria">
  <div class="contenedor">
    <h2 id="titulo-galeria">El lugar</h2>
    <ul class="galeria" role="list">${fotos.map((f) => `
      <li><img src="img/${esc(f.src)}" alt="${esc(f.alt)}" loading="lazy" decoding="async"></li>`).join('')}
    </ul>
  </div>
</section>`;
}

function seccionResenas(n) {
  if (!n.resenas.length) return '';
  const items = n.resenas.map((r) => `
      <li class="resena">
        <figure>
          ${r.estrellas ? `<p class="resena__estrellas" aria-label="${r.estrellas} de 5 estrellas">${'★'.repeat(r.estrellas)}${'☆'.repeat(5 - r.estrellas)}</p>` : ''}
          <blockquote><p>${esc(r.texto)}</p></blockquote>
          <figcaption>${esc(r.autor)}</figcaption>
        </figure>
      </li>`).join('');
  return `
<section id="resenas" class="seccion" aria-labelledby="titulo-resenas">
  <div class="contenedor">
    <h2 id="titulo-resenas">Lo que dicen</h2>
    <ul class="resenas" role="list">${items}
    </ul>
    ${n.linkResenas ? `<p>${externo(n.linkResenas, 'Ver todas las reseñas en Google', 'link')}</p>` : ''}
  </div>
</section>`;
}

function seccionPreguntas(n) {
  if (!n.preguntas.length) return '';
  return `
<section id="preguntas" class="seccion" aria-labelledby="titulo-preguntas">
  <div class="contenedor contenedor--angosto">
    <h2 id="titulo-preguntas">Preguntas frecuentes</h2>
    <div class="preguntas">${n.preguntas.map((p) => `
      <details>
        <summary>${esc(p.pregunta)}</summary>
        <p>${esc(p.respuesta)}</p>
      </details>`).join('')}
    </div>
  </div>
</section>`;
}

function seccionUbicacion(n) {
  const direccion = direccionTexto(n.direccion);
  const mapa = n.mapa
    ? `<iframe class="mapa" title="Mapa: ${esc(direccion)}" src="https://www.google.com/maps?q=${esc(encodeURIComponent(direccion))}&amp;output=embed" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>`
    : '';
  return `
<section id="ubicacion" class="seccion" aria-labelledby="titulo-ubicacion">
  <div class="contenedor ubicacion">
    <div>
      <h2 id="titulo-ubicacion">Dónde estamos</h2>
      <address>
        <strong>${esc(n.direccion.calle)}</strong><br>
        ${esc(n.direccion.localidad)}, ${esc(n.direccion.provincia)}
        ${n.telefono ? `<br><a href="tel:${esc(n.telefono.replace(/[^\d+]/g, ''))}">${esc(n.telefono)}</a>` : ''}
      </address>
      ${externo(linkComoLlegar(n), `${ICONOS.mapa}<span>Cómo llegar</span>`, 'btn btn--secundario')}
    </div>
    ${mapa}
  </div>
</section>`;
}

function cierre(n) {
  return `
<section class="cierre" aria-labelledby="titulo-cierre">
  <div class="contenedor">
    <h2 id="titulo-cierre">${esc(n.tituloCierre ?? '¿Tenés una consulta?')}</h2>
    <p>Respondemos por WhatsApp.</p>
    ${botonWhatsapp(n)}
  </div>
</section>`;
}

function pie(n, anio) {
  const redes = Object.entries(n.redes).map(([red, url]) =>
    `<li>${externo(url, `${ICONOS[red]}<span class="sr-only">${NOMBRE_RED[red]}</span>`, 'pie__red')}</li>`).join('');
  return `
<footer class="pie">
  <div class="contenedor pie__grilla">
    <p><strong>${esc(n.nombre)}</strong><br>${esc(direccionTexto(n.direccion))}</p>
    ${redes ? `<ul class="pie__redes" role="list">${redes}</ul>` : ''}
    <p class="pie__credito">© ${anio} ${esc(n.nombre)}${n.credito ? ` · ${n.credito.url ? externo(n.credito.url, esc(n.credito.texto)) : esc(n.credito.texto)}` : ''}</p>
  </div>
</footer>`;
}

const NAV = [
  ['servicios', (n) => n.servicios.length, (n) => n.tituloServicios ?? 'Qué hacemos'],
  ['horarios', (n) => Object.keys(n.horarios).length, () => 'Horarios'],
  ['galeria', (n) => n.imagenes.galeria.length, () => 'El lugar'],
  ['resenas', (n) => n.resenas.length, () => 'Reseñas'],
  ['preguntas', (n) => n.preguntas.length, () => 'Preguntas'],
  ['ubicacion', () => true, () => 'Ubicación'],
];

export function renderPagina(negocio, { anio = new Date().getFullYear() } = {}) {
  const n = normalizar(negocio);
  const fuentes = urlFuentes(n.fuentes);
  const compartir = n.imagenes.compartir ? n.url + 'img/' + n.imagenes.compartir.src : null;
  const titulo = `${n.nombre} · ${n.rubro} en ${n.direccion.localidad}`;
  const enlaces = NAV.filter(([, hay]) => hay(n))
    .map(([id, , texto]) => `<li><a href="#${id}">${esc(texto(n))}</a></li>`).join('');
  const datosHorario = { zona: n.zonaHoraria, horarios: n.horarios };

  return `<!doctype html>
<html lang="${esc(n.idioma)}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta http-equiv="Content-Security-Policy" content="${esc(csp(n))}">
<meta name="referrer" content="strict-origin-when-cross-origin">
<title>${esc(titulo)}</title>
<meta name="description" content="${esc(n.descripcion)}">
<meta name="robots" content="${n.indexar ? 'index, follow' : 'noindex, nofollow'}">
<link rel="canonical" href="${esc(n.url)}">
<meta name="theme-color" content="${n.colores.marca}">
<meta name="color-scheme" content="light">
<meta property="og:type" content="website">
<meta property="og:locale" content="${esc(n.idioma.replace('-', '_'))}">
<meta property="og:site_name" content="${esc(n.nombre)}">
<meta property="og:title" content="${esc(titulo)}">
<meta property="og:description" content="${esc(n.descripcion)}">
<meta property="og:url" content="${esc(n.url)}">
${compartir ? `<meta property="og:image" content="${esc(compartir)}">
<meta property="og:image:alt" content="${esc(n.imagenes.compartir.alt)}">
<meta name="twitter:card" content="summary_large_image">` : '<meta name="twitter:card" content="summary">'}
<link rel="icon" href="favicon.svg" type="image/svg+xml">
${fuentes ? `<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="${esc(fuentes)}">` : ''}
<link rel="stylesheet" href="theme.css">
<link rel="stylesheet" href="styles.css">
<script type="module" src="js/app.js"></script>
${jsonLd(n).map((b) => `<script type="application/ld+json">${jsonSeguro(b)}</script>`).join('\n')}
<script type="application/json" id="datos-horario">${jsonSeguro(datosHorario)}</script>
</head>
<body>
<a class="saltar" href="#contenido">Saltar al contenido</a>
<div class="toldo-sombra" aria-hidden="true"><div class="toldo"></div></div>
<header class="barra">
  <div class="contenedor barra__fila">
    <a class="barra__nombre" href="#">${esc(n.nombre)}</a>
    <nav aria-label="Secciones"><ul class="barra__links" role="list">${enlaces}</ul></nav>
    ${botonWhatsapp(n, 'WhatsApp', ' btn--chico')}
  </div>
</header>
<main id="contenido">${seccionHero(n)}${seccionServicios(n)}${seccionHorarios(n)}${seccionGaleria(n)}${seccionResenas(n)}${seccionPreguntas(n)}${seccionUbicacion(n)}${cierre(n)}
</main>${pie(n, anio)}
${externo(linkWhatsapp(n), `${ICONOS.whatsapp}<span class="sr-only">Escribir por WhatsApp</span>`, 'flotante')}
</body>
</html>
`;
}

export function robots(n) {
  const { url, indexar } = normalizar(n);
  return indexar ? `User-agent: *\nAllow: /\n\nSitemap: ${url}sitemap.xml\n` : 'User-agent: *\nDisallow: /\n';
}

export function sitemap(n, fecha) {
  const { url } = normalizar(n);
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${esc(url)}</loc><lastmod>${fecha}</lastmod></url>
</urlset>
`;
}

// Headers para Apache/LiteSpeed (Hostinger). frame-ancestors solo funciona como header, no en <meta>.
export function htaccess(n) {
  const politica = `${csp(normalizar(n))}; frame-ancestors 'none'; upgrade-insecure-requests`;
  return `# Generado por scripts/build.mjs. No editar a mano.
Options -Indexes

RewriteEngine On
RewriteCond %{HTTPS} !=on
RewriteRule ^ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

<IfModule mod_headers.c>
  Header always set Content-Security-Policy "${politica.replace(/"/g, '\\"')}"
  Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains"
  Header always set X-Content-Type-Options "nosniff"
  Header always set X-Frame-Options "DENY"
  Header always set Referrer-Policy "strict-origin-when-cross-origin"
  Header always set Permissions-Policy "camera=(), microphone=(), geolocation=(), payment=(), usb=()"
  Header always set Cross-Origin-Opener-Policy "same-origin"
</IfModule>

<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType text/html "access plus 0 seconds"
  ExpiresByType text/css "access plus 7 days"
  ExpiresByType text/javascript "access plus 7 days"
  ExpiresByType image/webp "access plus 30 days"
  ExpiresByType image/jpeg "access plus 30 days"
  ExpiresByType image/png "access plus 30 days"
  ExpiresByType image/svg+xml "access plus 30 days"
</IfModule>
`;
}
