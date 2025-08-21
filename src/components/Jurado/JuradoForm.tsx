import { createUserWithEmailAndPassword } from 'firebase/auth'
import { doc, setDoc, Timestamp } from 'firebase/firestore/lite'
import { useEffect, useState } from 'react'
import { CATEGORIES } from '../../lib/categories'
import { auth, db } from '../../lib/firebase'

export default function JuradoForm() {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [accesoPermitido, setAccesoPermitido] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const rol = localStorage.getItem('userRole')
      if (rol !== 'admin') {
        window.location.href = '/' // Redirigir si no es admin
      } else {
        setAccesoPermitido(true)
      }
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const form = e.target as HTMLFormElement
    const data = new FormData(form)
    const datos = Object.fromEntries(data.entries())

    try {
      const correo = datos.email?.toString().toLowerCase().trim()
      const celular = datos.celular?.toString().trim()

      const password = `*${celular}*`

      // 1. Crear usuario en Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        correo || '',
        password
      )
      const user = userCredential.user

      // 2. Crear documento en Firestore con el UID
      const fechaRegistro = new Date().toLocaleString('es-CO', {
        hour12: false,
      })

      await setDoc(doc(db, 'jurados', user.uid), {
        nombreJurado: datos.nombreJurado,
        email: correo,
        celular,
        categorias: data.getAll('categorias'),
        rol: 'jurado',
        fechaRegistro,
        timestamp: Timestamp.now(),
      })

      window.location.href = '/Jurado'
    } catch (err: any) {
      console.error('❌ Error al registrar jurado:', err)
      if (err.code === 'auth/email-already-in-use') {
        setError('⚠️ El correo ya está registrado como usuario.')
      } else {
        setError('❌ No se pudo registrar el jurado. Intenta nuevamente.')
      }
      setLoading(false)
    }
  }

  if (!accesoPermitido) {
    return null
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl mx-auto p-6">
      {error && <p className="text-red-600">{error}</p>}
      {loading && <p className="text-blue-600">Enviando...</p>}

      {/* 🧑 Datos del jurado */}
      <fieldset className="space-y-4">
        <legend className="font-semibold text-lg text-gold-500">
          🧑 Datos del jurado
        </legend>

        <label className="block">
          Nombre y apellido:
          <input
            name="nombreJurado"
            required
            className="w-full p-2 border rounded"
          />
        </label>

        <label className="block">
          Correo electrónico:
          <input
            type="email"
            name="email"
            required
            className="w-full p-2 border rounded"
          />
        </label>

        <label className="block">
          Celular:
          <input
            type="tel"
            name="celular"
            required
            className="w-full p-2 border rounded"
          />
        </label>
      </fieldset>

      {/* 🏆 Categorías */}
      <fieldset className="space-y-2">
        <legend className="font-semibold text-lg text-gold-500">
          🏆 Categorías que evaluará
        </legend>
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
        <button type="reset" className="border px-4 py-2 rounded text-gray-700">
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="bg-gold-600 text-black font-semibold px-4 py-2 rounded disabled:opacity-50"
        >
          {loading ? 'Enviando...' : 'Registrar Jurado'}
        </button>
      </div>
    </form>
  )
}
