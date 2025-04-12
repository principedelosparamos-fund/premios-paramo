import { useState } from 'react';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';

export default function ProyectoForm() {
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMensaje('');

    const form = e.target as HTMLFormElement;
    const data = new FormData(form);
    const proyecto = Object.fromEntries(data.entries());

    if (!proyecto.nombreProyecto || !proyecto.linkVideo || !proyecto.email) {
      setError('Por favor completa los campos obligatorios.');
      setLoading(false);
      return;
    }

    try {
      await addDoc(collection(db, 'proyectos'), {
        ...proyecto,
        fechaEstreno: new Date(proyecto.fechaEstreno.toString()),
        fechaEnvio: Timestamp.now(),
        calificado: false,
      });

      form.reset();
      setMensaje('✅ Tu proyecto ha sido registrado exitosamente.');
    } catch (err: any) {
      console.error('Error al guardar en Firestore:', err.message);
      setError('❌ No se pudo guardar el proyecto. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl mx-auto">
      {error && <p className="text-red-600">{error}</p>}
      {mensaje && <p className="text-green-600">{mensaje}</p>}

      <input name="nombrePostulante" placeholder="Nombre del postulante" required className="w-full p-2 border rounded" />
      <input name="email" type="email" placeholder="Correo del postulante" required className="w-full p-2 border rounded" />
      <input name="nombreProyecto" placeholder="Nombre del proyecto" required className="w-full p-2 border rounded" />
      <input name="linkVideo" type="url" placeholder="Link al video" required className="w-full p-2 border rounded" />
      <input name="linkLibreto" type="url" placeholder="Link al libreto" className="w-full p-2 border rounded" />
      <input name="linkImagen" type="url" placeholder="Link a imagen del proyecto" className="w-full p-2 border rounded" />
      <input name="fechaEstreno" type="date" required className="w-full p-2 border rounded" />
      <textarea name="sinopsis" placeholder="Sinopsis" rows={4} required className="w-full p-2 border rounded" />
      <select name="categoria" required className="w-full p-2 border rounded">
        <option value="">Selecciona una categoría</option>
        <option value="documental">Documental</option>
        <option value="corto">Cortometraje</option>
        <option value="animacion">Animación</option>
      </select>

      <button type="submit" disabled={loading} className="bg-green-600 text-white px-4 py-2 rounded">
        {loading ? 'Enviando...' : 'Registrar proyecto'}
      </button>
    </form>
  );
}
