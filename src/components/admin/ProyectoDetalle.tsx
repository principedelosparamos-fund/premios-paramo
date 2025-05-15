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
    <div className="space-y-8 rounded-xl bg-white p-8 shadow">
      <strong className="text-golddark-500">Nombre de la obra:</strong>
      <div className="text-golddark-500 mb-4 py-4 pb-0 text-2xl font-bold">
        {proyecto.nombreObra || 'Sin nombre'}
      </div>
      {/* Información General */}
      <section>
        <h2 className="text-golddark-700 mb-2 text-lg font-bold">
          Información General
        </h2>
        <div className="text-md mb-2 text-gray-700">
          <strong>Categoría:</strong>{' '}
          {proyecto.categorias?.[0] || 'Sin categoría'}
        </div>
        <div className="text-md mb-2 text-gray-700">
          <strong>Escritores:</strong> {proyecto.escritores || 'No disponible'}
        </div>
        <div className="text-md mb-2 text-gray-700">
          <strong>Fecha de estreno:</strong>{' '}
          {proyecto.fechaEstreno || 'No disponible'}
        </div>
        <div className="text-md mb-2 text-gray-700">
          <strong>Fecha de registro:</strong>{' '}
          {proyecto.fechaRegistro || 'No disponible'}
        </div>
        <div className="text-md mb-2 text-gray-700">
          <strong>Sinopsis:</strong>
          <p
            style={{
              maxHeight: '200px',
              overflow: 'auto',
              wordBreak: 'break-word',
              background: '#f9fafb',
              padding: '8px',
              borderRadius: '6px',
            }}
          >
            {proyecto.sinopsis || 'No disponible'}
          </p>
        </div>
      </section>

      {/* Información del Postulante */}
      <section>
        <h2 className="text-golddark-700 mb-2 text-lg font-bold">
          Información del Postulante
        </h2>
        <div className="text-md mb-2 text-gray-700">
          <strong>Nombre:</strong>{' '}
          {proyecto.nombrePostulante || 'No disponible'}
        </div>
        <div className="text-md mb-2 text-gray-700">
          <strong>Perfil:</strong> {proyecto.perfil || 'No disponible'}
        </div>
        <div className="text-md mb-2 text-gray-700">
          <strong>Perfil de pago:</strong>{' '}
          {proyecto.perfilPago || 'No disponible'}
        </div>
        <div className="text-md mb-2 text-gray-700">
          <strong>Celular:</strong> {proyecto.celular || 'No disponible'}
        </div>
        <div className="text-md mb-2 text-gray-700">
          <strong>Email:</strong> {proyecto.email || 'No disponible'}
        </div>
      </section>

      {/* Estado y Autorizaciones */}
      <section>
        <h2 className="text-golddark-700 mb-2 text-lg font-bold">
          Estado y Autorizaciones
        </h2>
        <div className="text-md mb-2 text-gray-700">
          <strong>Calificado:</strong>{' '}
          {proyecto.calificado === true ? 'Sí' : 'No'}
        </div>
        <div className="text-md mb-2 text-gray-700">
          <strong>Pago realizado:</strong>{' '}
          {proyecto.pagoRealizado === 'on' ? 'Sí' : 'No'}
        </div>
        <div className="text-md mb-2 text-gray-700">
          <strong>Acepta reglamento:</strong>{' '}
          {proyecto.aceptaReglamento === 'on' ? 'Sí' : 'No'}
        </div>
        <div className="text-md mb-2 text-gray-700">
          <strong>Contacto autorizado:</strong>{' '}
          {proyecto.contactoAutorizado === 'on' ? 'Sí' : 'No'}
        </div>
        <div className="text-md mb-2 text-gray-700">
          <strong>Garantía de veracidad:</strong>{' '}
          {proyecto.garantiaVeracidad === 'on' ? 'Sí' : 'No'}
        </div>
      </section>

      {/* Materiales Adjuntos */}
      <section>
        <h2 className="text-golddark-700 mb-2 text-lg font-bold">
          Materiales Adjuntos
        </h2>
        <div className="flex flex-wrap gap-4">
          {proyecto.linkImagen && (
            <a
              href={proyecto.linkImagen}
              target="_blank"
              className="bg-golddark-500 hover:bg-golddark-600 rounded px-4 py-2 text-center text-white"
              rel="noopener noreferrer"
            >
              📷 Ver Imagen
            </a>
          )}
          {proyecto.linkVideo && (
            <a
              href={proyecto.linkVideo}
              target="_blank"
              className="bg-golddark-500 hover:bg-golddark-600 rounded px-4 py-2 text-center text-white"
              rel="noopener noreferrer"
            >
              🎬 Ver Video
            </a>
          )}
          {proyecto.linkLibreto && (
            <a
              href={proyecto.linkLibreto}
              target="_blank"
              className="bg-golddark-500 hover:bg-golddark-600 rounded px-4 py-2 text-center text-white"
              rel="noopener noreferrer"
            >
              📄 Ver Libreto
            </a>
          )}
        </div>
      </section>
      {/* Resumen de votación */}
      {votacion && (
        <div className="mt-8 space-y-4 rounded-xl bg-gray-100 p-6">
          <h2 className="text-xl font-bold text-black">Resumen de Votación</h2>
          <div className="text-md text-gray-700">
            <strong>Jurado:</strong>{' '}
            {votacion.nombreJurado || 'Nombre no disponible'}
          </div>
          <div className="text-md text-gray-700">
            <strong>Promedio otorgado:</strong>{' '}
            {votacion.promedio || 'No disponible'}
          </div>
          <div className="text-md text-gray-700">
            <strong>Fecha de votación:</strong>{' '}
            {votacion.fecha || 'No disponible'}
          </div>
        </div>
      )}
    </div>
  )
}
