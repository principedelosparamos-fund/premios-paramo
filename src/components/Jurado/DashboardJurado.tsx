import { onAuthStateChanged } from 'firebase/auth'
import { collection, doc, getDoc, getDocs } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { auth, db } from '../../lib/firebase'
import { getUserInfoFromLocalStorage } from '../../lib/getUserRole'
import ProyectoCard from './ProyectoCard'

interface Proyecto {
  id: string
  nombre: string
  nombrePostulante?: string
  categorias: string[]
  promedioGeneral?: number
  calificado?: boolean // 🔥 ahora trae el campo de firestore
}

const LOCAL_STORAGE_PROYECTOS = 'proyectosJurado'
const LOCAL_STORAGE_VOTACIONES = 'votacionesJurado'

const DashboardJurado = () => {
  const [proyectoSeleccionado, setProyectoSeleccionado] = useState<string | null>(null);
  const [proyectos, setProyectos] = useState<Proyecto[]>([])
  const [votaciones, setVotaciones] = useState<Record<string, number>>({})
  const [categoriasAsignadas, setCategoriasAsignadas] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  const cargarDatos = async (forzarActualizacion = false) => {
    setLoading(true)

    const user = auth.currentUser
    if (!user) {
      console.error('[ERROR] Usuario no autenticado.')
      setLoading(false)
      return
    }

    console.log('[DEBUG] Usuario autenticado:', user.uid)

    try {
      const userInfo = getUserInfoFromLocalStorage()
      const nombre = userInfo?.nombre || ''

      const juradoRef = doc(db, 'jurados', user.uid)
      const juradoSnap = await getDoc(juradoRef)

      let categorias: string[] = []

      if (juradoSnap.exists()) {
        const juradoData = juradoSnap.data()
        categorias = juradoData.categorias || []
        console.log('[DEBUG] Categorías asignadas al jurado:', categorias)
      } else {
        console.warn('[WARN] Documento de jurado no encontrado.')
      }

      setCategoriasAsignadas(categorias)

      // 🔥 Intenta cargar de localStorage si no forzamos actualización
      const proyectosLocal = localStorage.getItem(LOCAL_STORAGE_PROYECTOS)
      const votacionesLocal = localStorage.getItem(LOCAL_STORAGE_VOTACIONES)

      if (proyectosLocal && votacionesLocal && !forzarActualizacion) {
        console.log('[CACHE] Usando proyectos y votaciones del localStorage')
        setProyectos(JSON.parse(proyectosLocal))
        setVotaciones(JSON.parse(votacionesLocal))
        setLoading(false)
        return
      }

      // 🔥 Si no hay en localStorage o se fuerza actualización
      const [proyectosSnap, votacionesSnap] = await Promise.all([
        getDocs(collection(db, 'proyectos')),
        getDocs(collection(db, 'votaciones')),
      ])

      const proyectosList: Proyecto[] = []
      proyectosSnap.forEach((doc) => {
        const data = doc.data()
        if (data.nombreObra) {
          proyectosList.push({
            id: doc.id,
            nombre: data.nombreObra,
            nombrePostulante: data.nombrePostulante || 'Sin nombre',
            categorias: Array.isArray(data.categorias)
              ? data.categorias
              : typeof data.categorias === 'string'
                ? [data.categorias]
                : [],
          })
        }
      })

      console.log(
        '[DEBUG] Proyectos disponibles en la base de datos:',
        proyectosList
      )

      const proyectosFiltrados = proyectosList.filter((proyecto) =>
        proyecto.categorias.some((cat) => categorias.includes(cat))
      )

      console.log(
        '[DEBUG] Proyectos filtrados por categoría:',
        proyectosFiltrados
      )
      const votos: Record<string, number> = {}
      votacionesSnap.forEach((doc) => {
        const data = doc.data()
        // Filtrar por UID del jurado autenticado
        if (data.idJurado === user.uid) {
          votos[data.idProyecto] = data.promedio
        }
      })

      // 🔥 Actualizar proyectos para marcar cuáles están votados
      const proyectosActualizados = proyectosFiltrados.map((proyecto) => ({
        ...proyecto,
        calificado: !!votos[proyecto.id], // si existe un voto para ese proyecto, está calificado
      }))

      console.log('[DEBUG] Votaciones del jurado:', votos)
      console.log(
        '[DEBUG] Proyectos actualizados con estado de votación:',
        proyectosActualizados
      )

      setProyectos(proyectosActualizados)
      setVotaciones(votos)

      // 🔥 Guardar en localStorage
      localStorage.setItem(
        LOCAL_STORAGE_PROYECTOS,
        JSON.stringify(proyectosActualizados)
      )
      localStorage.setItem(LOCAL_STORAGE_VOTACIONES, JSON.stringify(votos))
    } catch (error) {
      console.error('[ERROR] Error cargando datos de jurado:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        cargarDatos()
      } else {
        setLoading(false)
      }
    })

    return () => unsubscribe()
  }, [])

  const actualizarManualmente = () => {
    console.log('[DEBUG] Actualización manual solicitada')
    cargarDatos(true) // 🔥 Forzar nueva carga desde Firestore
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <span className="text-gray-600">Cargando proyectos...</span>
      </div>
    )
  }

  if (proyectos.length === 0) {
    return (
      <div className="flex h-64 flex-col items-center justify-center p-4 text-center">
        <p className="mb-2 text-lg font-semibold text-gray-700">
          No tienes proyectos asignados todavía
        </p>
        <button
          onClick={actualizarManualmente}
          className="bg-golddark-400 mt-4 rounded-lg px-4 py-2 text-white"
        >
          Actualizar
        </button>
      </div>
    )
  }

  // Nueva función: refresca los datos tras votar
  const handleVotoExitoso = () => {
    cargarDatos(true);
  };

  return (
    <div className="p-4">
      <div className="mb-4 flex justify-end">
        <button
          onClick={actualizarManualmente}
          className="bg-golddark-400 rounded-lg px-4 py-2 text-white"
        >
          Actualizar proyectos
        </button>
      </div>
      {/* Aquí deberías pasar handleVotoExitoso al detalle, por ejemplo si usas un modal o ruta SPA */}
      <div className="grid grid-cols-3 gap-6">
        {proyectos.map((proyecto) => (
          <ProyectoCard
            key={proyecto.id}
            proyecto={{
              id: proyecto.id,
              nombre: proyecto.nombre,
              nombrePostulante: proyecto.nombrePostulante,
              categorias: proyecto.categorias,
              promedioGeneral: proyecto.promedioGeneral,
            }}
            votado={proyecto.calificado}
            promedioVotacionJurado={votaciones[proyecto.id]}
            modo="jurado"
            // Si tu navegación es tipo modal o SPA, aquí deberías pasar:
            // onVotacionRegistrada={handleVotoExitoso}
          />
        ))}
      </div>
    </div>
  )
}

export default DashboardJurado
