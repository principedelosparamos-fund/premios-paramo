import { useEffect, useState } from "react";
import { db, auth } from "../../lib/firebase";
import { collection, doc, getDocs, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { getUserInfoFromLocalStorage } from "../../lib/getUserRole";
import ProyectoCard from "./ProyectoCard";

interface Proyecto {
  id: string;
  nombre: string;
  categorias: string[];
  promedioGeneral?: number;
  calificado?: boolean; // 🔥 ahora trae el campo de firestore
}

const LOCAL_STORAGE_PROYECTOS = "proyectosJurado";
const LOCAL_STORAGE_VOTACIONES = "votacionesJurado";

const DashboardJurado = () => {
  const [proyectos, setProyectos] = useState<Proyecto[]>([]);
  const [votaciones, setVotaciones] = useState<Record<string, number>>({});
  const [categoriasAsignadas, setCategoriasAsignadas] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const cargarDatos = async (forzarActualizacion = false) => {
    setLoading(true);

    const user = auth.currentUser;
    if (!user) {
      console.error("[ERROR] Usuario no autenticado.");
      setLoading(false);
      return;
    }

    console.log("[DEBUG] Usuario autenticado:", user.uid);

    try {
      const userInfo = getUserInfoFromLocalStorage();
      const nombre = userInfo?.nombre || "";

      const juradoRef = doc(db, "jurados", user.uid);
      const juradoSnap = await getDoc(juradoRef);

      let categorias: string[] = [];

      if (juradoSnap.exists()) {
        const juradoData = juradoSnap.data();
        categorias = juradoData.categorias || [];
        console.log("[DEBUG] Categorías asignadas al jurado:", categorias);
      } else {
        console.warn("[WARN] Documento de jurado no encontrado.");
      }

      setCategoriasAsignadas(categorias);

      // 🔥 Intenta cargar de localStorage si no forzamos actualización
      const proyectosLocal = localStorage.getItem(LOCAL_STORAGE_PROYECTOS);
      const votacionesLocal = localStorage.getItem(LOCAL_STORAGE_VOTACIONES);

      if (proyectosLocal && votacionesLocal && !forzarActualizacion) {
        console.log("[CACHE] Usando proyectos y votaciones del localStorage");
        setProyectos(JSON.parse(proyectosLocal));
        setVotaciones(JSON.parse(votacionesLocal));
        setLoading(false);
        return;
      }

      // 🔥 Si no hay en localStorage o se fuerza actualización
      const [proyectosSnap, votacionesSnap] = await Promise.all([
        getDocs(collection(db, "proyectos")),
        getDocs(collection(db, "votaciones")),
      ]);

      const proyectosList: Proyecto[] = [];
      proyectosSnap.forEach((doc) => {
        const data = doc.data();
        if (data.nombreObra) {
          proyectosList.push({
            id: doc.id,
            nombre: data.nombreObra,
            categorias: Array.isArray(data.categorias)
              ? data.categorias
              : (typeof data.categorias === "string" ? [data.categorias] : []), // 🔥 aquí el cambio
          });
        }
      });


      console.log("[DEBUG] Proyectos disponibles en la base de datos:", proyectosList);

      const proyectosFiltrados = proyectosList.filter((proyecto) =>
        proyecto.categorias.some((cat) => categorias.includes(cat))
      );

      console.log("[DEBUG] Proyectos filtrados por categoría:", proyectosFiltrados);
      const votos: Record<string, number> = {};
      votacionesSnap.forEach((doc) => {
        const data = doc.data();
        if (data.nombreJurado === nombre) {
          votos[data.idProyecto] = data.promedio;
        }
      });

      // 🔥 Actualizar proyectos para marcar cuáles están votados
      const proyectosActualizados = proyectosFiltrados.map((proyecto) => ({
        ...proyecto,
        calificado: !!votos[proyecto.id], // si existe un voto para ese proyecto, está calificado
      }));

      console.log("[DEBUG] Votaciones del jurado:", votos);
      console.log("[DEBUG] Proyectos actualizados con estado de votación:", proyectosActualizados);

      setProyectos(proyectosActualizados);
      setVotaciones(votos);

      // 🔥 Guardar en localStorage
      localStorage.setItem(LOCAL_STORAGE_PROYECTOS, JSON.stringify(proyectosActualizados));
      localStorage.setItem(LOCAL_STORAGE_VOTACIONES, JSON.stringify(votos));


    } catch (error) {
      console.error("[ERROR] Error cargando datos de jurado:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        cargarDatos();
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const actualizarManualmente = () => {
    console.log("[DEBUG] Actualización manual solicitada");
    cargarDatos(true); // 🔥 Forzar nueva carga desde Firestore
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="text-gray-600">Cargando proyectos...</span>
      </div>
    );
  }

  if (proyectos.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center h-64 text-center p-4">
        <p className="text-lg font-semibold text-gray-700 mb-2">
          No tienes proyectos asignados todavía
        </p>
        <button
          onClick={actualizarManualmente}
          className="mt-4 px-4 py-2 bg-gold-600 text-white rounded-lg"
        >
          Actualizar
        </button>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex justify-end mb-4">
        <button
          onClick={actualizarManualmente}
          className="px-4 py-2 bg-gold-600 text-white rounded-lg"
        >
          Actualizar proyectos
        </button>
      </div>
      <div className="grid gap-6">
        {proyectos.map((proyecto) => (
          <ProyectoCard
            key={proyecto.id}
            proyecto={{
              id: proyecto.id,
              nombre: proyecto.nombre,
              categorias: proyecto.categorias,
              promedioGeneral: proyecto.promedioGeneral,
            }}
            votado={proyecto.calificado}
            promedioVotacionJurado={votaciones[proyecto.id]}
            modo="jurado"
          />
        ))}
      </div>
    </div>
  );
};

export default DashboardJurado;
