import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead } from '../../chunks/astro/server_DBYefAC-.mjs';
import { $ as $$Layout } from '../../chunks/Layout_DFdrdMO9.mjs';
export { renderers } from '../../renderers.mjs';

const prerender = false;
const $$JuradoInscrito = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, {}, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="max-w-xl mx-auto my-10 p-6 bg-white rounded shadow"> <h1 class="text-2xl font-bold mb-4 text-center">¡Registro Exitoso!</h1> <p class="text-center">El jurado ha sido registrado correctamente.</p> <div class="mt-6 text-center"> <a href="/admin" class="text-gold-600 hover:underline">Registrar otro jurado</a> </div> </section> ` })}`;
}, "E:/code/paramo-premios/src/pages/admin/jurado-inscrito.astro", void 0);

const $$file = "E:/code/paramo-premios/src/pages/admin/jurado-inscrito.astro";
const $$url = "/admin/jurado-inscrito";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$JuradoInscrito,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
