// src/components/jurado/FormularioVotacion.tsx

import { useState } from "react";
import { db } from "../../lib/firebase";
import { collection, addDoc, doc, updateDoc } from "firebase/firestore";
import { getUserInfoFromLocalStorage } from "../../lib/getUserRole";

interface FormularioVotacionProps {
  idProyecto: string;
  nombreProyecto: string;
}

const PREGUNTAS = [
  "Cumple con el componente técnico",
  "Pertinencia y claridad del contenido",
  "Creatividad e innovación en la propuesta",
  "Calidad de imagen y sonido",
  "Impacto visual o narrativo",
  "Promoción de la biodiversidad",
  "Inclusión y diversidad cultural",
  "Coherencia entre guion y ejecución",
  "Aporte a la conservación ambiental",
  "Originalidad de la obra",
];

const FormularioVotacion = ({ idProyecto, nombreProyecto }: FormularioVotacionProps) => {
  const [respuestas, setRespuestas] = useState<{ [key: string]: number }>({});
  const [promedio, setPromedio] = useState<number | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (criterio: string, valor: number) => {
    const nuevasRespuestas = { ...respuestas, [criterio]: valor };
    setRespuestas(nuevasRespuestas);

    if (Object.keys(nuevasRespuestas).length === 10) {
      const suma = Object.values(nuevasRespuestas).reduce((acc, val) => acc + val, 0);
      const nuevoPromedio = parseFloat((suma / 10).toFixed(1));
      setPromedio(nuevoPromedio);
    }
  };

  const handleSubmit = async () => {
    const user = getUserInfoFromLocalStorage();
    if (!user) {
      setError("Usuario no autenticado");
      return;
    }

    if (Object.keys(respuestas).length !== 10) {
      setError("Debes responder los 10 criterios antes de enviar.");
      return;
    }

    setEnviando(true);
    setError(null);

    try {
      const now = new Date();
      const fechaVotacion = now.toLocaleString("es-CO", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).replace(",", "");

      await addDoc(collection(db, "votaciones"), {
        idProyecto,
        nombreProyecto,
        nombreJurado: user.nombre,
        emailJurado: user.email,
        fechaVotacion,
        respuestas,
        promedio,
      });

      const proyectoRef = doc(db, "proyectos", idProyecto);
      await updateDoc(proyectoRef, { calificado: true });

      // 🚀 Recarga la página directamente al finalizar
      window.location.reload();
    } catch (e) {
      console.error("Error guardando votación:", e);
      setError("Ocurrió un error guardando la votación.");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4">Califica este proyecto</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {PREGUNTAS.map((pregunta, index) => {
          const criterio = `criterio${index + 1}`;
          return (
            <div key={criterio} className="flex flex-col">
              <label className="text-sm font-medium mb-1">{pregunta}</label>
              <input
                type="number"
                min={1}
                max={10}
                value={respuestas[criterio] || ""}
                onChange={(e) => handleChange(criterio, parseInt(e.target.value))}
                className="border rounded-md p-2"
              />
            </div>
          );
        })}
      </div>

      {promedio !== null && (
        <p className="mt-4 font-semibold">Promedio: {promedio}</p>
      )}

      {error && (
        <p className="text-red-500 mt-2">{error}</p>
      )}

      <button
        onClick={handleSubmit}
        disabled={enviando || Object.keys(respuestas).length !== 10}
        className="mt-6 w-full bg-gold-600 text-white font-semibold py-2 rounded hover:bg-gold-700 disabled:opacity-50"
      >
        {enviando ? "Enviando..." : "Enviar Votación"}
      </button>
    </div>
  );
};

export default FormularioVotacion;
