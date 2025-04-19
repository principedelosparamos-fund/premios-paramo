import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_DBYefAC-.mjs';
import { $ as $$Layout } from '../chunks/Layout_DFdrdMO9.mjs';
export { renderers } from '../renderers.mjs';

const prerender = false;
const $$AccesoDenegado = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, {}, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="max-w-xl mx-auto py-10 text-center"> <h1 class="text-3xl font-bold text-red-600 mb-4">Acceso Denegado</h1> <p class="text-gray-700 mb-6">
No tienes permisos para acceder a esta sección.
</p> <a href="/jurado" class="bg-gold-600 text-white px-6 py-2 rounded-md hover:bg-gold-700 transition">Volver al Dashboard de Jurado</a> </section> ` })}`;
}, "E:/code/paramo-premios/src/pages/acceso-denegado.astro", void 0);

const $$file = "E:/code/paramo-premios/src/pages/acceso-denegado.astro";
const $$url = "/acceso-denegado";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$AccesoDenegado,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
