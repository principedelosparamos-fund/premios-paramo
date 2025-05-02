import { createUserWithEmailAndPassword } from 'firebase/auth'
import { doc, setDoc, Timestamp } from 'firebase/firestore'
import { useState } from 'react'
import { CATEGORIES } from '../../lib/categories' // 👈 Importamos categorías
import { auth, db } from '../../lib/firebase'

export default function RegisterJuradoForm() {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    celular: '',
    categorias: [] as string[],
  })

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target
    let updatedCategorias = [...formData.categorias]

    if (checked) {
      updatedCategorias.push(value)
    } else {
      updatedCategorias = updatedCategorias.filter((c) => c !== value)
    }

    setFormData({ ...formData, categorias: updatedCategorias })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('🚀 Registrando nuevo jurado con datos:', formData)

    try {
      const { email, celular } = formData
      const password = `*${celular}*`

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      )
      const user = userCredential.user
      console.log('✅ Usuario creado en Authentication:', user.uid)

      await setDoc(doc(db, 'jurados', user.uid), {
        ...formData,
        rol: 'jurado',
        fechaRegistro: new Date().toLocaleString('es-CO'),
        timestamp: Timestamp.now(),
      })
      console.log('✅ Documento creado en Firestore para el jurado.')

      // 🔥 Redirigimos automáticamente para registrar la conversión en funnels
      window.location.href = '/admin/jurado-inscrito'
    } catch (err: any) {
      console.error('❌ Error al registrar jurado:', err)
      setError(
        'Error al registrar jurado. Verifica los datos o intenta nuevamente.'
      )
      setSuccess('')
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-md bg-white p-6 shadow-md"
    >
      <h2 className="mb-4 text-center text-xl font-bold">
        Registrar Nuevo Jurado
      </h2>

      {/* Nombre */}
      <div className="flex flex-col space-y-2">
        <label htmlFor="nombre" className="text-sm font-medium">
          Nombre
        </label>
        <input
          id="nombre"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          required
          className="w-full rounded-md border px-4 py-2"
        />
      </div>

      {/* Apellido */}
      <div className="flex flex-col space-y-2">
        <label htmlFor="apellido" className="text-sm font-medium">
          Apellido
        </label>
        <input
          id="apellido"
          name="apellido"
          value={formData.apellido}
          onChange={handleChange}
          required
          className="w-full rounded-md border px-4 py-2"
        />
      </div>

      {/* Email */}
      <div className="flex flex-col space-y-2">
        <label htmlFor="email" className="text-sm font-medium">
          Correo Electrónico
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full rounded-md border px-4 py-2"
        />
      </div>

      {/* Celular */}
      <div className="flex flex-col space-y-2">
        <label htmlFor="celular" className="text-sm font-medium">
          Celular
        </label>
        <input
          id="celular"
          name="celular"
          value={formData.celular}
          onChange={handleChange}
          required
          className="w-full rounded-md border px-4 py-2"
        />
      </div>

      {/* Categorías */}
      <div className="flex flex-col space-y-2">
        <label className="mb-2 text-sm font-medium">
          Categorías que puede calificar
        </label>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {CATEGORIES.map((category) => (
            <div key={category} className="flex items-center space-x-2">
              <input
                type="checkbox"
                id={category}
                value={category}
                checked={formData.categorias.includes(category)}
                onChange={handleCategoryChange}
                className="h-4 w-4"
              />
              <label htmlFor={category} className="text-sm">
                {category}
              </label>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-500">
          Selecciona una o varias categorías.
        </p>
      </div>

      {/* Mensajes */}
      {error && <div className="font-semibold text-red-600">{error}</div>}
      {success && <div className="font-semibold text-green-600">{success}</div>}

      <button
        type="submit"
        className="bg-golddark-500 hover:bg-golddark-600 w-full rounded-md py-2 text-white transition"
      >
        Registrar Jurado
      </button>
    </form>
  )
}
