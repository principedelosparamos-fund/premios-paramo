import { addDoc, collection, doc, updateDoc } from 'firebase/firestore'
import { useState } from 'react'
import { db } from '../../lib/firebase'
import { getUserInfoFromLocalStorage } from '../../lib/getUserRole'

interface FormularioVotacionProps {
  idProyecto: string
  nombreProyecto: string
  onVotoExitoso?: () => void;
  yaFueCalificado?: boolean;
}

const PREGUNTAS = [
  {
    titulo: 'Calidad del libreto y estructura narrativa',
    descripcion:
      'Se evalúa la solidez del texto, guión o libreto en su construcción dramática: desarrollo de personajes, coherencia interna, fluidez de la trama, originalidad del enfoque y profundidad temática. También se considera el uso del lenguaje, el ritmo de los diálogos y la capacidad del texto para sostener el relato desde la escritura.',
  },
  {
    titulo: 'Representación de la diversidad y/o biodiversidad de Colombia',
    descripcion:
      'Se evalúa cómo la obra reconoce, visibiliza y celebra la diversidad cultural, étnica, lingüística, de género, generacional o de capacidades, así como la biodiversidad de nuestros ecosistemas, especies y territorios. Se valora el respeto, la sensibilidad y el compromiso narrativo con la vida, en todas sus formas.',
  },
  {
    titulo: 'Calidad estética y de producción de la obra',
    descripcion:
      'Se evalúa la coherencia y el cuidado en la realización visual, sonora y escénica de la obra. Se valoran aspectos como la dirección de arte, la puesta en escena, la fotografía, el montaje, el diseño sonoro y demás elementos expresivos al servicio del relato.',
  },
]

const FormularioVotacion = ({
  idProyecto,
  nombreProyecto,
  onVotoExitoso,
  yaFueCalificado,
}: FormularioVotacionProps) => {
  const [success, setSuccess] = useState<string | null>(null);
  const [respuestas, setRespuestas] = useState<{ [key: string]: number }>({})
  const [promedio, setPromedio] = useState<number | null>(null)
  const [enviando, setEnviando] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (criterio: string, valor: number) => {
    const nuevasRespuestas = { ...respuestas, [criterio]: valor }
    setRespuestas(nuevasRespuestas)

    if (Object.keys(nuevasRespuestas).length === 3) {
      const suma = Object.values(nuevasRespuestas).reduce(
        (acc, val) => acc + val,
        0
      )
      const nuevoPromedio = parseFloat((suma / 3).toFixed(1))
      setPromedio(nuevoPromedio)
    }
  }

  const handleSubmit = async () => {
    const user = getUserInfoFromLocalStorage()
    if (!user) {
      setError('Usuario no autenticado')
      return
    }

    if (Object.keys(respuestas).length !== 3) {
      setError('Debes responder los 3 criterios antes de enviar.')
      return
    }

    setEnviando(true)
    setError(null)

    try {
      const now = new Date()
      const fechaVotacion = now
        .toLocaleString('es-CO', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })
        .replace(',', '')

      await addDoc(collection(db, 'votaciones'), {
        idProyecto,
        nombreProyecto,
        nombreJurado: user.nombre,
        emailJurado: user.email,
        fechaVotacion,
        respuestas,
        promedio,
      })
      if (onVotoExitoso) onVotoExitoso()
      // Limpia el formulario y muestra feedback local
      setRespuestas({})
      setPromedio(null)
      setError(null)
      setSuccess('¡Votación registrada!')

      const proyectoRef = doc(db, 'proyectos', idProyecto)
      await updateDoc(proyectoRef, { calificado: true })
    } catch (e) {
      console.error('Error guardando votación:', e)
      setError('Ocurrió un error guardando la votación.')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="rounded-lg bg-white p-4">
      <h2 className="mb-4 text-lg font-semibold">Califica este proyecto</h2>
      <p className="mb-4 text-sm text-gray-700 font-medium">Las calificaciones deben ser del <span className="font-bold">1</span> al <span className="font-bold">10</span>.</p>
      {yaFueCalificado ? (
        <div className="bg-ui-success rounded-lg p-4 text-white mb-4">
          ✅ ¡Este proyecto ya ha sido calificado!
        </div>
      ) : (
        <>
          <div className="space-y-6">
            {PREGUNTAS.map((pregunta, index) => {
              const criterio = `criterio${index + 1}`
              return (
                <div
                  key={criterio}
                  className="flex flex-col rounded-lg border bg-gray-50 p-4"
                >
                  <label className="text-gold-900 mb-1 text-base font-semibold">
                    {pregunta.titulo}
                  </label>
                  <span className="mb-2 text-sm text-gray-700">
                    {pregunta.descripcion}
                  </span>
                  <label
                    className="text-md mb-1 font-medium"
                    htmlFor={`input-${criterio}`}
                  >
                    Calificación
                  </label>
                  <input
                    id={`input-${criterio}`}
                    type="number"
                    min={1}
                    max={10}
                    step={1}
                    value={respuestas[criterio] || ''}
                    onChange={(e) => {
                      let valor = parseInt(e.target.value);
                      if (isNaN(valor)) valor = 1;
                      if (valor < 1) valor = 1;
                      if (valor > 10) valor = 10;
                      handleChange(criterio, valor);
                    }}
                    className="w-32 rounded-md border p-2"
                    placeholder="Calificación (1-10)"
                  />
                </div>
              )
            })}
          </div>

          {promedio !== null && (
            <p className="mt-4 font-semibold">Promedio: {promedio}</p>
          )}

          {error && <p className="mt-2 text-red-500">{error}</p>}
          {success && <p className="mt-2 text-green-600">{success}</p>}

          <button
            onClick={handleSubmit}
            disabled={enviando || Object.keys(respuestas).length !== 3}
            className="bg-golddark-600 hover:bg-golddark-700 mt-6 w-full rounded py-2 font-semibold text-white disabled:opacity-50"
          >
            {enviando ? 'Enviando...' : 'Enviar Votación'}
          </button>
        </>
      )}
    </div>
  )
}


export default FormularioVotacion
