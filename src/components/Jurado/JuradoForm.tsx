import { useState } from 'react';
import { db } from '../../lib/firebase';
import { doc, setDoc, getDoc, Timestamp } from 'firebase/firestore';
import { CATEGORIES } from '../../lib/categories';

// Función para formatear fecha
const formatearFecha = (fechaInput: string) => {
  const fecha = new Date(fechaInput);
  const dia = fecha.getDate().toString().padStart(2, '0');
  const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
  const año = fecha.getFullYear();
  const horas = fecha.getHours().toString().padStart(2, '0');
  const minutos = fecha.getMinutes().toString().padStart(2, '0');
  return `${dia}/${mes}/${año} ${horas}:${minutos}`;
};

export default function JuradoForm() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const form = e.target as HTMLFormElement;
    const data = new FormData(form);
    const datos = Object.fromEntries(data.entries());

    try {
      const correo = datos.email?.toString().toLowerCase().trim();
      const celular = datos.celular?.toString().trim();
      const id = `${correo}-${celular}`;

      const ref = doc(db, 'jurados', id);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        setError('⚠️ Ya existe un jurado registrado con este correo y celular.');
        setLoading(false);
        return;
      }

      const fechaRegistro = new Date().toLocaleString('es-CO', { hour12: false });

      await setDoc(ref, {
        ...datos,
        categorias: data.getAll('categorias'),
        rol: 'jurado',
        fechaRegistro,
        timestamp: Timestamp.now(),
      });

      window.location.href = '/jurado-gracias';
    } catch (err) {
      console.error(err);
      setError('❌ No se pudo registrar el jurado. Intenta nuevamente.');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl mx-auto p-6">
      {error && <p className="text-red-600">{error}</p>}
      {loading && <p className="text-blue-600">Enviando...</p>}

      {/* 🧑 Datos del jurado */}
      <fieldset className="space-y-4">
        <legend className="font-semibold text-lg text-gold-500">🧑 Datos del jurado</legend>

        <label className="block">
          Nombre y apellido:
          <input name="nombreJurado" required className="w-full p-2 border rounded" />
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

      {/* 🏆 Categorías */}
      <fieldset className="space-y-2">
        <legend className="font-semibold text-lg text-gold-500">🏆 Categorías que evaluará</legend>
        {CATEGORIES.map((categoria) => (
          <label key={categoria} className="block">
            <input
              type="checkbox"
              name="categorias"
              value={categoria}
              className="mr-2"
            />
            {categoria}
          </label>
        ))}
      </fieldset>

      {/* Botones */}
      <div className="flex justify-end gap-4">
        <button type="reset" className="border px-4 py-2 rounded text-gray-700">Cancelar</button>
        <button type="submit" disabled={loading} className="bg-gold-600 text-black font-semibold px-4 py-2 rounded disabled:opacity-50">
          {loading ? 'Enviando...' : 'Registrarse'}
        </button>
      </div>
    </form>
  );
}
