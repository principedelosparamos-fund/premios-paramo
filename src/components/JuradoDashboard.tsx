import { auth, db } from '../lib/firebase';
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { useEffect, useState } from 'react';

export default function JuradoDashboard() {
  const [jurado, setJurado] = useState<any>(null);
  const [proyectos, setProyectos] = useState<any[]>([]);
  const [votaciones, setVotaciones] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarDatos = async () => {
      onAuthStateChanged(auth, async (user) => {
        if (!user || !user.email) return;

        // Datos del jurado
        const juradoRef = doc(db, 'jurados', user.email);
        const juradoSnap = await getDoc(juradoRef);
        if (!juradoSnap.exists()) {
          setLoading(false);
          return;
        }
        const juradoData = juradoSnap.data();
        setJurado(juradoData);

        // Proyectos por categoría
        const proyectosSnap = await getDocs(
          query(collection(db, 'proyectos'), where('categoria', 'in', juradoData.categorias))
        );
        const proyectosLista = proyectosSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setProyectos(proyectosLista);

        // Votaciones del jurado actual
        const votosSnap = await getDocs(
          query(collection(db, 'votaciones'), where('juradoEmail', '==', user.email))
        );
        const votos = votosSnap.docs.reduce((acc, doc) => {
          const data = doc.data();
          acc[data.proyectoId] = data.promedio;
          return acc;
        }, {} as Record<string, number>);
        setVotaciones(votos);

        setLoading(false);
      });
    };

    cargarDatos();
  }, []);

  if (loading) return <p className="text-center py-10">Cargando panel del jurado...</p>;
  if (!jurado) return <p className="text-red-600 text-center py-10">⚠️ Jurado no encontrado en Firestore.</p>;

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-6">
      <div className="bg-gray-100 p-4 rounded shadow">
        <p className="text-lg font-semibold">👤 Jurado: {jurado.nombre}</p>
        <p className="text-sm text-gray-600">📧 {jurado.email}</p>
        <p className="text-sm">🎯 Categorías: {jurado.categorias.join(', ')}</p>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-6 text-gold-600 text-center">Proyectos para calificar:</h2>
        {proyectos.length === 0 ? (
          <p className="text-center">No hay proyectos disponibles en tus categorías asignadas.</p>
        ) : (
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {proyectos.map((p) => (
              <li key={p.id} className="border rounded shadow overflow-hidden flex flex-col bg-white">
                {p.linkImagen ? (
                  <img
                    src={p.linkImagen}
                    alt={`Imagen de ${p.nombreProyecto}`}
                    className="w-full h-48 object-cover object-center"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-500 text-sm">
                    Sin imagen disponible
                  </div>
                )}
                <div className="p-4 flex flex-col flex-grow">
                  <h3 className="text-lg font-bold">{p.nombreProyecto}</h3>
                  <p className="text-sm text-gray-700"><strong>Postulante:</strong> {p.nombrePostulante}</p>
                  <p className="text-sm text-gray-700"><strong>Categoría:</strong> {p.categoria}</p>

                  <div className="mt-auto space-y-2">
                    <a
                      href={`/jurado/${p.id}`}
                      className="block text-center bg-gold-600 text-black font-semibold px-4 py-2 rounded hover:bg-gold-500 transition"
                    >
                      Ver ficha del proyecto →
                    </a>

                    {votaciones[p.id] !== undefined ? (
                      <p className="text-green-700 text-center mt-2">
                        ✅ Calificado — Promedio: <strong>{votaciones[p.id]}</strong>
                      </p>
                    ) : (
                      <p className="text-yellow-600 text-center mt-2">🕒 Sin calificar</p>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
