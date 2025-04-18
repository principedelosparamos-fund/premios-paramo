import { useEffect, useState } from 'react';
import { collection, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';

// Función para formatear fecha
const formatearFecha = (fecha: any) => {
  if (fecha instanceof Timestamp) {
    const date = fecha.toDate();
    const dia = String(date.getDate()).padStart(2, '0');
    const mes = String(date.getMonth() + 1).padStart(2, '0');
    const anio = date.getFullYear();
    return `${dia}/${mes}/${anio}`;
  }
  if (typeof fecha === 'string') {
    const date = new Date(fecha);
    const dia = String(date.getDate()).padStart(2, '0');
    const mes = String(date.getMonth() + 1).padStart(2, '0');
    const anio = date.getFullYear();
    return `${dia}/${mes}/${anio}`;
  }
  return fecha;
};

// Función para exportar CSV
const exportToCSV = (data: any[], filename: string) => {
  const csvRows = [];
  const headers = Object.keys(data[0]);
  csvRows.push(headers.join(','));

  for (const row of data) {
    const values = headers.map(header => {
      const escaped = ('' + (row[header] ?? '')).replace(/"/g, '\\"');
      return `"${escaped}"`;
    });
    csvRows.push(values.join(','));
  }

  const csvContent = csvRows.join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
};

export default function ReportesProyectos() {
  const [proyectos, setProyectos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarProyectos = async () => {
      const cache = localStorage.getItem('proyectos_cache');
      if (cache) {
        setProyectos(JSON.parse(cache));
        setLoading(false);
        return;
      }

      try {
        const snap = await getDocs(collection(db, 'proyectos'));
        const lista = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProyectos(lista);
        localStorage.setItem('proyectos_cache', JSON.stringify(lista));
      } catch (err) {
        console.error('Error cargando proyectos:', err);
      } finally {
        setLoading(false);
      }
    };

    cargarProyectos();
  }, []);

  if (loading) return <p className="text-center py-10">Cargando proyectos...</p>;
  if (proyectos.length === 0) return <p className="text-center py-10">No hay proyectos registrados.</p>;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gold-600 text-center">Reporte de Proyectos Registrados</h2>

      <button
        onClick={() => {
          const proyectosFormateados = proyectos.map(p => {
            const copia = { ...p };
            copia.fechaEstreno = formatearFecha(copia.fechaEstreno);
            copia.fechaEnvio = formatearFecha(copia.fechaEnvio);
            return copia;
          });
          exportToCSV(proyectosFormateados, 'proyectos_registrados.csv');
        }}
        className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded mx-auto block"
      >
        Descargar CSV
      </button>

      <p className="text-center text-gray-500 mt-4 text-sm">Datos cacheados en localStorage.</p>
    </div>
  );
}
