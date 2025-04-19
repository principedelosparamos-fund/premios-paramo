interface ProyectoCardProps {
    proyecto: any;
    calificacion?: {
      promedio: number;
      fecha: Date | null;
    };
    rol: string;
  }

  const ProyectoCard = ({ proyecto, calificacion, rol }: ProyectoCardProps) => {
    return (
      <li className="bg-white p-4 rounded shadow flex flex-col items-start relative">

        {/* Estado (solo jurados) */}
        {rol !== "admin" && (
          <span className={`absolute top-4 left-4 px-2 py-1 text-xs rounded font-bold ${
            calificacion ? 'bg-green-500 text-white' : 'bg-yellow-400 text-black'
          }`}>
            {calificacion ? 'Calificado ✅' : 'Pendiente ⏳'}
          </span>
        )}

        {/* Imagen */}
        <div className="w-full aspect-[4/3] overflow-hidden rounded mb-4 bg-gray-200">
          <img
            src={proyecto.linkImagen || "https://placehold.co/400x300"}
            alt={`Imagen de ${proyecto.nombreObra}`}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>

        {/* Info principal */}
        <h2 className="font-bold text-lg mb-2">{proyecto.nombreObra}</h2>
        <p className="text-sm text-gray-700 mb-2">Postulado por: {proyecto.nombrePostulante}</p>

        {proyecto.categorias && (
          <p className="text-xs text-gray-500 mb-2">
            Categorías: {Array.isArray(proyecto.categorias) ? proyecto.categorias.join(", ") : proyecto.categorias}
          </p>
        )}

        {/* Datos de calificación */}
        {rol !== "admin" && calificacion && (
          <div className="text-xs text-gray-600 mt-2">
            <p>Promedio: <span className="font-bold">{calificacion.promedio}</span></p>
            {calificacion.fecha && (
              <p>Calificado el {calificacion.fecha.toLocaleDateString()}
              </p>
            )}
          </div>
        )}

        {/* Botón de detalle */}
        <a
          href={`/jurado/${proyecto.id}`}
          className="mt-4 bg-gold-600 text-black font-semibold px-4 py-2 rounded hover:bg-gold-700 transition w-full text-center"
        >
          Ver Detalle
        </a>
      </li>
    );
  };

  export default ProyectoCard;
