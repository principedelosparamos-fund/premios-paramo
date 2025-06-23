import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebase';

// Interface for a single vote
export interface Vote {
  id: string;
  emailJurado: string;
  fechaVotacion: string;
  idJurado: string;
  idProyecto: string;
  nombreJurado: string;
  nombreProyecto: string;
  promedio: number;
  respuestas: {
    criterio1: number;
    criterio2: number;
    criterio3: number;
  };
}

// Interface for the result of a single juror's vote on a project
export interface JurorVoteResult {
  nombreJurado: string;
  emailJurado: string;
  promedio: number;
  fechaVotacion: string;
}

// Interface for the consolidated results of a project
export interface ProjectResult {
  idProyecto: string;
  nombreProyecto: string;
  categorias: string[]; // Añadido para incluir las categorías del proyecto
  votos: JurorVoteResult[];
  promedioGeneral: number;
}

export async function getVotingResults(): Promise<ProjectResult[]> {
  // 1. Obtener todas las votaciones
  const votacionesCol = collection(db, 'votaciones');
  const votacionesSnapshot = await getDocs(votacionesCol);
  const votaciones = votacionesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Vote));

  // 2. Obtener todos los proyectos para mapear IDs a categorías
  const proyectosCol = collection(db, 'proyectos');
  const proyectosSnapshot = await getDocs(proyectosCol);
  const proyectosMap = new Map<string, string[]>();
  proyectosSnapshot.forEach(doc => {
    proyectosMap.set(doc.id, doc.data().categorias || []);
  });

  // 3. Agrupar votaciones por proyecto
  const votesByProject: { [key: string]: Vote[] } = {};
  for (const vote of votaciones) {
    if (!votesByProject[vote.idProyecto]) {
      votesByProject[vote.idProyecto] = [];
    }
    votesByProject[vote.idProyecto].push(vote);
  }

  // 4. Procesar resultados para cada proyecto
  const results: ProjectResult[] = [];
  for (const idProyecto in votesByProject) {
    const projectVotes = votesByProject[idProyecto];
    const nombreProyecto = projectVotes[0]?.nombreProyecto || 'Nombre no encontrado';
    const categorias = proyectosMap.get(idProyecto) || []; // Obtener categorías del mapa

    const jurorVotes: JurorVoteResult[] = projectVotes.map(vote => ({
      nombreJurado: vote.nombreJurado,
      emailJurado: vote.emailJurado,
      promedio: vote.promedio,
      fechaVotacion: vote.fechaVotacion,
    }));

    const totalPromedio = jurorVotes.reduce((sum, vote) => sum + vote.promedio, 0);
    const promedioGeneral = jurorVotes.length > 0 ? totalPromedio / jurorVotes.length : 0;

    results.push({
      idProyecto,
      nombreProyecto,
      categorias, // Añadir categorías al resultado
      votos: jurorVotes,
      promedioGeneral,
    });
  }

  return results;
}