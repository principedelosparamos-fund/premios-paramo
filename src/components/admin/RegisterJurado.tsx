import { useState } from "react";
import { auth, db } from "../../lib/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, Timestamp } from "firebase/firestore";
import { CATEGORIES } from "../../lib/categories"; // 👈 Importamos categorías

export default function RegisterJuradoForm() {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    celular: "",
    categorias: [] as string[],
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    let updatedCategorias = [...formData.categorias];

    if (checked) {
      updatedCategorias.push(value);
    } else {
      updatedCategorias = updatedCategorias.filter((c) => c !== value);
    }

    setFormData({ ...formData, categorias: updatedCategorias });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("🚀 Registrando nuevo jurado con datos:", formData);

    try {
      const { email, celular } = formData;
      const password = `*${celular}*`;

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log("✅ Usuario creado en Authentication:", user.uid);

      await setDoc(doc(db, "jurados", user.uid), {
        ...formData,
        rol: "jurado",
        fechaRegistro: new Date().toLocaleString("es-CO"),
        timestamp: Timestamp.now(),
      });
      console.log("✅ Documento creado en Firestore para el jurado.");

      // 🔥 Redirigimos automáticamente para registrar la conversión en funnels
      window.location.href = "/admin/jurado-inscrito";

    } catch (err: any) {
      console.error("❌ Error al registrar jurado:", err);
      setError("Error al registrar jurado. Verifica los datos o intenta nuevamente.");
      setSuccess("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6 bg-white rounded-md shadow-md">
      <h2 className="text-xl font-bold text-center mb-4">Registrar Nuevo Jurado</h2>

      {/* Nombre */}
      <div className="flex flex-col space-y-2">
        <label htmlFor="nombre" className="font-medium text-sm">Nombre</label>
        <input
          id="nombre"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border rounded-md"
        />
      </div>

      {/* Apellido */}
      <div className="flex flex-col space-y-2">
        <label htmlFor="apellido" className="font-medium text-sm">Apellido</label>
        <input
          id="apellido"
          name="apellido"
          value={formData.apellido}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border rounded-md"
        />
      </div>

      {/* Email */}
      <div className="flex flex-col space-y-2">
        <label htmlFor="email" className="font-medium text-sm">Correo Electrónico</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border rounded-md"
        />
      </div>

      {/* Celular */}
      <div className="flex flex-col space-y-2">
        <label htmlFor="celular" className="font-medium text-sm">Celular</label>
        <input
          id="celular"
          name="celular"
          value={formData.celular}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border rounded-md"
        />
      </div>

      {/* Categorías */}
      <div className="flex flex-col space-y-2">
        <label className="font-medium text-sm mb-2">Categorías que puede calificar</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {CATEGORIES.map((category) => (
            <div key={category} className="flex items-center space-x-2">
              <input
                type="checkbox"
                id={category}
                value={category}
                checked={formData.categorias.includes(category)}
                onChange={handleCategoryChange}
                className="w-4 h-4"
              />
              <label htmlFor={category} className="text-sm">{category}</label>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-500">Selecciona una o varias categorías.</p>
      </div>

      {/* Mensajes */}
      {error && <div className="text-red-600 font-semibold">{error}</div>}
      {success && <div className="text-green-600 font-semibold">{success}</div>}

      <button type="submit" className="w-full bg-gold-600 text-white py-2 rounded-md hover:bg-gold-700 transition">
        Registrar Jurado
      </button>
    </form>
  );
}
