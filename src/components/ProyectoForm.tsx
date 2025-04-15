import { useState } from 'react';
import { db } from '../lib/firebase';
import {
  doc,
  setDoc,
  getDoc,
  Timestamp
} from 'firebase/firestore';

export default function ProyectoForm() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const form = e.target as HTMLFormElement;
    const data = new FormData(form);
    const datos = Object.fromEntries(data.entries());

    // Validación de checkboxes
    if (
      !data.get('aceptaReglamento') ||
      !data.get('contactoAutorizado') ||
      !data.get('garantiaVeracidad')
    ) {
      setError('Debes aceptar todos los términos antes de enviar.');
      setLoading(false);
      return;
    }

    try {
      const correo = datos.email?.toString().toLowerCase().trim();
      const celular = datos.celular?.toString().trim();
      const id = `${correo}-${celular}`;

      const ref = doc(db, 'proyectos', id);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        setError('⚠️ Ya existe una postulación con este correo y celular.');
        setLoading(false);
        return;
      }

      await setDoc(ref, {
        ...datos,
        fechaEstreno: new Date(datos.fechaEstreno.toString()),
        timestamp: Timestamp.now(),
        calificado: false,
      });

      // ✅ Redirigir nativamente sin React Router
      window.location.href = '/proyecto-gracias';

    } catch (err) {
      console.error(err);
      setError('❌ No se pudo registrar la obra. Intenta nuevamente.');
      setLoading(false);
    }

  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
      <h2 className="text-xl font-bold text-gold-600">Formulario de Postulación</h2>

      {error && <p className="text-red-600">{error}</p>}
      {loading && <p className="text-blue-600">Enviando...</p>}

      {/* 🧍 Datos del postulante */}
      <fieldset className="space-y-3">
        <legend className="font-semibold text-lg text-gold-500">🧍 Datos del postulante</legend>

        <label className="block">
          Nombre y apellido:
          <input name="nombrePostulante" required className="w-full p-2 border rounded" />
        </label>

        <label className="block">
          Perfil del postulante:
          <select name="perfil" required className="w-full p-2 border rounded">
            <option value="">Seleccione una opción</option>
            <option value="autor">Autor(a) de la obra</option>
            <option value="productor">Productor(a) de la obra</option>
            <option value="ejecutivo">Ejecutivo(a) del medio</option>
          </select>
        </label>

        <label className="block">
          Correo electrónico:
          <input type="email" name="email" required className="w-full p-2 border rounded" />
        </label>

        <label className="block">
          Celular:
          <input type="tel" name="celular" required className="w-full p-2 border rounded" />
        </label>
      </fieldset>

      {/* 🎬 Información de la obra */}
      <fieldset className="space-y-3">
        <legend className="font-semibold text-lg text-gold-500">🎬 Información de la obra</legend>

        <label className="block">
          Nombre de la obra:
          <input name="nombreObra" required className="w-full p-2 border rounded" />
        </label>

        <label className="block">
          Escritor(es) de la obra:
          <input name="escritores" required className="w-full p-2 border rounded" />
        </label>

        <label className="block">
          Fecha de estreno:
          <input type="date" name="fechaEstreno" required className="w-full p-2 border rounded" />
        </label>

        <label className="block">
          Sinopsis:
          <textarea name="sinopsis" rows={4} required className="w-full p-2 border rounded" />
        </label>
      </fieldset>

      {/* 🔗 Enlaces */}
      <fieldset className="space-y-3">
        <legend className="font-semibold text-lg text-gold-500">🔗 Enlaces de postulación</legend>

        <label className="block">
          Imagen oficial (Drive sin acceso):
          <input type="url" name="linkImagen" required className="w-full p-2 border rounded" />
        </label>

        <label className="block">
          Libreto oficial (Drive sin acceso):
          <input type="url" name="linkLibreto" required className="w-full p-2 border rounded" />
        </label>

        <label className="block">
          Obra audiovisual o tráiler:
          <input type="url" name="linkVideo" required className="w-full p-2 border rounded" />
        </label>
      </fieldset>

      {/* 🏆 Categoría */}
      <label className="block font-semibold text-gold-500">
        Categoría de postulación:
        <select name="categoria" required className="w-full p-2 border rounded">
          <option value="">Seleccione una categoría</option>
          <option value="documental">Documental</option>
          <option value="cortometraje">Cortometraje</option>
          <option value="animacion">Animación</option>
          <option value="teatro">Teatro</option>
          <option value="circo">Circo</option>
          <option value="videojuego">Videojuego</option>
          {/* Agrega las demás aquí */}
        </select>
      </label>

      {/* ✅ Consentimientos */}
      <fieldset className="space-y-2">
        <legend className="font-semibold text-lg text-gold-500">✅ Consentimientos</legend>

        <label className="block">
          <input type="checkbox" name="aceptaReglamento" required className="mr-2" />
          He leído el reglamento y estoy de acuerdo con su contenido.
        </label>
        <label className="block">
          <input type="checkbox" name="contactoAutorizado" required className="mr-2" />
          Autorizo el uso de mis datos de contacto por parte de la organización.
        </label>
        <label className="block">
          <input type="checkbox" name="garantiaVeracidad" required className="mr-2" />
          Garantizo que la información es veraz y que tengo facultad para hacer esta postulación.
        </label>
      </fieldset>

      {/* Botones */}
      <div className="flex justify-end space-x-4">
        <button type="reset" className="border px-4 py-2 rounded text-gray-700">Cancelar</button>
        <button type="submit" disabled={loading} className="bg-gold-600 text-black font-semibold px-4 py-2 rounded disabled:opacity-50">
          {loading ? 'Enviando...' : 'Postular'}
        </button>
      </div>
    </form>
  );
}
