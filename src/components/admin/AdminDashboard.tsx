export const prerender = false;
import { useEffect, useState } from "react";
import ProyectoCard from "./ProyectoCard";
import { getAdminDashboardData } from "../../lib/getAdminDashboardData";

interface Proyecto {
  id: string;
  nombre: string;
  categoria?: string;
  fechaRegistro: string;
  nombrePostulante?: string;
  calificado?: boolean; // 🔥 añadir
  nombreJurado?: string | null; // 🔥 añadir
  promedio?: number | null; // 🔥 añadir (corregí tipo, no string)
}

// Añadir interfaz para props incluyendo las directivas de cliente de Astro
interface AdminDashboardProps {
  "client:load"?: boolean;
  "client:only"?: string;
}

export default function AdminDashboard(props: AdminDashboardProps) {
  const [data, setData] = useState<{
    proyectos: Proyecto[];
    juradosCount: number;
    proyectosVotadosCount: number;
  } | null>(null);

  const [lastUpdate, setLastUpdate] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData(forceRefresh = false) {
      const storedData = localStorage.getItem('adminDashboardData');
      const storedUpdate = localStorage.getItem('adminDashboardLastUpdate');

      if (storedData && storedUpdate && !forceRefresh) {
        const timePassed = Date.now() - parseInt(storedUpdate);
        const oneHour = 3600 * 1000; // 1 hora en milisegundos

        if (timePassed > oneHour) {
          console.log("Más de 1 hora, actualizando datos automáticamente...");
          await fetchData(true); // Forzar refresco
          return;
        }

        setData(JSON.parse(storedData));
        setLastUpdate(new Date(parseInt(storedUpdate)).toLocaleString("es-CO"));
      } else {
        const result = await getAdminDashboardData();
        setData(result);
        const now = Date.now();
        localStorage.setItem('adminDashboardData', JSON.stringify(result));
        localStorage.setItem('adminDashboardLastUpdate', now.toString());
        setLastUpdate(new Date(now).toLocaleString("es-CO"));
      }
    }
    fetchData();
  }, []);

  const handleRefresh = () => {
    localStorage.removeItem('adminDashboardData');
    localStorage.removeItem('adminDashboardLastUpdate');
    window.location.reload();
  };

  if (!data) {
    return (
      <div className="flex justify-center items-center h-40">
        <p className="text-gray-600">Cargando datos...</p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      {/* Encabezado */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-xl font-bold mb-2">Dashboard Administrativo</h1>
          {lastUpdate && (
            <p className="text-sm text-gray-500">Última actualización: {lastUpdate}</p>
          )}
        </div>

        <button
          onClick={handleRefresh}
          className="mt-4 md:mt-0 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition"
        >
          🔄 Actualizar Datos Manualmente
        </button>
      </div>

      {/* Cards resumen */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-black text-white p-6 rounded-2xl flex flex-col items-center">
          <div className="text-3xl font-bold">{data.proyectos.length}</div>
          <div className="text-sm">Proyectos Registrados</div>
        </div>
        <div className="bg-black text-white p-6 rounded-2xl flex flex-col items-center">
          <div className="text-3xl font-bold">{data.juradosCount}</div>
          <div className="text-sm">Jurados Registrados</div>
        </div>
        <div className="bg-black text-white p-6 rounded-2xl flex flex-col items-center">
          <div className="text-3xl font-bold">{data.proyectosVotadosCount}</div>
          <div className="text-sm">Proyectos Votados</div>
        </div>
      </div>

      {/* Botones de Reportes */}
      <div className="flex flex-col md:flex-row gap-4">
        <a
          href="/reportes/proyectos"
          className="flex-1 text-center py-3 bg-gold-500 rounded-xl text-white font-semibold hover:bg-gold-600"
        >
          📄 Reporte Proyectos
        </a>
        <a
          href="/reportes/calificaciones"
          className="flex-1 text-center py-3 bg-gold-500 rounded-xl text-white font-semibold hover:bg-gold-600"
        >
          📊 Reporte Calificaciones
        </a>
      </div>

      {/* Listado de Proyectos */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.proyectos.map((proyecto) => (
           <ProyectoCard
           key={proyecto.id}
           id={proyecto.id}
           nombre={proyecto.nombre}
           categoria={proyecto.categoria || "Sin Categoría"}
           fechaRegistro={proyecto.fechaRegistro}
           nombrePostulante={proyecto.nombrePostulante}
           calificado={proyecto.calificado}        // 🔥 nuevo
           nombreJurado={proyecto.nombreJurado}     // 🔥 nuevo
           promedio={proyecto.promedio}             // 🔥 nuevo
         />
        ))}
      </div>
    </div>
  );
}
