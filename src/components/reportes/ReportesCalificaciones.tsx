import { useEffect, useState } from 'react'
import { collection, getDocs, Timestamp } from 'firebase/firestore'
import { db } from '../../lib/firebase'

// Formatear fecha y hora (día/mes/año hora:minutos)
const formatearFechaHora = (fecha: any) => {
  if (fecha instanceof Timestamp) {
    const date = fecha.toDate()
    const dia = String(date.getDate()).padStart(2, '0')
    const mes = String(date.getMonth() + 1).padStart(2, '0')
    const anio = date.getFullYear()
    const horas = String(date.getHours()).padStart(2, '0')
    const minutos = String(date.getMinutes()).padStart(2, '0')
    return `${dia}/${mes}/${anio} ${horas}:${minutos}`
  }
  if (typeof fecha === 'string') {
    const date = new Date(fecha)
    const dia = String(date.getDate()).padStart(2, '0')
    const mes = String(date.getMonth() + 1).padStart(2, '0')
    const anio = date.getFullYear()
    const horas = String(date.getHours()).padStart(2, '0')
    const minutos = String(date.getMinutes()).padStart(2, '0')
    return `${dia}/${mes}/${anio} ${horas}:${minutos}`
  }
  return fecha
}

// Exportar CSV
const exportToCSV = (data: any[], filename: string) => {
  const csvRows = []

  const headers = [
    'Fecha y hora de actualización',
    'Nombre Jurado',
    'Correo Jurado',
    'Nombre Proyecto',
    'ID Proyecto',
    'Pregunta 1',
    'Pregunta 2',
    'Pregunta 3',
    'Pregunta 4',
    'Pregunta 5',
    'Pregunta 6',
    'Pregunta 7',
    'Pregunta 8',
    'Pregunta 9',
    'Pregunta 10',
    'Promedio',
  ]
  csvRows.push(headers.join(','))

  for (const item of data) {
    const respuestas = item.respuestas || []
    const row = [
      item.fecha,
      item.nombreJurado,
      item.juradoEmail,
      item.nombreProyecto,
      item.proyectoId,
      respuestas[0] ?? '',
      respuestas[1] ?? '',
      respuestas[2] ?? '',
      respuestas[3] ?? '',
      respuestas[4] ?? '',
      respuestas[5] ?? '',
      respuestas[6] ?? '',
      respuestas[7] ?? '',
      respuestas[8] ?? '',
      respuestas[9] ?? '',
      item.promedio ?? '',
    ]
    const values = row.map((value) => `"${String(value).replace(/"/g, '\\"')}"`)
    csvRows.push(values.join(','))
  }

  const csvContent = csvRows.join('\n')
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
}

export default function ReportesCalificaciones() {
  const [votaciones, setVotaciones] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const cargarVotaciones = async () => {
      const cache = localStorage.getItem('votaciones_cache')
      if (cache) {
        setVotaciones(JSON.parse(cache))
        setLoading(false)
        return
      }

      try {
        const snap = await getDocs(collection(db, 'votaciones'))
        const lista = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        setVotaciones(lista)
        localStorage.setItem('votaciones_cache', JSON.stringify(lista))
      } catch (err) {
        console.error('Error cargando votaciones:', err)
      } finally {
        setLoading(false)
      }
    }

    cargarVotaciones()
  }, [])

  if (loading)
    return <p className="text-center py-10">Cargando calificaciones...</p>
  if (votaciones.length === 0)
    return (
      <p className="text-center py-10">No hay calificaciones registradas.</p>
    )

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gold-600 text-center">
        Reporte de Calificaciones de Jurados
      </h2>

      <button
        onClick={() => {
          const votacionesFormateadas = votaciones.map((v) => ({
            ...v,
            fecha: formatearFechaHora(v.fecha),
          }))
          exportToCSV(votacionesFormateadas, 'calificaciones_jurados.csv')
        }}
        className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded mx-auto block"
      >
        Descargar CSV
      </button>

      <p className="text-center text-gray-500 mt-4 text-sm">
        Datos cacheados en localStorage.
      </p>
    </div>
  )
}
