import { c as createComponent, d as createAstro, r as renderComponent, a as renderTemplate, m as maybeRenderHead } from '../../chunks/astro/server_DBYefAC-.mjs';
import { a as auth, d as db, $ as $$Layout } from '../../chunks/Layout_DFdrdMO9.mjs';
import { jsx, jsxs } from 'react/jsx-runtime';
import { useState, useEffect } from 'react';
import { g as getUserRole } from '../../chunks/getUserRole_DTrWKjDW.mjs';
import { getDoc, doc, query, collection, where, getDocs, setDoc, Timestamp } from 'firebase/firestore';
export { renderers } from '../../renderers.mjs';

const ProyectoFicha = ({ id }) => {
  const [proyecto, setProyecto] = useState(null);
  useEffect(() => {
    const proyectosLocal = JSON.parse(localStorage.getItem("proyectos") || "[]");
    const encontrado = proyectosLocal.find((p) => p.id === id);
    if (encontrado) {
      setProyecto(encontrado);
    } else {
      console.error("Proyecto no encontrado en localStorage.");
    }
  }, [id]);
  if (!proyecto) {
    return /* @__PURE__ */ jsx("p", { className: "text-center py-10", children: "No se encontró el proyecto." });
  }
  return /* @__PURE__ */ jsxs("main", { className: "max-w-5xl mx-auto p-6 space-y-8", children: [
    /* @__PURE__ */ jsxs("section", { className: "flex flex-col md:flex-row gap-6 items-start", children: [
      /* @__PURE__ */ jsx("div", { className: "w-full md:w-1/2 aspect-[4/3] overflow-hidden rounded bg-gray-200", children: /* @__PURE__ */ jsx(
        "img",
        {
          src: proyecto.linkImagen || "https://placehold.co/400x300",
          alt: `Imagen de ${proyecto.nombreObra}`,
          className: "w-full h-full object-cover",
          loading: "lazy"
        }
      ) }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col w-full md:w-1/2 space-y-4", children: [
        /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold text-gold-600", children: proyecto.nombreObra }),
        /* @__PURE__ */ jsxs("p", { className: "text-sm text-gray-700", children: [
          "Postulado por: ",
          proyecto.nombrePostulante
        ] }),
        proyecto.categorias && /* @__PURE__ */ jsxs("p", { className: "text-sm text-gray-600", children: [
          "Categorías: ",
          Array.isArray(proyecto.categorias) ? proyecto.categorias.join(", ") : proyecto.categorias
        ] }),
        proyecto.fechaEstreno && /* @__PURE__ */ jsxs("p", { className: "text-sm text-gray-600", children: [
          "Fecha de estreno: ",
          proyecto.fechaEstreno
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-4 mt-4", children: [
          proyecto.linkVideo && /* @__PURE__ */ jsx(
            "a",
            {
              href: proyecto.linkVideo,
              target: "_blank",
              className: "bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition",
              children: "Ver Video"
            }
          ),
          proyecto.linkLibreto && /* @__PURE__ */ jsx(
            "a",
            {
              href: proyecto.linkLibreto,
              target: "_blank",
              className: "bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition",
              children: "Ver Libreto"
            }
          )
        ] })
      ] })
    ] }),
    proyecto.sinopsis && /* @__PURE__ */ jsxs("section", { children: [
      /* @__PURE__ */ jsx("h2", { className: "text-2xl font-semibold text-gold-600 mb-2", children: "Sinopsis" }),
      /* @__PURE__ */ jsx("p", { className: "text-gray-700 whitespace-pre-line", children: proyecto.sinopsis })
    ] })
  ] });
};

