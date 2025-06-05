import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { db, auth } from '../../lib/firebase'
import FormularioVotacion from './FormularioVotacion.tsx'

// Helper: obtiene userInfo con UID desde localStorage o auth
function getJuradoInfo() {
  // Intenta reconstruir info de localStorage
  const email = localStorage.getItem('userEmail');
  const nombre = localStorage.getItem('userNombre');
  const role = localStorage.getItem('userRole');
  const uid = localStorage.getItem('userUid'); // <--- NUEVO
  if (email && nombre && role && uid) {
    return { email, nombre, role, uid };
  }
  // Si no, intenta con auth.currentUser
  const currentUser = auth.currentUser;
  if (currentUser) {
    return { email: currentUser.email, uid: currentUser.uid };
  }
  return null;
}

interface ProyectoDetalleJuradoProps {
  id: string;
  onVotacionRegistrada?: () => void;
}

export default function ProyectoDetalleJurado({ id, onVotacionRegistrada }: ProyectoDetalleJuradoProps) {
  const [proyecto, setProyecto] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [yaFueCalificado, setYaFueCalificado] = useState<boolean>(false)
  const [checkingVoto, setCheckingVoto] = useState(true)
  const [accesoPermitido, setAccesoPermitido] = useState<boolean>(false)
  const [juradoInfo, setJuradoInfo] = useState<any>(null)
  const [votacionJurado, setVotacionJurado] = useState<any>(null)

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
    async function checkAccesoYCargaVotacion() {
      setCheckingVoto(true)
      const user = getJuradoInfo()
      console.log('[DEBUG] Usuario obtenido por getJuradoInfo:', user)
      if (!user) {
        setAccesoPermitido(false)
        setCheckingVoto(false)
        console.log('[DEBUG] No hay usuario autenticado')
        return
      }
      setJuradoInfo(user)
      // Obtener categorías asignadas al jurado
      if (!user.uid) {
        console.warn('[DEBUG] El usuario no tiene UID. No se puede consultar jurado en Firestore. user:', user)
        setAccesoPermitido(false)
        setCheckingVoto(false)
        return
      }
      const juradoRef = doc(db, 'jurados', user.uid)
      const juradoSnap = await getDoc(juradoRef)
      let categoriasJurado: any = []
      let juradoData = null
      if (juradoSnap.exists()) {
        juradoData = juradoSnap.data()
        categoriasJurado = juradoData.categorias || []
      }
      // Debugging seguro para arrays
      const categoriasJuradoSafe = Array.isArray(categoriasJurado) ? categoriasJurado : [];
      console.log('[DEBUG] Datos del jurado:', juradoData)
      console.log('[DEBUG] Categorías del jurado (safe):', categoriasJuradoSafe)
      // Validar si el proyecto está en alguna categoría asignada
      let categoriasProyecto: any = []
      if (proyecto) {
        categoriasProyecto = Array.isArray(proyecto.categorias)
          ? proyecto.categorias
          : typeof proyecto.categorias === 'string'
          ? [proyecto.categorias]
          : []
      }
      const categoriasProyectoSafe = Array.isArray(categoriasProyecto) ? categoriasProyecto : [];
      console.log('[DEBUG] Datos del proyecto:', proyecto)
      console.log('[DEBUG] Categorías del proyecto (safe):', categoriasProyectoSafe)
      const acceso = categoriasProyectoSafe.some(cat => categoriasJuradoSafe.includes(cat))
      console.log('[DEBUG] ¿Acceso permitido?', acceso)
      setAccesoPermitido(acceso)
      // Buscar si ya existe votación de este jurado para este proyecto
      let votoExistente = null
      if (acceso) {
        const q = query(
          collection(db, 'votaciones'),
          where('idProyecto', '==', id),
          where('idJurado', '==', user.uid)
        )
        const querySnap = await getDocs(q)
        if (!querySnap.empty) {
          setYaFueCalificado(true)
          votoExistente = querySnap.docs[0].data()
          setVotacionJurado(votoExistente)
        } else {
          setYaFueCalificado(false)
          setVotacionJurado(null)
        }
      }
      setCheckingVoto(false)
    }
    if (id && proyecto) checkAccesoYCargaVotacion()
  }, [id, proyecto])

  if (loading || checkingVoto) return <div>Cargando...</div>
  if (!proyecto) return <div>Proyecto no encontrado.</div>
  if (!accesoPermitido) {
    return <div className="bg-red-100 text-red-700 p-4 rounded">No tienes acceso para calificar este proyecto (categoría no asignada).</div>
  }
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
          onVotoExitoso={() => {
            setYaFueCalificado(true);
            if (onVotacionRegistrada) onVotacionRegistrada();
          }}
          juradoInfo={juradoInfo}
          votacionJurado={votacionJurado}
        />
      </div>
    </div>
  )
}
