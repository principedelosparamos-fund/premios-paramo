interface ProyectoCardProps {
  proyecto: {
    id: string;
    nombre: string;
    categorias: string[];
    promedioGeneral?: number; // para Admin
  };
  // Opcionales, para Jurado
  votado?: boolean;
  promedioVotacionJurado?: number;
  modo?: "admin" | "jurado"; // nuevo
}

const ProyectoCard = ({
  proyecto,
  votado,
  promedioVotacionJurado,
  modo = "jurado", // por defecto "jurado"
}: ProyectoCardProps) => {
  return (
    <div className="border border-gray-300 rounded-xl p-4 shadow-md bg-white">
      <h2 className="text-lg font-bold mb-2">{proyecto.nombre}</h2>

      <p className="text-sm text-gray-600 mb-2">
        Categorías: {proyecto.categorias.join(", ")}
      </p>

      {modo === "admin" && (
        <div className="text-blue-600 font-semibold mb-2">
          Promedio General: {proyecto.promedioGeneral ? proyecto.promedioGeneral.toFixed(1) : "N/A"}
        </div>
      )}

      {modo === "jurado" && (
        <>
          {votado ? (
            <div className="text-green-600 font-semibold mb-2">
              ✅ Ya calificado - Tu Promedio: {promedioVotacionJurado?.toFixed(1)}
            </div>
          ) : (
            <div className="text-yellow-600 font-semibold mb-2">
              ⚡ Sin calificar
            </div>
          )}
        </>
      )}

      {/* Botón dinámico */}
      <a
        href={modo === "admin" ? `/admin/proyecto/${proyecto.id}` : `/jurado/${proyecto.id}`}
        className="mt-4 inline-block bg-gold-600 text-white text-center px-4 py-2 rounded-lg w-full"
      >
        Ver Proyecto
      </a>
    </div>
  );
};

export default ProyectoCard;
