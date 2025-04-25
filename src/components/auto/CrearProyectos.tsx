// src/components/Auto/CrearProyectos.tsx
'use client'

import { useState } from 'react'
import { collection, addDoc, Timestamp } from 'firebase/firestore'
import { db } from '../../lib/firebase'
import { CATEGORIES } from '../../lib/categories'

export default function CrearProyectos() {
  const [status, setStatus] = useState('')

  const nombresObras = [
    'La Voz del Páramo',
    'Guardianes del Bosque',
    'Cantos de Niebla',
    'Ecos de la Montaña',
    'Susurros de Agua',
    'El Vuelo del Colibrí',
    'Semillas de Vida',
    'Amanecer Verde',
    'Horizontes Invisibles',
    'Raíces del Viento',
  ]

  const obtenerCategoriaAleatoria = () => {
    const indice = Math.floor(Math.random() * CATEGORIES.length)
    return CATEGORIES[indice]
  }

  const crearProyectos = async () => {
    setStatus('Creando proyectos...')

    try {
      const proyectosRef = collection(db, 'proyectos')

      for (let i = 0; i < 10; i++) {
        await addDoc(proyectosRef, {
          nombrePostulante: `Postulante ${i + 1}`,
          perfil: 'autor',
          email: `prueba${i}@correo.com`,
          celular: `30012345${i}`,
          nombreObra: nombresObras[i],
          escritores: `Escritor ${i + 1}`,
          fechaEstreno: '01/01/2025 00:00',
          sinopsis: `Sinopsis de prueba para la obra ${nombresObras[i]}.`,
          linkImagen: 'https://via.placeholder.com/300',
          linkLibreto: 'https://via.placeholder.com/300',
          linkVideo: 'https://via.placeholder.com/300',
          categorias: [obtenerCategoriaAleatoria()],
          fechaRegistro: new Date().toLocaleString('es-CO', { hour12: false }),
          timestamp: Timestamp.now(),
          calificado: false,
        })
      }

      setStatus('✅ ¡10 proyectos creados exitosamente!')
    } catch (error) {
      console.error(error)
      setStatus('❌ Error al crear los proyectos.')
    }
  }

  return (
    <div className="space-y-4">
      <button
        onClick={crearProyectos}
        className="bg-gold-600 text-black px-4 py-2 rounded"
      >
        Crear 10 proyectos aleatorios
      </button>
      <p className="text-lg text-blue-600 mt-4">{status}</p>
    </div>
  )
}
