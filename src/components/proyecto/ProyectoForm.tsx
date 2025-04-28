import { useState } from 'react'
import { db } from '../../lib/firebase'
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  Timestamp,
} from 'firebase/firestore'
import { CATEGORIES } from '../../lib/categories'

// 🔥 Función para formatear fecha tipo "31/03/2025 19:00"
const formatearFecha = (fechaInput: string) => {
  const fecha = new Date(fechaInput)
  const dia = fecha.getDate().toString().padStart(2, '0')
  const mes = (fecha.getMonth() + 1).toString().padStart(2, '0')
  const año = fecha.getFullYear()
  const horas = fecha.getHours().toString().padStart(2, '0')
  const minutos = fecha.getMinutes().toString().padStart(2, '0')
  return `${dia}/${mes}/${año} ${horas}:${minutos}`
}

export default function ProyectoForm() {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const form = e.target as HTMLFormElement
    const data = new FormData(form)
    const datos = Object.fromEntries(data.entries())

    if (
      !data.get('aceptaReglamento') ||
      !data.get('contactoAutorizado') ||
      !data.get('garantiaVeracidad')
    ) {
      setError('⚠️ Debes aceptar todos los términos antes de enviar.')
      setLoading(false)
      return
    }

    try {
      const correo = datos.email?.toString().toLowerCase().trim()
      const celular = datos.celular?.toString().trim()

      // 🔍 Validar que no exista ya una obra con ese correo y celular
      const proyectosRef = collection(db, 'proyectos')
      const q = query(
        proyectosRef,
        where('email', '==', correo),
        where('celular', '==', celular)
      )
      const querySnapshot = await getDocs(q)

      if (!querySnapshot.empty) {
        setError('⚠️ Ya existe una postulación con este correo y celular.')
        setLoading(false)
        return
      }

      const fechaRegistro = new Date().toLocaleString('es-CO', {
        hour12: false,
      })

      // 🔥 Agregar proyecto con ID automático
      // Ajuste: guardar la categoría seleccionada como array
      const { categoria, ...restDatos } = datos
      await addDoc(proyectosRef, {
        ...restDatos,
        email: correo, // Guardamos email limpio
        celular: celular, // Guardamos celular limpio
        categorias: categoria ? [categoria] : [],
        fechaEstreno: formatearFecha(datos.fechaEstreno.toString()),
        fechaRegistro,
        timestamp: Timestamp.now(),
        calificado: false,
      })

      window.location.href = '/proyecto-gracias'
    } catch (err) {
      console.error(err)
      setError('❌ No se pudo registrar la obra. Intenta nuevamente.')
      setLoading(false)
    }
  }

  return (
    <div className="bg-white mx-auto max-w-2xl p-2 py-8 lg:p-8 shadow-lg rounded-xl">
      <form onSubmit={handleSubmit} className="space-y-8 mx-auto p-6">
        {/* 📝 Instrucciones de postulación */}
        <section className="space-y-4 leading-[1.8]">
          <h1 className="font-semibold text-xl">
            Formulario de postulación proyecto
          </h1>
          <p>
            Si usted está aquí es porque quiere postular una obra a los Premios
            Príncipe de los Páramos 2025, ha leído el reglamento y está de
            acuerdo con su contenido.
          </p>
          <p>
            Si no ha leído el reglamento, puede visualizarlo{' '}
            <a
              href="/pdf/reglamento.pdf"
              className="text-blue-600 underline"
              target="_blank"
            >
              aquí
            </a>
            .
          </p>
          <p>
            Ahora que está de acuerdo con las reglas y condiciones para postular
            una obra, por favor diligencie los siguientes datos. Todos los
            campos son obligatorios.
          </p>
        </section>

        {error && <p className="text-red-600">{error}</p>}
        {loading && <p className="text-blue-600">Enviando...</p>}

        {/* 🧍 Datos del postulante */}
        <fieldset className="space-y-4">
          <legend className="font-semibold text-lg text-gold-900">
            Datos del postulante
          </legend>

          <label className="block">
            Nombre y apellido de quien postula:
            <input
              name="nombrePostulante"
              required
              className="w-full p-2 border rounded"
            />
          </label>

          <label className="block">
            Perfil del postulante:
            <select
              name="perfil"
              required
              className="w-full p-2 border rounded"
            >
              <option value="">Seleccione una opción</option>
              <option value="autor">Autor(a) de la obra</option>
              <option value="productor">Productor(a) de la obra</option>
              <option value="ejecutivo">
                Ejecutivo(a) del medio donde se estrenó la obra
              </option>
            </select>
          </label>

          <label className="block">
            Correo electrónico:
            <input
              type="email"
              name="email"
              required
              className="w-full p-2 border rounded"
            />
          </label>

          <label className="block">
            Celular:
            <input
              type="tel"
              name="celular"
              required
              className="w-full p-2 border rounded"
            />
          </label>
        </fieldset>

        {/* 🎬 Información de la obra */}
        <fieldset className="space-y-4">
          <legend className="font-semibold text-lg text-gold-900">
            Información de la obra
          </legend>

          <label className="block">
            Nombre de la obra:
            <input
              name="nombreObra"
              required
              className="w-full p-2 border rounded"
            />
            <small className="text-gray-600 block">
              Si se trata de una temporada en especial, se debe mencionar.
            </small>
          </label>

          <label className="block">
            Nombre del escritor(a) o escritores de la obra:
            <input
              name="escritores"
              required
              className="w-full p-2 border rounded"
            />
            <small className="text-gray-600 block">
              Esta información debe coincidir con los créditos de la obra.
            </small>
          </label>

          <label className="block">
            Fecha de estreno de la obra:
            <input
              type="date"
              name="fechaEstreno"
              required
              className="w-full p-2 border rounded"
            />
          </label>

          <label className="block">
            Sinopsis de la obra:
            <textarea
              name="sinopsis"
              rows={4}
              required
              className="w-full p-2 border rounded resize-y"
            />
          </label>
        </fieldset>

        {/* 🔗 Enlaces */}
        <fieldset className="space-y-4">
          <legend className="font-semibold text-lg text-gold-900">
            Enlaces de postulación
          </legend>

          <label className="block">
            Imagen oficial:
            <input
              type="url"
              name="linkImagen"
              required
              className="w-full p-2 border rounded mt-2"
            />
            <small className="text-gray-600 block">
              Link a imagen cuadrada en Drive sin solicitud de acceso.
            </small>
          </label>

          <label className="block">
            Libreto oficial:
            <input
              type="url"
              name="linkLibreto"
              required
              className="w-full p-2 border rounded mt-2"
            />
            <small className="text-gray-600 block">
              Debe coincidir con el capítulo que se envía.
            </small>
          </label>

          <label className="block">
            Obra audiovisual o tráiler:
            <input
              type="url"
              name="linkVideo"
              required
              className="w-full p-2 border rounded mt-2"
            />
            <small className="text-gray-600 block">
              Puede ser link de Drive (sin solicitud), Vimeo, YouTube,
              plataforma gratuita o de pago. No obligatorio para teatro, circo o
              videojuego.
            </small>
          </label>
        </fieldset>

        {/* 🏆 Categorías */}
        <fieldset className="space-y-2">
          <legend className="font-semibold text-lg text-gold-900">
            Categoría de postulación
          </legend>
          {CATEGORIES.map((categoria) => (
            <label key={categoria} className="block">
              <input
                type="radio"
                name="categoria"
                value={categoria}
                className="mr-2"
                required
              />
              {categoria}
            </label>
          ))}
        </fieldset>

        {/* ✅ Consentimientos */}
        <fieldset className="space-y-2">
          <legend className="font-semibold text-lg text-gold-900">
            Consentimientos
          </legend>

          <label className="block">
            <input
              type="checkbox"
              name="aceptaReglamento"
              required
              className="mr-2"
            />
            He leído el reglamento y estoy de acuerdo con su contenido.
          </label>
          <label className="block">
            <input
              type="checkbox"
              name="contactoAutorizado"
              required
              className="mr-2"
            />
            La organización puede usar mis datos para contactarme.
          </label>
          <label className="block">
            <input
              type="checkbox"
              name="garantiaVeracidad"
              required
              className="mr-2"
            />
            Garantizo que la información es veraz y tengo facultad para postular
            esta obra.
          </label>
        </fieldset>

        {/* Botones */}
        <div className="flex justify-end gap-4">
          <button
            type="reset"
            className="border px-4 py-2 rounded text-gray-700"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="bg-gold-600 text-black font-semibold px-4 py-2 rounded disabled:opacity-50"
          >
            {loading ? 'Enviando...' : 'Postular'}
          </button>
        </div>
      </form>
    </div>
  )
}
