import { addDoc, collection, Timestamp } from 'firebase/firestore'
import { useState } from 'react'
import { CATEGORIES } from '../../lib/categories'
import { db } from '../../lib/firebase'
import MercadoPagoButton from './MercadoPagoButton'

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
  const [perfilPostulante, setPerfilPostulante] = useState('')

  // Agregado: referencia a la colección 'proyectos' en Firestore para registrar los proyectos
  const proyectosRef = collection(db, 'proyectos')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const form = e.target as HTMLFormElement
    const data = new FormData(form)
    const datos = Object.fromEntries(data.entries())
    // Tomar el perfil de pago seleccionado desde el estado si no viene del form
    const perfilPago = datos.perfilPago || perfilPostulante

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

      /**
       * VALIDACIÓN POR CORREO Y CELULAR (DESACTIVADA)
       * ------------------------------------------------------
       * Este bloque valida que no exista ya una obra registrada
       * con el mismo correo y celular, previniendo postulaciones duplicadas.
       * Para reactivar esta validación, descomenta el siguiente bloque:
       *
       * // const proyectosRef = collection(db, 'proyectos')
       * // const q = query(
       * //   proyectosRef,
       * //   where('email', '==', correo),
       * //   where('celular', '==', celular)
       * // )
       * // const querySnapshot = await getDocs(q)
       * // if (!querySnapshot.empty) {
       * //   setError('⚠️ Ya existe una postulación con este correo y celular.')
       * //   setLoading(false)
       * //   return
       * // }
       */

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
        perfilPago, // Guardamos el perfil de pago seleccionado
        fechaEstreno: formatearFecha(datos.fechaEstreno.toString()),
        fechaRegistro,
        timestamp: Timestamp.now(),
        calificado: false,
      })

      window.location.href = '/registro-exitoso'
    } catch (err) {
      console.error(err)
      setError('❌ No se pudo registrar la obra. Intenta nuevamente.')
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl rounded-xl bg-white p-2 py-8 shadow-lg lg:p-8">
      <form onSubmit={handleSubmit} className="mx-auto space-y-8 p-6">
        {/* 📝 Instrucciones de postulación */}
        <section className="space-y-4 leading-[1.8]">
          <h1 className="text-xl font-semibold">
            Formulario de postulación de la obra
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
          {/* <p>
            Cada obra se debe postular con datos (correo,celular) de usuario
            independientes.
          </p> */}
        </section>

        {error && <p className="text-red-600">{error}</p>}
        {loading && <p className="text-blue-600">Enviando...</p>}

        {/* 🧍 Datos del postulante */}
        <fieldset className="space-y-4">
          <legend className="text-gold-900 text-lg font-semibold">
            Datos del postulante
          </legend>

          <label className="block">
            Nombre y apellido de quien postula:
            <input
              name="nombrePostulante"
              required
              className="w-full rounded border p-2"
            />
          </label>

          <label className="block">
            Rol del postulante en la obra:
            <select
              name="perfil"
              required
              className="w-full rounded border p-2"
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
              className="w-full rounded border p-2"
            />
          </label>

          <label className="block">
            Celular:
            <input
              type="tel"
              name="celular"
              required
              className="w-full rounded border p-2"
            />
          </label>
        </fieldset>

        {/* 🎬 Información de la obra */}
        <fieldset className="space-y-4">
          <legend className="text-gold-900 text-lg font-semibold">
            Información de la obra
          </legend>

          <label className="block">
            Nombre de la obra:
            <input
              name="nombreObra"
              required
              className="w-full rounded border p-2"
            />
            <small className="block text-gray-600">
              Si se trata de una temporada en especial, se debe mencionar.
            </small>
          </label>

          <label className="block">
            Nombre del escritor(a) o escritores de la obra:
            <input
              name="escritores"
              required
              className="w-full rounded border p-2"
            />
            <small className="block text-gray-600">
              Esta información debe coincidir con los créditos de la obra.
            </small>
          </label>

          <label className="block">
            Fecha de estreno de la obra:
            <input
              type="date"
              name="fechaEstreno"
              required
              className="w-full rounded border p-2"
            />
          </label>

          <label className="block">
            Sinopsis de la obra:
            <textarea
              name="sinopsis"
              rows={4}
              required
              className="w-full resize-y rounded border p-2"
            />
            <small className="block text-gray-600">
              Resalte los aspectos diversos y biodiversos
            </small>
          </label>
        </fieldset>

        {/* 🔗 Enlaces */}
        <fieldset className="space-y-4">
          <legend className="text-gold-900 text-lg font-semibold">
            Enlaces de postulación
          </legend>

          <label className="block">
            Link a una imagen cuadrada, representativa y oficial de la obra
            <input
              type="url"
              name="linkImagen"
              required
              className="mt-2 w-full rounded border p-2"
            />
            <small className="block text-gray-600">
              Contenida en un drive sin solicitud de acceso
            </small>
          </label>

          <label className="block">
            Link a la versión final y oficial del libreto completo de la obra
            <input
              type="url"
              name="linkLibreto"
              required
              className="mt-2 w-full rounded border p-2"
            />
            <small className="block text-gray-600">
              (contenido en un drive sin solicitud de acceso). El libreto debe
              coincidir con el capítulo del cual se envía el link
            </small>
          </label>

          <label className="block">
            Link a la obra audiovisual completa.
            <input
              type="url"
              name="linkVideo"
              required
              className="mt-2 w-full rounded border p-2"
            />
            <small className="block text-gray-600">
              Puede ser un drive (sin solicitud de acceso), Vimeo (con o sin
              clave), YouTube (público o privado), plataforma gratuita, o
              incluso, pero no idealmente, plataforma de pago. Este no es un
              requisito para las categorías de teatro, circo y videojuego. En
              este caso, también se puede tratar de un tráiler
            </small>
          </label>
        </fieldset>

        {/* 🏆 Categorías */}
        <fieldset className="space-y-2">
          <legend className="text-gold-900 text-lg font-semibold">
            Categoría a la cual postula la obra
          </legend>
          <small className="block text-gray-600">
            Solo se puede postular una obra en una categoría
          </small>
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

        {/* Select de perfil del postulante */}
        <div className="mt-8">
          <label htmlFor="perfil" className="mb-2 block font-semibold">
            Perfil del postulante:
          </label>
          <select
            id="perfilPago"
            name="perfilPago"
            required
            className="mb-4 w-full rounded border p-2"
            value={perfilPostulante}
            onChange={(e) => setPerfilPostulante(e.target.value)}
          >
            <option value="">Selecciona un perfil</option>
            <option value="150.000-General">
              Soy un postulante en general ($150.000)
            </option>
            <option value="100.000-Socio">
              Soy un postulante socio de la Red Colombiana de Escritores
              Audiovisuales ($100.000)
            </option>
            <option value="50.000-Estudiante">
              Soy un postulante con crédito y la obra es de una
              universidad/institución reconocida ($50.000)
            </option>
            <option value="0-Central">
              Soy un postulante con crédito y la obra es del Programa de Cine de
              la Universidad Central (Gratis)
            </option>
          </select>

          {/* Fragmento de información y botón según perfil */}
          {perfilPostulante && (
            <div className="mb-4 rounded border bg-gray-50 p-4">
              {perfilPostulante === '150.000-General' && (
                <>
                  <div className="mb-1 font-semibold">
                    Postulante en general
                  </div>
                  <div className="mb-1">Tarifa general para postulantes.</div>
                  <div className="mb-2 text-lg font-bold">Valor: $150.000</div>
                  <MercadoPagoButton preferenceId="2406839620-1fa987df-faf3-4bcf-a864-be8d734ae798" />
                </>
              )}
              {perfilPostulante === '100.000-Socio' && (
                <>
                  <div className="mb-1 font-semibold">
                    Postulante socio en la Red Colombiana de Escritores
                    Audiovisuales
                  </div>
                  <div className="mb-1">
                    Soy un postulante con crédito como escritor en la obra que
                    hace parte de la Red Colombiana de Escritores Audiovisuales
                    (se revisará el nombre del postulante con Redes)
                  </div>
                  <div className="mb-2 text-lg font-bold">Valor: $100.000</div>
                  <MercadoPagoButton preferenceId="2406839620-2d5862ad-0b8a-4490-867f-f75178b65c29" />
                </>
              )}
              {perfilPostulante === '50.000-Estudiante' && (
                <>
                  <div className="mb-1 font-semibold">
                    Postulante con crédito y la obra es de una
                    universidad/institución reconocida
                  </div>
                  <div className="mb-1">
                    Soy un postulante con crédito como escritor en la obra y en
                    los créditos aparece que se trata de una realización de una
                    universidad o institución técnica o tecnológica reconocida
                    ante el Ministerio de Educación (se validará la información)
                  </div>
                  <div className="mb-2 text-lg font-bold">Valor: $50.000</div>
                  <MercadoPagoButton preferenceId="2406839620-bd13ec6d-bf29-4aad-80aa-5b956ff71d2d" />
                </>
              )}
              {perfilPostulante === '0-Central' && (
                <>
                  <div className="mb-1 font-semibold">
                    Postulante con crédito y la obra es del Programa de Cine de
                    la Universidad Central
                  </div>
                  <div className="mb-1">
                    Soy un postulante con crédito como escritor en la obra y en
                    los créditos aparece que se trata de una producción del
                    Programa de Cine de la Universidad Central (se revisará la
                    información con la dirección del programa) 
                  </div>
                  <div className="mb-2 text-lg font-bold text-green-700">
                    Gratis
                  </div>
                  <button
                    type="button"
                    className="cursor-not-allowed rounded bg-gray-400 px-4 py-2 text-white"
                    disabled
                  >
                    Sin pago requerido
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        {/* ✅ Consentimientos */}
        <fieldset className="space-y-2">
          <legend className="text-gold-900 text-lg font-semibold">
            Consentimientos
          </legend>
          <label className="block">
            <input
              type="checkbox"
              name="pagoRealizado"
              required
              className="mr-2"
            />
            He realizado el pago de la postulación de la obra
          </label>
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
            La organización puede usar mis datos para ponerse en contacto
            conmigo en caso de requerirlo, solo en función de la postulación y
            participación en los Premios Príncipe de los Páramos.
          </label>
          <label className="block">
            <input
              type="checkbox"
              name="garantiaVeracidad"
              required
              className="mr-2"
            />
            Garantizo que la información diligenciada es veraz, tengo la
            facultad para hacer esta postulación de acuerdo con el reglamento, y
            mantendré ajena a la organización de los Premios Príncipe de los
            Páramos ante cualquier reclamación por concepto de derechos de
            autor.
          </label>
        </fieldset>

        {/* Botones */}
        <div className="flex justify-end gap-4">
          <button
            type="reset"
            className="bg-ui-error rounded border px-4 py-2 text-white"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="bg-golddark rounded px-4 py-2 font-semibold text-black disabled:opacity-50"
          >
            {loading ? 'Enviando...' : 'Postular'}
          </button>
        </div>
      </form>
    </div>
  )
}
