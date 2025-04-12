import { useEffect, useState } from 'react';
import { db, auth } from '../lib/firebase';
import {
  collection,
  setDoc,
  doc,
  Timestamp,
  query,
  where,
  getDoc,
  getDocs
} from 'firebase/firestore';

const preguntas = [
  'Calidad técnica del video',
  'Narrativa o guion',
  'Relevancia del mensaje',
  'Creatividad',
  'Impacto visual',
  'Dirección',
  'Edición',
  'Diseño sonoro',
  'Aporte a la biodiversidad',
  'Coherencia con la categoría'
];

export default function FormularioVotacion({
  proyectoId
}: {
  proyectoId: string;
}) {
  const [respuestas, setRespuestas] = useState<number[]>(Array(preguntas.length).fill(0));
  const [enviado, setEnviado] = useState(false);
  const [yaVotado, setYaVotado] = useState(false);
  const [error, setError] = useState('');
  const [promedio, setPromedio] = useState<number | null>(null);
  const [nombreJurado, setNombreJurado] = useState('');
  const [nombreProyecto, setNombreProyecto] = useState('');

  useEffect(() => {
    const verificar = async () => {
      const user = auth.currentUser;
      if (!user || !user.email) return;

      // Obtener jurado
      const juradoSnap = await getDoc(doc(db, 'jurados', user.email));
      if (juradoSnap.exists()) {
        setNombreJurado(juradoSnap.data().nombre);
      }

      // Verificar si ya votó
      const q = query(
        collection(db, 'votaciones'),
        where('proyectoId', '==', proyectoId),
        where('juradoEmail', '==', user.email)
      );
      const snap = await getDocs(q);
      if (!snap.empty) setYaVotado(true);

      // Obtener nombre del proyecto
      const proyectoSnap = await getDoc(doc(db, 'proyectos', proyectoId));
      if (proyectoSnap.exists()) {
        setNombreProyecto(proyectoSnap.data().nombreProyecto);
      }
    };

    verificar();
  }, [proyectoId]);

  const handleChange = (index: number, valor: string) => {
    const num = parseInt(valor);
    const nuevas = [...respuestas];
    nuevas[index] = isNaN(num) ? 0 : num;
    setRespuestas(nuevas);

    const validas = nuevas.filter((n) => n >= 1 && n <= 10);
    if (validas.length === preguntas.length) {
      const suma = validas.reduce((a, b) => a + b, 0);
      setPromedio((suma / preguntas.length).toFixed(2) as unknown as number);
    } else {
      setPromedio(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user || !user.email || !nombreJurado) {
      setError('Debes estar autenticado y registrado como jurado.');
      return;
    }

    if (respuestas.includes(0)) {
      setError('Responde todas las preguntas con calificaciones del 1 al 10.');
      return;
    }

    const idVotacion = `${proyectoId}-${nombreJurado.toLowerCase().replace(/\s+/g, '-')}`;

    try {
      await setDoc(doc(db, 'votaciones', idVotacion), {
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
      setError('Error al guardar la votación.');
    }
  };

  if (yaVotado) {
    return <p className="text-green-600 font-semibold">✅ Ya has calificado este proyecto.</p>;
  }

  if (enviado) {
    return <p className="text-green-600 font-semibold">✅ ¡Votación registrada correctamente!</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 mt-8">
      <h3 className="text-xl font-bold">📝 Evaluación del jurado</h3>
      {error && <p className="text-red-600">{error}</p>}

      {preguntas.map((pregunta, index) => (
        <div key={index} className="flex items-center gap-4">
          <label className="w-full">{pregunta}</label>
          <input
            type="number"
            min={1}
            max={10}
            value={respuestas[index] || ''}
            onChange={(e) => handleChange(index, e.target.value)}
            required
            className="w-20 p-2 border rounded text-center"
          />
        </div>
      ))}

      {promedio !== null && (
        <p className="text-lg font-semibold text-blue-600">
          Promedio total: {promedio}
        </p>
      )}

      <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
        Enviar votación
      </button>
    </form>
  );
}
