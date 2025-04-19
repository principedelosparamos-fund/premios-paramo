import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_DBYefAC-.mjs';
import { a as auth, $ as $$Layout } from '../chunks/Layout_DFdrdMO9.mjs';
import { jsx, jsxs } from 'react/jsx-runtime';
import { useEffect, useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { g as getUserRole } from '../chunks/getUserRole_DTrWKjDW.mjs';
export { renderers } from '../renderers.mjs';

function Snackbar({ message, type, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3e3);
    return () => clearTimeout(timer);
  }, [onClose]);
  return /* @__PURE__ */ jsx("div", { className: `fixed bottom-6 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-lg shadow-lg
      ${type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"}
      transition-opacity duration-300
    `, children: message });
}

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [snackbar, setSnackbar] = useState(null);
  async function handleLogin(e) {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log("✅ Usuario autenticado:", user.uid);
      const role = await getUserRole(user.uid);
      console.log("✅ Rol obtenido:", role);
      localStorage.setItem("userRole", role);
      localStorage.setItem("userEmail", email);
      document.cookie = `userRole=${role}; path=/; SameSite=Lax; Secure`;
      console.log("✅ Cookie guardada:", document.cookie);
      setSnackbar({ message: "Sesión iniciada exitosamente.", type: "success" });
      setTimeout(() => {
        if (role === "admin") {
          console.log("🔵 Redirigiendo a /admin");
          window.location.href = "/admin";
        } else {
          console.log("🟢 Redirigiendo a /jurado");
          window.location.href = "/jurado";
        }
      }, 300);
    } catch (err) {
      console.error("❌ Error en login:", err);
      setError("Error al iniciar sesión. Verifica tus datos.");
      setSnackbar({ message: "Email o contraseña incorrectos.", type: "error" });
    }
  }
  return /* @__PURE__ */ jsxs("div", { className: "container", children: [
    /* @__PURE__ */ jsxs("form", { onSubmit: handleLogin, className: "space-y-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "py-2", children: [
        /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Correo" }),
        /* @__PURE__ */ jsx("input", { type: "email", placeholder: "Correo electrónico", value: email, onChange: (e) => setEmail(e.target.value), required: true, className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "py-2", children: [
        /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Contraseña" }),
        /* @__PURE__ */ jsx("input", { type: "password", placeholder: "Contraseña", value: password, onChange: (e) => setPassword(e.target.value), required: true, className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" })
      ] }),
      error && /* @__PURE__ */ jsx("div", { className: "text-red-500", children: error }),
      /* @__PURE__ */ jsx("div", { className: "py-3", children: /* @__PURE__ */ jsx("button", { type: "submit", className: "w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-lg transition-colors", children: "Iniciar Sesión" }) })
    ] }),
    snackbar && /* @__PURE__ */ jsx(
      Snackbar,
      {
        message: snackbar.message,
        type: snackbar.type,
        onClose: () => setSnackbar(null)
      }
    )
  ] });
}

const prerender = false;
const $$Index = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, {}, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="min-h-screen bg-gray-100 flex items-center justify-center p-4"> <div class="max-w-md w-full bg-white rounded-xl shadow-lg p-8"> <h2 class="text-2xl font-bold text-gray-900 mb-6 text-center">
Ingresar
</h2> ${renderComponent($$result2, "LoginForm", LoginForm, { "client:load": true, "client:component-hydration": "load", "client:component-path": "E:/code/paramo-premios/src/components/auth/LoginForm", "client:component-export": "default" })} </div> </div> ` })}`;
}, "E:/code/paramo-premios/src/pages/login/index.astro", void 0);

const $$file = "E:/code/paramo-premios/src/pages/login/index.astro";
const $$url = "/login";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
