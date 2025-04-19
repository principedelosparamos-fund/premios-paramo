import { useEffect, useState } from "react";

interface Props {
  id: string;
}

const ProyectoFicha = ({ id }: Props) => {
  const [proyecto, setProyecto] = useState<any>(null);

  useEffect(() => {
    const proyectosLocal = JSON.parse(localStorage.getItem('proyectos') || '[]');
    const encontrado = proyectosLocal.find((p: any) => p.id === id);

    if (encontrado) {
      setProyecto(encontrado);
    } else {
      console.error("Proyecto no encontrado en localStorage.");
    }
  }, [id]);

  if (!proyecto) {
    return <p className="text-center py-10">No se encontró el proyecto.</p>;
  }

  return (
    <main className="max-w-5xl mx-auto p-6 space-y-8">
      <section className="flex flex-col md:flex-row gap-6 items-start">
        <div className="w-full md:w-1/2 aspect-[4/3] overflow-hidden rounded bg-gray-200">
          <img
            src={proyecto.linkImagen || "https://placehold.co/400x300"}
            alt={`Imagen de ${proyecto.nombreObra}`}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>

        <div className="flex flex-col w-full md:w-1/2 space-y-4">
          <h1 className="text-3xl font-bold text-gold-600">{proyecto.nombreObra}</h1>
          <p className="text-sm text-gray-700">Postulado por: {proyecto.nombrePostulante}</p>

          {proyecto.categorias && (
            <p className="text-sm text-gray-600">
              Categorías: {Array.isArray(proyecto.categorias) ? proyecto.categorias.join(", ") : proyecto.categorias}
            </p>
          )}

          {proyecto.fechaEstreno && (
            <p className="text-sm text-gray-600">Fecha de estreno: {proyecto.fechaEstreno}</p>
          )}

          <div className="flex gap-4 mt-4">
            {proyecto.linkVideo && (
              <a
                href={proyecto.linkVideo}
                target="_blank"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              >
                Ver Video
              </a>
            )}

            {proyecto.linkLibreto && (
              <a
                href={proyecto.linkLibreto}
                target="_blank"
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
              >
                Ver Libreto
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Sinopsis completa */}
      {proyecto.sinopsis && (
        <section>
          <h2 className="text-2xl font-semibold text-gold-600 mb-2">Sinopsis</h2>
          <p className="text-gray-700 whitespace-pre-line">{proyecto.sinopsis}</p>
        </section>
      )}
    </main>
  );
};

export default ProyectoFicha;
