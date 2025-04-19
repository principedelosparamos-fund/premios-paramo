import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_DBYefAC-.mjs';
import { $ as $$Layout } from '../chunks/Layout_DFdrdMO9.mjs';
export { renderers } from '../renderers.mjs';

const prerender = false;
const $$Index = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, {}, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<h1>Hola Jurado</h1> ` })}`;
}, "E:/code/paramo-premios/src/pages/jurado/index.astro", void 0);

const $$file = "E:/code/paramo-premios/src/pages/jurado/index.astro";
const $$url = "/jurado";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
