import { useEffect, useState } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../../lib/firebase'

interface Jurado {
  id: string
  nombre: string
  apellido: string
  email: string
  celular: string
  categorias: string[]
  [key: string]: any
}

export default function ListaJurados() {
  const [jurados, setJurados] = useState<Jurado[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const cargarJurados = async () => {
      try {
        const snap = await getDocs(collection(db, 'jurados'))
        const lista = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        setJurados(lista as Jurado[])
      } catch (err) {
        console.error('Error cargando jurados:', err)
      } finally {
        setLoading(false)
      }
    }
    cargarJurados()
  }, [])

  if (loading) return <p className="py-10 text-center">Cargando jurados...</p>
  if (jurados.length === 0) return <p className="py-10 text-center">No hay jurados registrados.</p>

  return (
    <div className="container mx-auto max-w-4xl p-6">
      <h2 className="text-2xl font-bold text-center mb-6">Lista de Jurados</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded">
          <thead>
            <tr>
              <th className="px-4 py-2 border-b">Nombre completo</th>
              <th className="px-4 py-2 border-b">Email</th>
              <th className="px-4 py-2 border-b">Celular</th>
              <th className="px-4 py-2 border-b">Categorías</th>
            </tr>
          </thead>
          <tbody>
            {jurados.map((j) => (
              <tr key={j.id} className="hover:bg-gray-100">
                <td className="px-4 py-2 border-b">{j.nombre} {j.apellido}</td>
                <td className="px-4 py-2 border-b">{j.email}</td>
                <td className="px-4 py-2 border-b">{j.celular}</td>
                <td className="px-4 py-2 border-b">{Array.isArray(j.categorias) ? j.categorias.join(', ') : '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
