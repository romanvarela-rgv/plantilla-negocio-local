// Servidor local para revisar dist/. Solo escucha en 127.0.0.1.
// Uso: node scripts/serve.mjs [puerto]
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { join, resolve, extname, sep, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const dist = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'dist');
const puerto = Number(process.argv[2] ?? 4321);
const TIPOS = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.mjs': 'text/javascript',
  '.svg': 'image/svg+xml', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.png': 'image/png', '.avif': 'image/avif', '.txt': 'text/plain', '.xml': 'application/xml',
};

createServer(async (req, res) => {
  try {
    const ruta = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    let archivo = resolve(join(dist, ruta));
    if (archivo !== dist && !archivo.startsWith(dist + sep)) {
      res.writeHead(403).end('Prohibido');
      return;
    }
    if ((await stat(archivo).catch(() => null))?.isDirectory()) archivo = join(archivo, 'index.html');
    const contenido = await readFile(archivo);
    res.writeHead(200, {
      'Content-Type': TIPOS[extname(archivo)] ?? 'application/octet-stream',
      'X-Content-Type-Options': 'nosniff',
      'Cache-Control': 'no-store',
    });
    res.end(contenido);
  } catch {
    res.writeHead(404).end('No encontrado');
  }
}).listen(puerto, '127.0.0.1', () => console.log(`Sirviendo dist/ en http://127.0.0.1:${puerto}`));
