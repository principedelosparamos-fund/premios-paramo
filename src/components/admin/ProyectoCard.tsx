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
  calificado,
  nombreJurado,
  promedio,
}: ProyectoCardProps) {
  return (
    <div className="border p-4 rounded-xl bg-white shadow mb-4 flex flex-col">
      <div className="text-lg font-bold text-black">{nombre}</div>
      {nombrePostulante && (
        <div className="text-sm text-gray-500 italic">
          por {nombrePostulante}
        </div>
      )}
      <div className="text-sm text-gray-600">{categoria}</div>
      <div className="text-xs text-gray-400 mb-2">{fechaRegistro}</div>

      {/* 🔥 Estado de votación */}
      {calificado ? (
        <div className="text-green-600 text-sm mt-2">
          ✅ Calificado por {nombreJurado} - Promedio: {promedio}
        </div>
      ) : (
        <div className="text-red-600 text-sm mt-2">
          ⏳ Pendiente de calificación
        </div>
      )}

      <a
        href={`/admin/proyecto/${id}`}
        className="mt-4 font-semibold color-black-500 text-center py-2 px-4 bg-gold-500 text-white rounded hover:bg-gold-600 text-sm"
      >
        Ver Detalle
      </a>
    </div>
  )
}
