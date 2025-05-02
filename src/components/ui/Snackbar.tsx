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
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 transform rounded-lg px-6 py-3 shadow-lg ${type === 'success' ? 'bg-ui-success text-white' : 'bg-ui-error text-white'} transition-opacity duration-300`}
    >
      {message}
    </div>
  )
}
