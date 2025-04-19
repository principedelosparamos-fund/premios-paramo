import { useEffect, useState } from 'react';
import { db } from '../../lib/firebase';
import { collection, getDocs, doc, getDoc, query, where } from 'firebase/firestore';
import ProyectoCard from '../../components/Jurado/ProyectoCard'; // El componente independiente de las cards

const DashboardJurado = () => {
  const [proyectos, setProyectos] = useState<any[]>([]);
  const [calificaciones, setCalificaciones] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [rol, setRol] = useState<string>('jurado');

  useEffect(() => {
    const cargarDatos = async () => {
      setLoading(true);

      if (typeof window === "undefined") return;

      try {
        const email = localStorage.getItem('userEmail') || "";
        const rolGuardado = localStorage.getItem('userRol') || "jurado";
        setRol(rolGuardado);

        // ❗ Solo exigir email si no es admin
        if (rolGuardado !== "admin" && !email) {
          console.error('⚠️ No se encontró email para jurado.');
          setLoading(false);
          return;
        }

        // 1. Cargar proyectos
        const metadataRef = doc(db, 'sistema', 'metadata');
        const metadataSnap = await getDoc(metadataRef);

        if (!metadataSnap.exists()) {
          console.error('⚠️ No existe metadata.');
          setLoading(false);
          return;
        }

        const metadata = metadataSnap.data();
        const proyectosVersionFirebase = metadata.proyectosVersion;

        const proyectosLocal = JSON.parse(localStorage.getItem('proyectos') || '[]');
        const proyectosVersionLocal = Number(localStorage.getItem('proyectosVersion')) || 0;

        let proyectosCargados = [];

        if (proyectosLocal.length > 0 && proyectosVersionLocal === proyectosVersionFirebase) {
          proyectosCargados = proyectosLocal;
        } else {
          const proyectosRef = collection(db, 'proyectos');
          const proyectosSnap = await getDocs(proyectosRef);

          proyectosCargados = proyectosSnap.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));

          localStorage.setItem('proyectos', JSON.stringify(proyectosCargados));
          localStorage.setItem('proyectosVersion', proyectosVersionFirebase.toString());
        }

        setProyectos(proyectosCargados);

        // 2. Si es jurado, cargar votaciones
        if (rolGuardado !== "admin") {
          const votacionesRef = collection(db, 'votaciones');
          const q = query(votacionesRef, where('juradoEmail', '==', email));
          const votacionesSnap = await getDocs(q);

          const votacionesCargadas = votacionesSnap.docs.map(doc => ({
            idProyecto: doc.data().proyectoId,
            promedio: doc.data().promedio,
            fecha: doc.data().fecha?.toDate() || null,
          }));

          setCalificaciones(votacionesCargadas);
        }

        setLoading(false);

      } catch (error) {
        console.error('❌ Error cargando datos:', error);
        setLoading(false);
      }
    };

    cargarDatos();
  }, []);

  if (loading) {
    return <p className="text-center py-10">Cargando proyectos disponibles...</p>;
  }

  const buscarCalificacion = (proyectoId: string) => {
    return calificaciones.find((cal) => cal.idProyecto === proyectoId);
  };

  return (
    <div className="space-y-6 container mx-auto py-10">
      <h1 className="text-2xl font-bold text-center text-gold-600">Proyectos disponibles</h1>

      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {proyectos.map((proyecto) => (
          <ProyectoCard
            key={proyecto.id}
            proyecto={proyecto}
            calificacion={buscarCalificacion(proyecto.id)}
            rol={rol}
          />
        ))}
      </ul>
    </div>
  );
};

export default DashboardJurado;
