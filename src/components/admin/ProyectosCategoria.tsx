import React from "react";

// Definición del tipo de los props
export interface ProyectosCategoriaProps {
  data: Array<{
    categoria: string;
    cantidad: number;
  }>;
}

const ProyectosCategoria: React.FC<ProyectosCategoriaProps> = ({ data }) => {
  return (
    <div className="max-w-md mx-auto">
      <h3 className="text-lg font-semibold mb-4">Proyectos postulados por categoría</h3>
      <table className="w-full border-collapse bg-white shadow rounded">
        <thead>
          <tr>
            <th className="border-b border-gray-300 text-left px-4 py-2">Categoría</th>
            <th className="border-b border-gray-300 text-left px-4 py-2">Cantidad</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, idx) => (
            <tr key={idx} className="hover:bg-gray-50">
              <td className="border-b border-gray-100 px-4 py-2">{item.categoria}</td>
              <td className="border-b border-gray-100 px-4 py-2">{item.cantidad}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProyectosCategoria;
