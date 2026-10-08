// Arma dist/ a partir de negocio/negocio.json.
// Uso: node scripts/build.mjs [carpeta-del-negocio] [carpeta-de-salida]
import { readFile, writeFile, mkdir, cp, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { validar } from '../src/lib/validar.mjs';
import { normalizar, renderPagina, themeCss, favicon, robots, sitemap, htaccess } from '../src/lib/render.mjs';

const raiz = resolve(dirname(fileURLToPath(import.meta.url)), '..');

export async function build(carpetaNegocio = join(raiz, 'negocio'), salida = join(raiz, 'dist'), { anio, fecha } = {}) {
  const archivo = join(carpetaNegocio, 'negocio.json');
  let negocio;
  try {
    negocio = JSON.parse(await readFile(archivo, 'utf8'));
  } catch (e) {
    throw new Error(`No se pudo leer ${archivo}: ${e.message}`);
  }

  const carpetaImg = join(carpetaNegocio, 'img');
  const errores = validar(negocio, { existeImagen: (ruta) => existsSync(join(carpetaImg, ruta)) });
  if (errores.length) {
    const error = new Error(`negocio.json tiene ${errores.length} error(es):\n  - ${errores.join('\n  - ')}`);
    error.errores = errores;
    throw error;
  }

  const n = normalizar(negocio);
  await rm(salida, { recursive: true, force: true });
  await mkdir(join(salida, 'js'), { recursive: true });

  const hoy = fecha ?? new Date().toISOString().slice(0, 10);
  await Promise.all([
    writeFile(join(salida, 'index.html'), renderPagina(negocio, { anio })),
    writeFile(join(salida, 'theme.css'), themeCss(n)),
    writeFile(join(salida, 'favicon.svg'), favicon(n)),
    writeFile(join(salida, 'robots.txt'), robots(negocio)),
    writeFile(join(salida, 'sitemap.xml'), sitemap(negocio, hoy)),
    writeFile(join(salida, '.htaccess'), htaccess(negocio)),
    cp(join(raiz, 'src', 'styles.css'), join(salida, 'styles.css')),
    cp(join(raiz, 'src', 'app.js'), join(salida, 'js', 'app.js')),
    cp(join(raiz, 'src', 'lib', 'horario.mjs'), join(salida, 'js', 'horario.mjs')),
    existsSync(carpetaImg) ? cp(carpetaImg, join(salida, 'img'), { recursive: true }) : null,
  ]);
  return n;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const [carpeta, salida] = process.argv.slice(2);
  try {
    const n = await build(carpeta && resolve(carpeta), salida && resolve(salida));
    console.log(`Listo: sitio de "${n.nombre}" en ${salida ?? 'dist/'}${n.indexar ? '' : ' (noindex: no aparece en Google)'}`);
  } catch (e) {
    console.error(e.message);
    process.exit(1);
  }
}
