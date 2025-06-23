import React, { useState, useEffect } from 'react';
import { getVotingResults, type ProjectResult, type JurorVoteResult } from '../../lib/getVotingResults';

const ResultadosCliente: React.FC = () => {
  const [results, setResults] = useState<ProjectResult[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        const data = await getVotingResults();
        setResults(data);
        setError(null);
      } catch (e) {
        console.error("Error al cargar los resultados desde el cliente:", e);
        setError('No se pudieron cargar los resultados. Es posible que no tengas los permisos necesarios o haya un problema con la conexión.');
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  if (loading) {
    return <p className="text-center text-gray-500">Cargando resultados...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500 bg-red-100 p-4 rounded-lg">{error}</p>;
  }

  if (results.length === 0) {
    return <p className="text-center text-gray-500">No hay resultados de votación para mostrar.</p>;
  }

  return (
    <div className="space-y-12">
      {results.map((project) => (
        <div key={project.idProyecto} className="project-card bg-white shadow-lg rounded-lg p-6 border border-gray-200">
          <h2 className="text-2xl font-semibold mb-2">{project.nombreProyecto}</h2>
          <div className="flex items-center gap-2 mb-2">
            {project.categorias.map((cat: string) => (
              <span key={cat} className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">{cat}</span>
            ))}
          </div>
          <p className="text-lg font-bold text-blue-600 mb-4">Promedio General: {project.promedioGeneral.toFixed(2)}</p>
          
          <h3 className="text-xl font-semibold mb-3">Votos de los Jurados:</h3>
          <ul className="divide-y divide-gray-200">
            {project.votos.map((vote: JurorVoteResult, index: number) => (
              <li key={`${vote.nombreJurado}-${index}`} className="py-3 flex justify-between items-center">
                <div>
                  <p className="font-medium">{vote.nombreJurado}</p>
                  <p className="text-xs text-gray-400 mt-1">Votó el: {new Date(vote.fechaVotacion).toLocaleDateString()}</p>
                </div>
                <p className="text-lg font-semibold">{vote.promedio.toFixed(2)}</p>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default ResultadosCliente;