const preguntas = [
  "Calidad técnica del video",
  "Narrativa o guion",
  "Relevancia del mensaje",
  "Creatividad",
  "Impacto visual",
  "Dirección",
  "Edición",
  "Diseño sonoro",
  "Aporte a la biodiversidad",
  "Coherencia con la categoría"
];
function FormularioVotacion({ proyectoId }) {
  const [respuestas, setRespuestas] = useState(Array(preguntas.length).fill(0));
  const [enviado, setEnviado] = useState(false);
  const [yaVotado, setYaVotado] = useState(false);
  const [error, setError] = useState("");
  const [promedio, setPromedio] = useState(null);
  const [nombreJurado, setNombreJurado] = useState("");
  const [nombreProyecto, setNombreProyecto] = useState("");
  useEffect(() => {
    const verificar = async () => {
      const user = auth.currentUser;
      if (!user || !user.email) return;
      try {
        const rol = await getUserRole(user.email);
        if (rol === "jurado") {
          const juradoSnap = await getDoc(doc(db, "jurados", user.email));
          if (juradoSnap.exists()) {
            setNombreJurado(juradoSnap.data().nombre);
          }
        } else if (rol === "admin") {
          setNombreJurado("Admin");
        } else {
          setError("No tienes permisos para votar.");
          return;
        }
        const q = query(
          collection(db, "votaciones"),
          where("proyectoId", "==", proyectoId),
          where("juradoEmail", "==", user.email)
        );
        const snap = await getDocs(q);
        if (!snap.empty) setYaVotado(true);
        const proyectoSnap = await getDoc(doc(db, "proyectos", proyectoId));
        if (proyectoSnap.exists()) {
          setNombreProyecto(proyectoSnap.data().nombreObra || proyectoSnap.data().nombreProyecto);
        }
      } catch (error2) {
        console.error("Error verificando jurado o admin:", error2);
        setError("Error interno al verificar usuario.");
      }
    };
    verificar();
  }, [proyectoId]);
  const handleChange = (index, valor) => {
    const num = parseInt(valor);
    const nuevas = [...respuestas];
    nuevas[index] = isNaN(num) ? 0 : num;
    setRespuestas(nuevas);
    const validas = nuevas.filter((n) => n >= 1 && n <= 10);
    if (validas.length === preguntas.length) {
      const suma = validas.reduce((a, b) => a + b, 0);
      setPromedio(parseFloat((suma / preguntas.length).toFixed(2)));
    } else {
      setPromedio(null);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user || !user.email || !nombreJurado) {
      setError("Debes estar autenticado y registrado como jurado o admin.");
      return;
    }
    if (respuestas.includes(0)) {
      setError("Debes responder todas las preguntas.");
      return;
    }
    const idVotacion = `${proyectoId}-${nombreJurado.toLowerCase().replace(/\s+/g, "-")}`;
    try {
      await setDoc(doc(db, "votaciones", idVotacion), {
        proyectoId,
        nombreProyecto,
        juradoEmail: user.email,
        nombreJurado,
        respuestas,
        promedio,
        fecha: Timestamp.now()
      });
      setEnviado(true);
    } catch (err) {
      console.error(err);
      setError("Error al guardar la votación.");
    }
  };
  if (yaVotado) {
    return /* @__PURE__ */ jsx("p", { className: "text-green-600 font-semibold", children: "✅ Ya has calificado este proyecto." });
  }
  if (enviado) {
    return /* @__PURE__ */ jsx("p", { className: "text-green-600 font-semibold", children: "✅ ¡Votación registrada correctamente!" });
  }
  return /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-6 mt-8", children: [
    /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold text-gold-600", children: "📝 Evaluación del Jurado" }),
    error && /* @__PURE__ */ jsx("p", { className: "text-red-600 font-semibold", children: error }),
    /* @__PURE__ */ jsx("div", { className: "space-y-4", children: preguntas.map((pregunta, index) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
      /* @__PURE__ */ jsx("label", { className: "w-full text-gray-700", children: pregunta }),
      /* @__PURE__ */ jsx(
        "input",
        {
          type: "number",
          min: 1,
          max: 10,
          value: respuestas[index] || "",
          onChange: (e) => handleChange(index, e.target.value),
          required: true,
          className: "w-20 p-2 border rounded text-center"
        }
      )
    ] }, index)) }),
    promedio !== null && /* @__PURE__ */ jsx("div", { className: "text-right", children: /* @__PURE__ */ jsxs("p", { className: "text-lg font-bold text-gold-600", children: [
      "Promedio final: ",
      promedio
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ jsx("button", { type: "submit", className: "bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition", children: "Enviar votación" }) })
  ] });
}

const $$Astro = createAstro();
const prerender = false;
const $$id = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$id;
  const { id } = Astro2.params;
  const projectId = id || "defaultId";
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, {}, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="mb-6"> <a href="/jurado" class="inline-flex items-center text-sm text-gold-600 hover:underline font-semibold">
← Volver al Dashboard
</a> </div> ${renderComponent($$result2, "ProyectoFicha", ProyectoFicha, { "id": projectId, "client:load": true, "client:component-hydration": "load", "client:component-path": "E:/code/paramo-premios/src/components/jurado/ProyectoFicha", "client:component-export": "default" })} ${renderComponent($$result2, "FormularioVotacion", FormularioVotacion, { "proyectoId": projectId, "client:load": true, "client:component-hydration": "load", "client:component-path": "E:/code/paramo-premios/src/components/FormularioVotacion", "client:component-export": "default" })} ` })}`;
}, "E:/code/paramo-premios/src/pages/jurado1/[id].astro", void 0);

const $$file = "E:/code/paramo-premios/src/pages/jurado1/[id].astro";
const $$url = "/jurado1/[id]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$id,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
