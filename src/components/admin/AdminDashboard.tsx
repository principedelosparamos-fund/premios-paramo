export const prerender = false
import { useEffect, useState } from 'react'
import { getAdminDashboardData } from '../../lib/getAdminDashboardData'
import ProyectoCard from './ProyectoCard'
import ProyectosCategoria from './ProyectosCategoria'

interface Proyecto {
  id: string
  nombre: string
  categoria?: string
  fechaRegistro: string
  nombrePostulante?: string
  calificado?: boolean // 🔥 añadir
  nombreJurado?: string | null // 🔥 añadir
  promedio?: number | null // 🔥 añadir (corregí tipo, no string)
}

// Añadir interfaz para props incluyendo las directivas de cliente de Astro
interface AdminDashboardProps {
  'client:load'?: boolean
  'client:only'?: string
}

export default function AdminDashboard(props: AdminDashboardProps) {
  const [data, setData] = useState<{
    proyectos: Proyecto[]
    juradosCount: number
    proyectosVotadosCount: number
  } | null>(null)

  const [lastUpdate, setLastUpdate] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData(forceRefresh = false) {
      const storedData = localStorage.getItem('adminDashboardData')
      const storedUpdate = localStorage.getItem('adminDashboardLastUpdate')

      if (storedData && storedUpdate && !forceRefresh) {
        const timePassed = Date.now() - parseInt(storedUpdate)
        const oneHour = 3600 * 1000 // 1 hora en milisegundos

        if (timePassed > oneHour) {
          console.log('Más de 1 hora, actualizando datos automáticamente...')
          await fetchData(true) // Forzar refresco
          return
        }

        setData(JSON.parse(storedData))
        setLastUpdate(new Date(parseInt(storedUpdate)).toLocaleString('es-CO'))
      } else {
        const result = await getAdminDashboardData()
        setData(result)
        const now = Date.now()
        localStorage.setItem('adminDashboardData', JSON.stringify(result))
        localStorage.setItem('adminDashboardLastUpdate', now.toString())
        setLastUpdate(new Date(now).toLocaleString('es-CO'))
      }
    }
    fetchData()
  }, [])

  const handleRefresh = () => {
    localStorage.removeItem('adminDashboardData')
    localStorage.removeItem('adminDashboardLastUpdate')
    window.location.reload()
  }

  if (!data) {
    return (
      <div className="flex h-40 items-center justify-center">
        <p className="text-gray-600">Cargando datos...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto space-y-6 p-4">
      {/* Encabezado */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="mb-2 text-2xl font-bold md:text-3xl">
            Dashboard Administrativo
          </h1>
          {lastUpdate && (
            <p className="text-md text-gray-500">
              Última actualización: {lastUpdate}
            </p>
          )}
        </div>

        <button
          onClick={handleRefresh}
          className="bg-golddark-400 hover:bg-golddark-500 rounded-lg px-4 py-2 text-white"
        >
          Actualizar Datos
        </button>
      </div>

      {/* Cards resumen */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="bg-goldlight-100 text-goldlight-900 flex flex-col items-center rounded-2xl p-6">
          <div className="text-3xl font-bold">{data.proyectos.length}</div>
          <div className="text-md">Proyectos Registrados</div>
        </div>
        <div className="bg-goldlight-100 text-goldlight-900 flex flex-col items-center rounded-2xl p-6">
          <div className="text-3xl font-bold">{data.juradosCount}</div>
          <div className="text-md">Jurados Registrados</div>
        </div>
        <div className="bg-goldlight-100 text-goldlight-900 flex flex-col items-center rounded-2xl p-6">
          <div className="text-3xl font-bold">{data.proyectosVotadosCount}</div>
          <div className="text-md">Proyectos Votados</div>
        </div>
      </div>

      {/* Botones de Reportes */}
      <div className="flex flex-col gap-4 md:flex-row">
        <a
          href="/reportes/proyectos"
          className="bg-goldlight-100 hover:bg-goldlight-300 text-goldlight-900 flex-1 rounded-xl py-3 text-center font-semibold"
        >
          📄 Reporte Proyectos
        </a>
        <a
          href="/reportes/calificaciones"
          className="bg-goldlight-100 hover:bg-goldlight-300 text-goldlight-900 flex-1 rounded-xl py-3 text-center font-semibold"
        >
          📊 Reporte Calificaciones
        </a>
        <a
          href="/admin/jurado"
          className="bg-goldlight-100 hover:bg-goldlight-300 text-goldlight-900 flex-1 rounded-xl py-3 text-center font-semibold"
        >
          📊 Registrar jurado
        </a>
        <a
          href="/admin/lista-jurados"
          className="bg-goldlight-100 hover:bg-goldlight-300 text-goldlight-900 flex-1 rounded-xl py-3 text-center font-semibold"
        >
          👌 Lista de jurados
        </a>
        <a
          href="/admin/resultados"
          target="_blank"
          className="bg-goldlight-100 hover:bg-goldlight-300 text-goldlight-900 flex-1 rounded-xl py-3 text-center font-semibold"
        >
          👁️ Resultados
        </a>
      </div>

      {/* Listado de Proyectos */}
      <div className="container mx-auto grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="col-span-2 mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2">
          {data.proyectos.map((proyecto) => (
            <ProyectoCard
              key={proyecto.id}
              id={proyecto.id}
              nombre={proyecto.nombre}
              categoria={proyecto.categoria || 'Sin Categoría'}
              fechaRegistro={proyecto.fechaRegistro}
              nombrePostulante={proyecto.nombrePostulante}
              calificado={proyecto.calificado} // 🔥 nuevo
              nombreJurado={proyecto.nombreJurado} // 🔥 nuevo
              promedio={proyecto.promedio} // 🔥 nuevo
            />
          ))}
        </div>
        <div className="rounded-2xl bg-gray-100 p-4 shadow">
          {/* Tabla de proyectos por categoría */}
          <div className="">
            <ProyectosCategoria
              data={Object.entries(
                data.proyectos.reduce(
                  (acc: Record<string, number>, proyecto) => {
                    const cat = proyecto.categoria || 'Sin Categoría'
                    acc[cat] = (acc[cat] || 0) + 1
                    return acc
                  },
                  {}
                )
              ).map(([categoria, cantidad]) => ({ categoria, cantidad }))}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
