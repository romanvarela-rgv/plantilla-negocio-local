export const TINTA = '#17212B';
export const BLANCO = '#FFFFFF';

function luminancia(hex) {
  const canales = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  const [r, g, b] = canales.map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contraste(a, b) {
  const [claro, oscuro] = [luminancia(a), luminancia(b)].sort((x, y) => y - x);
  return (claro + 0.05) / (oscuro + 0.05);
}

// Elige el color de texto que más contrasta sobre el fondo dado.
export function textoSobre(fondo) {
  return contraste(fondo, BLANCO) >= contraste(fondo, TINTA) ? BLANCO : TINTA;
}
