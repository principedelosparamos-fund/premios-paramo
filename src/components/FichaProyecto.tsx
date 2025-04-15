import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import FormularioVotacion from './FormularioVotacion';

interface Proyecto {
  nombreProyecto: string;
  nombrePostulante: string;
  email: string;
  categoria: string;
  sinopsis: string;
  fechaEstreno: any; // puede ser Timestamp o string
  linkVideo: string;
  linkLibreto: string;
  linkImagen: string;
}

export default function FichaProyecto({ id }: { id: string }) {
  const [proyecto, setProyecto] = useState<Proyecto | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProyecto() {
      try {
        const ref = doc(db, 'proyectos', id);
        const snap = await getDoc(ref);

        if (!snap.exists()) {
          setError('Proyecto no encontrado.');
        } else {
          setProyecto(snap.data() as Proyecto);
        }
      } catch (err) {
        console.error('Error al cargar el proyecto:', err);
        setError('Error al cargar el proyecto.');
      } finally {
        setLoading(false);
      }
    }

    fetchProyecto();
  }, [id]);

  const formatearFecha = (fecha: any) => {
    if (!fecha) return 'Sin fecha';
    try {
      if (typeof fecha === 'object' && 'toDate' in fecha) {
        return fecha.toDate().toLocaleDateString();
      }
      return new Date(fecha).toLocaleDateString();
    } catch {
      return 'Fecha inválida';
    }
  };

  if (loading) return <p>Cargando proyecto...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!proyecto) return null;

  return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">{proyecto.nombreProyecto}</h2>
        <p><strong>Postulante:</strong> {proyecto.nombrePostulante}</p>
        <p><strong>Correo:</strong> {proyecto.email}</p>
        <p><strong>Categoría:</strong> {proyecto.categoria}</p>
        <p><strong>Fecha de estreno:</strong> {formatearFecha(proyecto.fechaEstreno)}</p>
        <p><strong>Sinopsis:</strong> {proyecto.sinopsis}</p>

        {proyecto.linkVideo && (
          <p>
            🎬 <a href={proyecto.linkVideo} target="_blank" className="text-blue-600 underline">Ver video</a>
          </p>
        )}
        {proyecto.linkLibreto && (
          <p>
            📄 <a href={proyecto.linkLibreto} target="_blank" className="text-blue-600 underline">Ver libreto</a>
          </p>
        )}
        {proyecto.linkImagen && (
          <p>
            🖼️ <a href={proyecto.linkImagen} target="_blank" className="text-blue-600 underline">Ver imagen</a>
          </p>
        )}
        <FormularioVotacion proyectoId={id}/>
      </div>
  );
}
