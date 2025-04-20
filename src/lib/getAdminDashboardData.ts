import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";

export async function getAdminDashboardData() {
  const proyectosSnapshot = await getDocs(collection(db, "proyectos"));
  const juradosSnapshot = await getDocs(collection(db, "jurados"));
  const votacionesSnapshot = await getDocs(collection(db, "votaciones"));

  const proyectos = proyectosSnapshot.docs.map(doc => ({
    id: doc.id,
    nombre: doc.data().nombreObra || "Sin nombre",
    categoria: doc.data().categorias || "Sin categoría",
    fechaRegistro: doc.data().fechaRegistro || "Fecha desconocida",
    nombrePostulante: doc.data().nombrePostulante || "Postulante desconocido", // si quieres mostrarlo luego
  }));

  return {
    proyectos,
    juradosCount: juradosSnapshot.size,
    proyectosVotadosCount: votacionesSnapshot.size,
  };
}
