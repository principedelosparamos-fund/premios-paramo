import { useState } from 'react';
import { db } from '../lib/firebase';
import {
  doc,
  setDoc,
  getDoc,
  Timestamp
} from 'firebase/firestore';

// Función base para limpiar y formatear el nombre del proyecto
function generarIdBase(nombre: string): string {
  return nombre
    .normalize('NFD')                     // eliminar acentos
    .replace(/[\u0300-\u036f]/g, '')      // limpiar tildes
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')          // eliminar caracteres especiales
    .trim()
    .replace(/\s+/g, '-');                // reemplazar espacios por guiones
}

// Verifica si el ID ya existe y genera uno único agregando -1, -2, etc.
async function generarIdUnico(nombre: string): Promise<string> {
  const baseId = generarIdBase(nombre);
  let id = baseId;
  let contador = 1;

  while (true) {
    const ref = doc(db, 'proyectos', id);
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      return id;
    }
    id = `${baseId}-${contador}`;
    contador++;
  }
}

export default function ProyectoForm() {
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMensaje('');
    setLoading(true);

    const form = e.target as HTMLFormElement;
    const data = new FormData(form);
    const proyecto = Object.fromEntries(data.entries());

    if (!proyecto.nombreProyecto || !proyecto.linkVideo || !proyecto.email) {
      setError('Por favor completa todos los campos obligatorios.');
      setLoading(false);
      return;
    }

    try {
      const id = await generarIdUnico(proyecto.nombreProyecto.toString());

      await setDoc(doc(db, 'proyectos', id), {
        ...proyecto,
        fechaEstreno: new Date(proyecto.fechaEstreno.toString()),
        fechaEnvio: Timestamp.now(),
        calificado: false
      });

      form.reset();
      setMensaje(`✅ Tu proyecto ha sido registrado exitosamente con el ID: ${id}`);
    } catch (err) {
      console.error(err);
      setError('❌ No se pudo registrar el proyecto. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl mx-auto">
      {error && <p className="text-red-600">{error}</p>}
      {mensaje && <p className="text-green-600">{mensaje}</p>}
      {loading && <p className="text-blue-600">Enviando...</p>}

      <input name="nombrePostulante" placeholder="Nombre del postulante" required className="w-full p-2 border rounded" />
      <input name="email" type="email" placeholder="Correo del postulante" required className="w-full p-2 border rounded" />
      <input name="nombreProyecto" placeholder="Nombre del proyecto" required className="w-full p-2 border rounded" />
      <input name="linkVideo" type="url" placeholder="Link al video (YouTube/Vimeo)" required className="w-full p-2 border rounded" />
      <input name="linkLibreto" type="url" placeholder="Link al libreto (PDF/Drive)" className="w-full p-2 border rounded" />
      <input name="linkImagen" type="url" placeholder="Link a imagen del proyecto" className="w-full p-2 border rounded" />
      <input name="fechaEstreno" type="date" required className="w-full p-2 border rounded" />
      <textarea name="sinopsis" placeholder="Sinopsis" rows={4} required className="w-full p-2 border rounded"></textarea>
      <select name="categoria" required className="w-full p-2 border rounded">
        <option value="">Selecciona una categoría</option>
        <option value="documental">Documental</option>
        <option value="corto">Cortometraje</option>
        <option value="animacion">Animación</option>
      </select>

      <button
        type="submit"
        disabled={loading}
        className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {loading ? 'Enviando...' : 'Registrar proyecto'}
      </button>
    </form>
  );
}
