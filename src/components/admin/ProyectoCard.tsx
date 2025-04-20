interface ProyectoCardProps {
  nombre: string;
  categoria: string;
  fechaRegistro: string;
  id: string;
  nombrePostulante?: string;
}

export default function ProyectoCard({ nombre, categoria, fechaRegistro, id, nombrePostulante }: ProyectoCardProps) {
  return (
    <div className="border p-4 rounded-xl bg-white shadow mb-4 flex flex-col">
      <div className="text-lg font-bold text-black">{nombre}</div>
      {nombrePostulante && (
        <div className="text-sm text-gray-500 italic">por {nombrePostulante}</div>
      )}
      <div className="text-sm text-gray-600">{categoria}</div>
      <div className="text-xs text-gray-400 mb-2">{fechaRegistro}</div>
      <a
        href={`/admin/proyecto/${id}`}
        className="mt-auto text-center py-2 px-4 bg-gold-500 text-white rounded hover:bg-gold-600 text-sm"
      >
        Ver Detalle
      </a>
    </div>
  );
}
