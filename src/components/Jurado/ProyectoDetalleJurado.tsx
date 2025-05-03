import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { auth, db } from '../../lib/firebase'
import FormularioVotacion from './FormularioVotacion.tsx'

export default function ProyectoDetalleJurado({ id }: { id: string }) {
  const [proyecto, setProyecto] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [yaFueCalificado, setYaFueCalificado] = useState<boolean>(false)
  const [checkingVoto, setCheckingVoto] = useState(true)

  useEffect(() => {
    async function fetchProyecto() {
      const ref = doc(db, 'proyectos', id)
      const snap = await getDoc(ref)
      setProyecto(snap.exists() ? snap.data() : null)
      setLoading(false)
    }
    fetchProyecto()
  }, [id])

  useEffect(() => {
    async function checkSiYaFueCalificado() {
      setCheckingVoto(true)
      const q = query(
        collection(db, 'votaciones'),
        where('idProyecto', '==', id)
      )
      const querySnap = await getDocs(q)
      setYaFueCalificado(!querySnap.empty)
      setCheckingVoto(false)
    }
    if (id) checkSiYaFueCalificado()
  }, [id])

  if (loading || checkingVoto) return <div>Cargando...</div>
  if (!proyecto) return <div>Proyecto no encontrado.</div>

  return (
    <div className="space-y-4 rounded-xl bg-white p-6 shadow">
      <h1 className="text-2xl font-bold text-black">
        {proyecto.nombreObra || 'Sin nombre'}
      </h1>
      <div className="mb-2 text-sm text-gray-600">
        <strong>Postulado por:</strong>{' '}
        {proyecto.nombrePostulante || 'No disponible'}
      </div>
      <div className="mb-2 text-sm text-gray-600">
        <strong>Categoría:</strong>{' '}
        {Array.isArray(proyecto.categorias)
          ? proyecto.categorias.join(', ')
          : proyecto.categorias || 'No asignada'}
      </div>
      <div className="mb-2 text-sm text-gray-600">
        <strong>Perfil:</strong> {proyecto.perfil || 'No disponible'}
      </div>
      <div className="mb-2 text-sm text-gray-600">
        <strong>Fecha de Registro:</strong>{' '}
        {proyecto.fechaRegistro || 'No disponible'}
      </div>
      <div className="mb-2 text-sm text-gray-600">
        <strong>Sinopsis:</strong> {proyecto.sinopsis || 'No disponible'}
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
      <div className="mt-8">
        <FormularioVotacion
          idProyecto={id}
          nombreProyecto={proyecto.nombreObra ?? 'Sin nombre'}
          yaFueCalificado={yaFueCalificado}
          onVotoExitoso={() => setYaFueCalificado(true)}
        />
      </div>
    </div>
  )
}
