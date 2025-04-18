import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

interface Jurado {
  nombre: string;
  email: string;
  telefono: string;
  categorias: string[];
}

export default function JuradoPanel() {
  const [jurados, setJurados] = useState<Jurado[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJurados = async () => {
      try {
        const juradosRef = collection(db, 'jurados');
        const snapshot = await getDocs(juradosRef);
        const listaJurados = snapshot.docs.map((doc) => doc.data() as Jurado);
        setJurados(listaJurados);
      } catch (error) {
        console.error('Error cargando jurados:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchJurados();
  }, []);

  if (loading) {
    return <p className="text-center py-10">Cargando jurados...</p>;
  }

  if (jurados.length === 0) {
    return <p className="text-center py-10">No hay jurados registrados.</p>;
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-gold-600 mb-8 text-center">Panel de Jurados Registrados</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-negroParamo text-white">
            <tr>
              <th className="py-3 px-4 text-left">Nombre</th>
              <th className="py-3 px-4 text-left">Correo</th>
              <th className="py-3 px-4 text-left">Teléfono</th>
              <th className="py-3 px-4 text-left">Categorías</th>
            </tr>
          </thead>
          <tbody>
            {jurados.map((jurado, idx) => (
              <tr key={idx} className="border-b last:border-none">
                <td className="py-3 px-4">{jurado.nombre}</td>
                <td className="py-3 px-4">{jurado.email}</td>
                <td className="py-3 px-4">{jurado.telefono}</td>
                <td className="py-3 px-4">
                {jurado.categorias && Array.isArray(jurado.categorias) ? (
                    <ul className="list-disc pl-5 space-y-1">
                    {jurado.categorias.map((cat, i) => (
                        <li key={i}>{cat}</li>
                    ))}
                    </ul>
                ) : (
                    <p className="text-gray-400 italic">Sin categorías</p>
                )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
