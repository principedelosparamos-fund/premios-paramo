import { collection, getDocs, Timestamp } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { db } from '../../lib/firebase'

// Función para formatear fecha
const formatearFecha = (fecha: any) => {
  if (!fecha) return ''
  if (fecha instanceof Timestamp) {
    const date = fecha.toDate()
    const dia = String(date.getDate()).padStart(2, '0')
    const mes = String(date.getMonth() + 1).padStart(2, '0')
    const anio = date.getFullYear()
    return `${dia}/${mes}/${anio}`
  }
  if (typeof fecha === 'string') {
    if (!fecha.trim()) return ''
    const date = new Date(fecha)
    if (isNaN(date.getTime())) return fecha
    const dia = String(date.getDate()).padStart(2, '0')
    const mes = String(date.getMonth() + 1).padStart(2, '0')
    const anio = date.getFullYear()
    return `${dia}/${mes}/${anio}`
  }
  if (fecha instanceof Date) {
    const dia = String(fecha.getDate()).padStart(2, '0')
    const mes = String(fecha.getMonth() + 1).padStart(2, '0')
    const anio = fecha.getFullYear()
    return `${dia}/${mes}/${anio}`
  }
  return fecha
}

import * as XLSX from 'xlsx'

// Función para exportar a XLSX
const exportToXLSX = (data: any[], filename: string) => {
  if (!data || data.length === 0) return
  const ws = XLSX.utils.json_to_sheet(data)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Proyectos')
  XLSX.writeFile(wb, filename)
}

export default function ReportesProyectos() {
  const [proyectos, setProyectos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const cargarProyectos = async () => {
      const cache = localStorage.getItem('proyectos_cache')
      if (cache) {
        setProyectos(JSON.parse(cache))
        setLoading(false)
        return
      }

      try {
        const snap = await getDocs(collection(db, 'proyectos'))
        const lista = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        setProyectos(lista)
        localStorage.setItem('proyectos_cache', JSON.stringify(lista))
      } catch (err) {
        console.error('Error cargando proyectos:', err)
      } finally {
        setLoading(false)
      }
    }

    cargarProyectos()
  }, [])

  if (loading) return <p className="py-10 text-center">Cargando proyectos...</p>
  if (proyectos.length === 0)
    return <p className="py-10 text-center">No hay proyectos registrados.</p>

  return (
    <div className="container mx-auto max-w-6xl space-y-6 p-6">
      <h2 className="text-gold-600 text-center text-2xl font-bold">
        Reporte de Proyectos Registrados
      </h2>

      <button
        onClick={() => {
          const proyectosFormateados = proyectos.map((p) => {
            const copia: any = { ...p }
            // Formatear todas las fechas posibles
            Object.keys(copia).forEach((key) => {
              if (key.toLowerCase().includes('fecha')) {
                copia[key] = formatearFecha(copia[key])
              }
            })
            return copia
          })
          exportToXLSX(proyectosFormateados, 'proyectos_registrados.xlsx')
        }}
        className="bg-ui-success hover:bg-ui-success mx-auto block rounded px-4 py-2 font-semibold text-white"
      >
        Descargar Excel
      </button>

      <p className="mt-4 text-center text-sm text-gray-500">
        Datos cacheados en localStorage.
      </p>
    </div>
  )
}
