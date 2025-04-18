import { useState } from 'react';
import { db } from '../lib/firebase';
import { doc, setDoc, getDoc, Timestamp } from 'firebase/firestore';

const categoriasDisponibles = [
  "Mejor largometraje de ficción",
  "Mejor largometraje documental",
  "Mejor largometraje de animación",
  "Mejor cortometraje de ficción",
  "Mejor cortometraje documental",
  "Mejor cortometraje de animación",
  "Mejor telenovela",
  "Mejor serie o miniserie",
  "Mejor serie de animación",
  "Mejor serie documental",
  "Mejor obra de teatro",
  "Mejor obra circense",
  "Mejor videojuego",
  "Mejor vodcast",
  "Mejor video musical",
  "Mejor spot publicitario",
];

export default function JuradoForm() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [juradoRegistrado, setJuradoRegistrado] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMensaje('');
    setLoading(true);

    const form = e.target as HTMLFormElement;
    const data = new FormData(form);

    const categoriasSeleccionadas = data.getAll('categorias');

    const jurado = {
      nombre: data.get('nombre')?.toString() ?? '',
      email: data.get('email')?.toString() ?? '',
      telefono: data.get('telefono')?.toString() ?? '',
      categorias: categoriasSeleccionadas,
    };

    if (!jurado.nombre || !jurado.email || !jurado.telefono || categoriasSeleccionadas.length === 0) {
      setError('Por favor completa todos los campos obligatorios.');
      setLoading(false);
      return;
    }

    try {
      const correo = jurado.email.toLowerCase().trim();
      const telefono = jurado.telefono.trim();
      const id = `${correo}-${telefono}`;

      const ref = doc(db, 'jurados', id);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        setError('⚠️ Ya existe un jurado registrado con este correo y teléfono.');
        setLoading(false);
        return;
      }

      await setDoc(ref, {
        ...jurado,
        timestamp: Timestamp.now(),
        activo: true,
      });

      setJuradoRegistrado(jurado);
      form.reset();
      setMensaje('✅ Jurado registrado exitosamente.');
    } catch (err) {
      console.error(err);
      setError('❌ Error al registrar el jurado. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleNuevoRegistro = () => {
    setMensaje('');
    setJuradoRegistrado(null);
    setError('');
  };

  if (juradoRegistrado) {
    return (
      <div className="space-y-6 max-w-2xl mx-auto p-6 text-center">
        <h2 className="text-2xl font-bold text-gold-600 mb-4">¡Registro exitoso!</h2>
        <p className="text-lg">Se registró correctamente el siguiente jurado:</p>

        <div className="bg-white text-black p-6 rounded shadow space-y-2">
          <p><strong>Nombre:</strong> {juradoRegistrado.nombre}</p>
          <p><strong>Email:</strong> {juradoRegistrado.email}</p>
          <p><strong>Teléfono:</strong> {juradoRegistrado.telefono}</p>
          <p><strong>Categorías:</strong> {juradoRegistrado.categorias.join(', ')}</p>
        </div>

        <div className="flex justify-center gap-4 mt-6">
          <button onClick={handleNuevoRegistro} className="bg-gold-600 text-black font-semibold px-6 py-2 rounded hover:bg-gold-500 transition">
            Registrar otro jurado
          </button>
          <a href="/" className="bg-gray-300 text-black font-semibold px-6 py-2 rounded hover:bg-gray-400 transition">
            Volver al inicio
          </a>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-gold-600 mb-4">Registrar nuevo jurado</h2>

      {error && <p className="text-red-600">{error}</p>}
      {mensaje && <p className="text-green-600">{mensaje}</p>}
      {loading && <p className="text-blue-600">Enviando...</p>}

      <fieldset className="space-y-4">
        <label className="block">
          Nombre completo:
          <input name="nombre" required className="w-full p-2 border rounded mt-1" />
        </label>

        <label className="block">
          Correo electrónico:
          <input name="email" type="email" required className="w-full p-2 border rounded mt-1" />
        </label>

        <label className="block">
          Teléfono:
          <input name="telefono" type="tel" required className="w-full p-2 border rounded mt-1" />
        </label>

        <fieldset className="space-y-2 mt-4">
          <legend className="font-semibold text-lg mb-2">Categorías a calificar:</legend>

          {categoriasDisponibles.map((categoria) => (
            <label key={categoria} className="flex items-center space-x-2">
              <input type="checkbox" name="categorias" value={categoria} />
              <span>{categoria}</span>
            </label>
          ))}
        </fieldset>
      </fieldset>

      <div className="flex justify-end space-x-4 mt-6">
        <button type="reset" className="border px-4 py-2 rounded text-gray-700">Cancelar</button>
        <button
          type="submit"
          disabled={loading}
          className="bg-gold-600 text-black font-semibold px-6 py-2 rounded hover:bg-gold-500 transition disabled:opacity-50"
        >
          {loading ? 'Registrando...' : 'Registrar jurado'}
        </button>
      </div>
    </form>
  );
}