interface ProyectoCardProps {
  nombre: string
  categoria: string
  fechaRegistro: string
  id: string
  nombrePostulante?: string
  calificado?: boolean
  nombreJurado?: string | null
  promedio?: number | null // 🔥 corregido
}

export default function ProyectoCard({
  nombre,
  categoria,
  fechaRegistro,
  id,
  nombrePostulante,
  nombreJurado,
  promedio,
}: ProyectoCardProps) {
  return (
    <div className="mb-4 flex flex-col rounded-xl border bg-white p-4 shadow">
      <div className="text-lg font-bold text-black">{nombre}</div>
      {nombrePostulante && (
        <div className="text-sm text-gray-500 italic">
          por {nombrePostulante}
        </div>
      )}
      <div className="text-sm text-gray-600">{categoria}</div>
      <div className="mb-2 text-xs text-gray-400">{fechaRegistro}</div>



      <a
        href={`/admin/proyecto/${id}`}
        className="color-black-500 bg-golddark-500 hover:bg-golddark-600 mt-4 rounded px-4 py-2 text-center text-sm font-semibold text-white"
      >
        Ver Detalle
      </a>
    </div>
  )
}
