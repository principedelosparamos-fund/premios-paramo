import { renderers } from './renderers.mjs';
import { c as createExports, s as serverEntrypointModule } from './chunks/_@astrojs-ssr-adapter_DxPokrgf.mjs';
import { manifest } from './manifest_DAHzfrqu.mjs';

const serverIslandMap = new Map();;

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/acceso-denegado.astro.mjs');
const _page2 = () => import('./pages/admin/jurado-inscrito.astro.mjs');
const _page3 = () => import('./pages/admin.astro.mjs');
const _page4 = () => import('./pages/api/setrole.astro.mjs');
const _page5 = () => import('./pages/dashboard.astro.mjs');
const _page6 = () => import('./pages/dashboard1.astro.mjs');
const _page7 = () => import('./pages/gracias.astro.mjs');
const _page8 = () => import('./pages/index1.astro.mjs');
const _page9 = () => import('./pages/interna.astro.mjs');
const _page10 = () => import('./pages/jurado.astro.mjs');
const _page11 = () => import('./pages/jurado-gracias.astro.mjs');
const _page12 = () => import('./pages/jurado1/panel.astro.mjs');
const _page13 = () => import('./pages/jurado1/registro.astro.mjs');
const _page14 = () => import('./pages/jurado1/_id_.astro.mjs');
const _page15 = () => import('./pages/jurado1.astro.mjs');
const _page16 = () => import('./pages/login.astro.mjs');
const _page17 = () => import('./pages/programacion.astro.mjs');
const _page18 = () => import('./pages/proyecto.astro.mjs');
const _page19 = () => import('./pages/proyecto-gracias.astro.mjs');
const _page20 = () => import('./pages/reglamento.astro.mjs');
const _page21 = () => import('./pages/reglas.astro.mjs');
const _page22 = () => import('./pages/reportes/calificaciones.astro.mjs');
const _page23 = () => import('./pages/reportes/proyectos.astro.mjs');
const _page24 = () => import('./pages/index.astro.mjs');
const pageMap = new Map([
    ["node_modules/.pnpm/astro@5.7.4_@types+node@22._e62c48a33802bb3e34f015ad1a13fc6e/node_modules/astro/dist/assets/endpoint/node.js", _page0],
    ["src/pages/acceso-denegado.astro", _page1],
    ["src/pages/admin/jurado-inscrito.astro", _page2],
    ["src/pages/admin/index.astro", _page3],
    ["src/pages/api/setRole.ts", _page4],
    ["src/pages/dashboard.astro", _page5],
    ["src/pages/dashboard1.astro", _page6],
    ["src/pages/gracias.astro", _page7],
    ["src/pages/index1.astro", _page8],
    ["src/pages/interna.astro", _page9],
    ["src/pages/jurado/index.astro", _page10],
    ["src/pages/jurado-gracias.astro", _page11],
    ["src/pages/jurado1/panel.astro", _page12],
    ["src/pages/jurado1/registro.astro", _page13],
    ["src/pages/jurado1/[id].astro", _page14],
    ["src/pages/jurado1/index.astro", _page15],
    ["src/pages/login/index.astro", _page16],
    ["src/pages/programacion.astro", _page17],
    ["src/pages/proyecto/index.astro", _page18],
    ["src/pages/proyecto-gracias.astro", _page19],
    ["src/pages/reglamento.astro", _page20],
    ["src/pages/reglas.astro", _page21],
    ["src/pages/reportes/calificaciones.astro", _page22],
    ["src/pages/reportes/proyectos.astro", _page23],
    ["src/pages/index.astro", _page24]
]);

const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    actions: () => import('./_noop-actions.mjs'),
    middleware: () => import('./_astro-internal_middleware.mjs')
});
const _args = {
    "mode": "standalone",
    "client": "file:///E:/code/paramo-premios/dist/client/",
    "server": "file:///E:/code/paramo-premios/dist/server/",
    "host": false,
    "port": 4321,
    "assets": "_astro"
};
const _exports = createExports(_manifest, _args);
const handler = _exports['handler'];
const startServer = _exports['startServer'];
const options = _exports['options'];
const _start = 'start';
if (_start in serverEntrypointModule) {
	serverEntrypointModule[_start](_manifest, _args);
}

export { handler, options, pageMap, startServer };
