import { collection, getDocs } from 'firebase/firestore'
import { db } from './firebase'

export async function getAdminDashboardData() {
  const proyectosSnapshot = await getDocs(collection(db, 'proyectos'))
  const juradosSnapshot = await getDocs(collection(db, 'jurados'))
  const votacionesSnapshot = await getDocs(collection(db, 'votaciones'))

  const proyectos = proyectosSnapshot.docs.map((doc) => {
    const data = doc.data()
    return {
      id: doc.id,
      nombre: data.nombreObra, // 🔥 corregido aquí
      categoria:
        Array.isArray(data.categorias) && data.categorias.length > 0
          ? data.categorias[0]
          : 'Sin categoría',
      fechaRegistro: data.fechaRegistro,
      nombrePostulante: data.nombrePostulante,
    }
  })

  // 🔥 Hacer un mapa de votaciones por proyectoId
  const votaciones = votacionesSnapshot.docs.map((doc) => doc.data())
  const votacionesMap = new Map()
  votaciones.forEach((votacion) => {
    votacionesMap.set(votacion.idProyecto, {
      nombreJurado: votacion.nombreJurado,
      promedio: votacion.promedio,
    })
  })

  // 🔥 Enriquecer cada proyecto
  const proyectosConEstado = proyectos.map((proyecto) => {
    const votacion = votacionesMap.get(proyecto.id)
    return {
      ...proyecto,
      nombreJurado: votacion?.nombreJurado || null,
      promedio: votacion ? Number(votacion.promedio) : null,
    }
  })

  return {
    proyectos: proyectosConEstado,
    juradosCount: juradosSnapshot.size,
    proyectosVotadosCount: votacionesSnapshot.size,
  }
}
