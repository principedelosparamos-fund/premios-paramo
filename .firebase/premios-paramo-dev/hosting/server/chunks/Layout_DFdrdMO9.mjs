import { c as createComponent, d as createAstro, e as addAttribute, f as renderHead, r as renderComponent, g as renderSlot, a as renderTemplate } from './astro/server_DBYefAC-.mjs';
/* empty css                         */
import { jsx } from 'react/jsx-runtime';
import { getAuth, signOut } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBdffqoZA3QoH8HoDyAIQ94CuCzZ5oV-zM",
  authDomain: "premios-paramo-1.firebaseapp.com",
  projectId: "premios-paramo-1",
  storageBucket: "premios-paramo-1.firebasestorage.app",
  messagingSenderId: "1:375567108:web:3853606e8b427dbb43d651",
  appId: "G-0VJ3WZJ71Z"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

function LogoutButton() {
  async function handleLogout() {
    try {
      await signOut(auth);
      console.log("✅ Usuario deslogueado.");
      localStorage.removeItem("userRole");
      localStorage.removeItem("userEmail");
      console.log("✅ LocalStorage limpiado.");
      document.cookie = "userRole=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      window.location.href = "/login";
    } catch (error) {
      console.error("❌ Error cerrando sesión:", error);
    }
  }
  return /* @__PURE__ */ jsx("button", { onClick: handleLogout, className: "bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition", children: "Cerrar Sesión" });
}

const $$Astro = createAstro();
const $$Layout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Layout;
  return renderTemplate`<html lang="es"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width"><link rel="icon" type="image/svg+xml" href="/favicon.svg"><meta name="generator"${addAttribute(Astro2.generator, "content")}><title>Premios Paramo</title>${renderHead()}</head> <body class="font-body"> <header class="p-4 flex justify-end"> ${renderComponent($$result, "LogoutButton", LogoutButton, { "client:load": true, "client:component-hydration": "load", "client:component-path": "E:/code/paramo-premios/src/components/auth/LogoutButton", "client:component-export": "default" })} </header> ${renderSlot($$result, $$slots["default"])} </body></html>`;
}, "E:/code/paramo-premios/src/layouts/Layout.astro", void 0);

export { $$Layout as $, LogoutButton as L, auth as a, db as d };
