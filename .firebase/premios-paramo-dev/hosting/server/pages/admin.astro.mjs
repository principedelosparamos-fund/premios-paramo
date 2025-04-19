import { c as createComponent, r as renderComponent, a as renderTemplate } from '../chunks/astro/server_DBYefAC-.mjs';
import { a as auth, d as db, $ as $$Layout } from '../chunks/Layout_DFdrdMO9.mjs';
import { jsxs, jsx } from 'react/jsx-runtime';
import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc, Timestamp } from 'firebase/firestore';
import { C as CATEGORIES } from '../chunks/categories_Blv1Ncz4.mjs';
export { renderers } from '../renderers.mjs';

function RegisterJuradoForm() {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    celular: "",
    categorias: []
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleCategoryChange = (e) => {
    const { value, checked } = e.target;
    let updatedCategorias = [...formData.categorias];
    if (checked) {
      updatedCategorias.push(value);
    } else {
      updatedCategorias = updatedCategorias.filter((c) => c !== value);
    }
    setFormData({ ...formData, categorias: updatedCategorias });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("🚀 Registrando nuevo jurado con datos:", formData);
    try {
      const { email, celular } = formData;
      const password = `*${celular}*`;
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log("✅ Usuario creado en Authentication:", user.uid);
      await setDoc(doc(db, "jurados", user.uid), {
        ...formData,
        rol: "jurado",
        fechaRegistro: (/* @__PURE__ */ new Date()).toLocaleString("es-CO"),
        timestamp: Timestamp.now()
      });
      console.log("✅ Documento creado en Firestore para el jurado.");
      window.location.href = "/admin/jurado-inscrito";
    } catch (err) {
      console.error("❌ Error al registrar jurado:", err);
      setError("Error al registrar jurado. Verifica los datos o intenta nuevamente.");
      setSuccess("");
    }
  };
  return /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-6 p-6 bg-white rounded-md shadow-md", children: [
    /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold text-center mb-4", children: "Registrar Nuevo Jurado" }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col space-y-2", children: [
      /* @__PURE__ */ jsx("label", { htmlFor: "nombre", className: "font-medium text-sm", children: "Nombre" }),
      /* @__PURE__ */ jsx(
        "input",
        {
          id: "nombre",
          name: "nombre",
          value: formData.nombre,
          onChange: handleChange,
          required: true,
          className: "w-full px-4 py-2 border rounded-md"
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col space-y-2", children: [
      /* @__PURE__ */ jsx("label", { htmlFor: "apellido", className: "font-medium text-sm", children: "Apellido" }),
      /* @__PURE__ */ jsx(
        "input",
        {
          id: "apellido",
          name: "apellido",
          value: formData.apellido,
          onChange: handleChange,
          required: true,
          className: "w-full px-4 py-2 border rounded-md"
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col space-y-2", children: [
      /* @__PURE__ */ jsx("label", { htmlFor: "email", className: "font-medium text-sm", children: "Correo Electrónico" }),
      /* @__PURE__ */ jsx(
        "input",
        {
          type: "email",
          id: "email",
          name: "email",
          value: formData.email,
          onChange: handleChange,
          required: true,
          className: "w-full px-4 py-2 border rounded-md"
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col space-y-2", children: [
      /* @__PURE__ */ jsx("label", { htmlFor: "celular", className: "font-medium text-sm", children: "Celular" }),
      /* @__PURE__ */ jsx(
        "input",
        {
          id: "celular",
          name: "celular",
          value: formData.celular,
          onChange: handleChange,
          required: true,
          className: "w-full px-4 py-2 border rounded-md"
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col space-y-2", children: [
      /* @__PURE__ */ jsx("label", { className: "font-medium text-sm mb-2", children: "Categorías que puede calificar" }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-2", children: CATEGORIES.map((category) => /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "checkbox",
            id: category,
            value: category,
            checked: formData.categorias.includes(category),
            onChange: handleCategoryChange,
            className: "w-4 h-4"
          }
        ),
        /* @__PURE__ */ jsx("label", { htmlFor: category, className: "text-sm", children: category })
      ] }, category)) }),
      /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500", children: "Selecciona una o varias categorías." })
    ] }),
    error && /* @__PURE__ */ jsx("div", { className: "text-red-600 font-semibold", children: error }),
    success && /* @__PURE__ */ jsx("div", { className: "text-green-600 font-semibold", children: success }),
    /* @__PURE__ */ jsx("button", { type: "submit", className: "w-full bg-gold-600 text-white py-2 rounded-md hover:bg-gold-700 transition", children: "Registrar Jurado" })
  ] });
}

const prerender = false;
const $$Index = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, {}, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "RegisterJuradoForm", RegisterJuradoForm, { "client:load": true, "client:component-hydration": "load", "client:component-path": "E:/code/paramo-premios/src/components/admin/RegisterJurado", "client:component-export": "default" })} ` })}`;
}, "E:/code/paramo-premios/src/pages/admin/index.astro", void 0);

const $$file = "E:/code/paramo-premios/src/pages/admin/index.astro";
const $$url = "/admin";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
