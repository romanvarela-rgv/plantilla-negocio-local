import { DIAS, HORA_VALIDA } from './horario.mjs';
import { contraste, textoSobre } from './color.mjs';

const HEX = /^#[0-9a-fA-F]{6}$/;
const FUENTE = /^[A-Za-z0-9 ]{1,40}$/;
const TIPO_SCHEMA = /^[A-Za-z]{2,40}$/;
const RUTA_IMAGEN = /^[A-Za-z0-9_\-/]+\.(webp|jpe?g|png|avif|svg)$/i;

const esTexto = (v) => typeof v === 'string' && v.trim() !== '';

function esHttps(v) {
  // El parser de URL descarta saltos de línea, pero el texto original se usa tal cual (ej. robots.txt).
  if (typeof v !== 'string' || /[\s"'<>`]/.test(v)) return false;
  try {
    return new URL(v).protocol === 'https:';
  } catch {
    return false;
  }
}

function zonaValida(zona) {
  try {
    new Intl.DateTimeFormat('es-AR', { timeZone: zona });
    return true;
  } catch {
    return false;
  }
}

// Valida negocio.json. `existeImagen(ruta)` dice si la imagen está en negocio/img/.
// Devuelve una lista de errores; vacía si todo está bien.
export function validar(n, { existeImagen = () => true } = {}) {
  const errores = [];
  const error = (campo, mensaje) => errores.push(`${campo}: ${mensaje}`);

  if (typeof n !== 'object' || n === null || Array.isArray(n)) return ['negocio.json: tiene que ser un objeto'];

  for (const campo of ['nombre', 'rubro', 'descripcion']) {
    if (!esTexto(n[campo])) error(campo, 'es obligatorio');
  }
  if (esTexto(n.nombre) && n.nombre.length > 80) error('nombre', 'máximo 80 caracteres');
  if (esTexto(n.descripcion) && n.descripcion.length > 160) error('descripcion', 'máximo 160 caracteres (es la meta description)');
  if (!esHttps(n.url)) error('url', 'tiene que ser una URL https:// (la dirección final del sitio)');
  for (const campo of ['eslogan', 'notaHorarios', 'mensajeWhatsapp', 'tituloServicios', 'tituloCierre']) {
    if (n[campo] !== undefined && !esTexto(n[campo])) error(campo, 'tiene que ser un texto (o sacar el campo)');
  }
  for (const campo of ['indexar', 'mapa']) {
    if (n[campo] !== undefined && typeof n[campo] !== 'boolean') error(campo, 'tiene que ser true o false');
  }
  if (n.idioma !== undefined && !/^[a-z]{2}(-[A-Z]{2})?$/.test(n.idioma)) error('idioma', 'formato "es-AR"');
  if (n.tipoSchema !== undefined && !TIPO_SCHEMA.test(n.tipoSchema)) error('tipoSchema', 'solo letras, ej. "Bakery"');
  if (n.zonaHoraria !== undefined && !zonaValida(n.zonaHoraria)) error('zonaHoraria', 'zona IANA inválida, ej. "America/Argentina/Buenos_Aires"');

  if (typeof n.whatsapp !== 'string' || !/^\d{10,15}$/.test(n.whatsapp)) {
    error('whatsapp', 'solo dígitos con código de país, sin + ni espacios (10 a 15), ej. "5491123456789"');
  }
  if (n.telefono !== undefined && !/^\+?[\d\s()-]{6,20}$/.test(n.telefono)) error('telefono', 'formato inválido');

  const d = n.direccion;
  if (typeof d !== 'object' || d === null) error('direccion', 'es obligatoria');
  else for (const campo of ['calle', 'localidad', 'provincia']) {
    if (!esTexto(d[campo])) error(`direccion.${campo}`, 'es obligatorio');
  }

  if (n.horarios !== undefined) {
    if (typeof n.horarios !== 'object' || n.horarios === null) error('horarios', 'tiene que ser un objeto con lun…dom');
    else for (const [dia, turnos] of Object.entries(n.horarios)) {
      if (!DIAS.includes(dia)) { error(`horarios.${dia}`, `día inválido, usar ${DIAS.join(', ')}`); continue; }
      if (!Array.isArray(turnos)) { error(`horarios.${dia}`, 'tiene que ser una lista de ["HH:MM", "HH:MM"]'); continue; }
      turnos.forEach((t, i) => {
        if (!Array.isArray(t) || t.length !== 2 || !t.every((h) => typeof h === 'string' && HORA_VALIDA.test(h))) {
          error(`horarios.${dia}[${i}]`, 'tiene que ser ["HH:MM", "HH:MM"], ej. ["08:00", "13:00"]');
        } else if (t[0] === t[1]) {
          error(`horarios.${dia}[${i}]`, 'apertura y cierre iguales');
        }
      });
    }
  }

  const lista = (campo, obligatorios) => {
    if (n[campo] === undefined) return;
    if (!Array.isArray(n[campo])) return error(campo, 'tiene que ser una lista');
    n[campo].forEach((item, i) => {
      for (const c of obligatorios) if (!esTexto(item?.[c])) error(`${campo}[${i}].${c}`, 'es obligatorio');
    });
  };
  lista('servicios', ['titulo']);
  lista('resenas', ['texto', 'autor']);
  lista('preguntas', ['pregunta', 'respuesta']);
  (n.resenas ?? []).forEach((r, i) => {
    if (r?.estrellas !== undefined && !(Number.isInteger(r.estrellas) && r.estrellas >= 1 && r.estrellas <= 5)) {
      error(`resenas[${i}].estrellas`, 'número entero de 1 a 5');
    }
  });

  const imagen = (campo, img) => {
    if (typeof img !== 'object' || img === null) return error(campo, 'tiene que tener src y alt');
    if (typeof img.src !== 'string' || !RUTA_IMAGEN.test(img.src) || img.src.includes('..') || img.src.startsWith('/')) {
      error(`${campo}.src`, 'ruta dentro de negocio/img/, ej. "frente.webp"');
    } else if (!existeImagen(img.src)) {
      error(`${campo}.src`, `no existe negocio/img/${img.src}`);
    }
    if (!esTexto(img.alt)) error(`${campo}.alt`, 'es obligatorio (describí la foto)');
  };
  const im = n.imagenes;
  if (im !== undefined) {
    if (im.portada !== undefined) imagen('imagenes.portada', im.portada);
    if (im.compartir !== undefined) imagen('imagenes.compartir', im.compartir);
    if (im.galeria !== undefined) {
      if (!Array.isArray(im.galeria)) error('imagenes.galeria', 'tiene que ser una lista');
      else im.galeria.forEach((img, i) => imagen(`imagenes.galeria[${i}]`, img));
    }
  }

  for (const campo of ['linkResenas', 'mapsUrl']) {
    if (n[campo] !== undefined && !esHttps(n[campo])) error(campo, 'tiene que ser una URL https://');
  }
  for (const [red, url] of Object.entries(n.redes ?? {})) {
    if (!['instagram', 'facebook', 'tiktok'].includes(red)) error(`redes.${red}`, 'red no soportada (instagram, facebook, tiktok)');
    else if (!esHttps(url)) error(`redes.${red}`, 'tiene que ser una URL https://');
  }
  if (n.credito !== undefined) {
    if (!esTexto(n.credito.texto)) error('credito.texto', 'es obligatorio');
    if (n.credito.url !== undefined && !esHttps(n.credito.url)) error('credito.url', 'tiene que ser una URL https://');
  }

  for (const [nombre, valor] of Object.entries(n.tema?.colores ?? {})) {
    if (!['marca', 'acento'].includes(nombre)) error(`tema.colores.${nombre}`, 'solo se usan marca y acento');
    else if (!HEX.test(valor)) error(`tema.colores.${nombre}`, 'formato #RRGGBB');
    else if (contraste(valor, textoSobre(valor)) < 4.5) {
      error(`tema.colores.${nombre}`, `${valor} no llega al contraste AA (4.5:1) ni con texto blanco ni oscuro; usá un tono más oscuro o más claro`);
    }
  }
  for (const [rol, valor] of Object.entries(n.tema?.fuentes ?? {})) {
    if (!['titulos', 'texto'].includes(rol)) error(`tema.fuentes.${rol}`, 'solo se usan titulos y texto');
    else if (!FUENTE.test(valor)) error(`tema.fuentes.${rol}`, 'nombre de Google Fonts, solo letras, números y espacios');
  }

  return errores;
}
