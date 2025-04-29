interface ProyectoCardProps {
  proyecto: {
    id: string
    nombre: string
    categorias: string[]
    promedioGeneral?: number // para Admin
  }
  // Opcionales, para Jurado
  votado?: boolean
  promedioVotacionJurado?: number
  modo?: 'admin' | 'jurado' // nuevo
}

const ProyectoCard = ({
  proyecto,
  votado,
  promedioVotacionJurado,
  modo = 'jurado', // por defecto "jurado"
}: ProyectoCardProps) => {
  return (
    <div className="rounded-xl border border-gray-300 bg-white p-4 shadow-md">
      <h2 className="mb-2 text-lg font-bold">{proyecto.nombre}</h2>

      <p className="mb-2 text-sm text-gray-600">
        Categoría: {proyecto.categorias.join(', ')}
      </p>

      {modo === 'admin' && (
        <div className="mb-2 font-semibold text-blue-600">
          Promedio General:{' '}
          {proyecto.promedioGeneral
            ? proyecto.promedioGeneral.toFixed(1)
            : 'N/A'}
        </div>
      )}

      {modo === 'jurado' && (
        <>
          {votado ? (
            <div className="mb-2 font-semibold text-green-600">
              ✅ Ya calificado - Puntuación total:{' '}
              {promedioVotacionJurado?.toFixed(1)}
            </div>
          ) : (
            <div className="mb-2 font-semibold text-yellow-800">
              ⚡ Sin calificar
            </div>
          )}
        </>
      )}

      {/* Botón dinámico */}
      <a
        href={
          modo === 'admin'
            ? `/admin/proyecto/${proyecto.id}`
            : `/jurado/${proyecto.id}`
        }
        className="bg-gold-600 mt-4 inline-block w-full rounded-lg px-4 py-2 text-center text-white"
      >
        Ver Proyecto
      </a>
    </div>
  )
}

export default ProyectoCard
