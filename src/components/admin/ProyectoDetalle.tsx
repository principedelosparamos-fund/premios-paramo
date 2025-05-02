import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { db } from '../../lib/firebase'

export default function ProyectoDetalle({ id }: { id: string }) {
  const [proyecto, setProyecto] = useState<any>(null)
  const [votacion, setVotacion] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      // Traer proyecto
      const ref = doc(db, 'proyectos', id)
      const snap = await getDoc(ref)
      if (snap.exists()) {
        setProyecto(snap.data())
      } else {
        setProyecto(null)
      }

      // Traer votación asociada
      const votacionesRef = collection(db, 'votaciones')
      const q = query(votacionesRef, where('idProyecto', '==', id))
      const votacionesSnap = await getDocs(q)
      if (!votacionesSnap.empty) {
        setVotacion(votacionesSnap.docs[0].data())
      }
      setLoading(false)
    }
    fetchData()
  }, [id])

  if (loading) return <div>Cargando...</div>
  if (!proyecto) return <div>Proyecto no encontrado.</div>

  return (
    <div className="space-y-4 rounded-xl bg-white p-6 shadow">
      <h1 className="text-2xl font-bold text-black">
        {proyecto.nombreObra || 'Sin nombre'}
      </h1>
      <div className="mb-2 text-sm text-gray-600">
        <strong>Categoría:</strong>{' '}
        {proyecto.categorias?.[0] || 'Sin categoría'}
      </div>
      <div className="mb-2 text-sm text-gray-600">
        <strong>Nombre del postulante:</strong>{' '}
        {proyecto.nombrePostulante || 'No disponible'}
      </div>
      <div className="mb-2 text-sm text-gray-600">
        <strong>Fecha de registro:</strong>{' '}
        {proyecto.fechaRegistro || 'No disponible'}
      </div>
      <div className="mt-6 flex flex-col gap-4">
        {proyecto.linkImagen && (
          <a
            href={proyecto.linkImagen}
            target="_blank"
            className="bg-golddark-500 hover:bg-golddark-600 rounded px-4 py-2 text-center text-white"
          >
            📷 Ver Imagen
          </a>
        )}
        {proyecto.linkVideo && (
          <a
            href={proyecto.linkVideo}
            target="_blank"
            className="bg-golddark-500 hover:bg-golddark-600 rounded px-4 py-2 text-center text-white"
          >
            🎬 Ver Video
          </a>
        )}
        {proyecto.linkLibreto && (
          <a
            href={proyecto.linkLibreto}
            target="_blank"
            className="bg-golddark-500 hover:bg-golddark-600 rounded px-4 py-2 text-center text-white"
          >
            📄 Ver Libreto
          </a>
        )}
      </div>
      {/* Resumen de votación */}
      {votacion && (
        <div className="mt-8 space-y-4 rounded-xl bg-gray-100 p-6">
          <h2 className="text-xl font-bold text-black">Resumen de Votación</h2>
          <div className="text-sm text-gray-700">
            <strong>Jurado:</strong>{' '}
            {votacion.nombreJurado || 'Nombre no disponible'}
          </div>
          <div className="text-sm text-gray-700">
            <strong>Promedio otorgado:</strong>{' '}
            {votacion.promedio || 'No disponible'}
          </div>
          <div className="text-sm text-gray-700">
            <strong>Fecha de votación:</strong>{' '}
            {votacion.fecha || 'No disponible'}
          </div>
        </div>
      )}
    </div>
  )
}
