import { useEffect } from 'react'

interface Props {
  message: string
  type: 'success' | 'error'
  onClose: () => void
}

export default function Snackbar({ message, type, onClose }: Props) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, 3000) // Cierra después de 3 segundos

    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div
      className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-lg shadow-lg
      ${type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}
      transition-opacity duration-300
    `}
    >
      {message}
    </div>
  )
}
