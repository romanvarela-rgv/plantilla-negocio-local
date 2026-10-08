const ENTIDADES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

// Escapa texto para usarlo dentro de HTML o de un atributo entre comillas.
export function esc(valor) {
  return String(valor ?? '').replace(/[&<>"']/g, (c) => ENTIDADES[c]);
}

// JSON para meter en un <script>: escapa < > & para que ningún dato pueda cerrar la etiqueta.
export function jsonSeguro(datos, espacios = 0) {
  return JSON.stringify(datos, null, espacios)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026');
}
