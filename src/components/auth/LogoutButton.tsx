import { signOut } from 'firebase/auth'
import { auth } from '../../lib/firebase'

export default function LogoutButton() {
  async function handleLogout() {
    try {
      // 🔥 Cerrar sesión en Firebase
      await signOut(auth)
      console.log('✅ Usuario deslogueado de Firebase.')

      // 🔥 Limpiar localStorage
      localStorage.removeItem('userEmail')
      localStorage.removeItem('userRole')
      localStorage.removeItem('userNombre')
      localStorage.removeItem('adminDashboardData')
      localStorage.removeItem('adminDashboardLastUpdate')
      localStorage.removeItem('proyectosJurado')
      localStorage.removeItem('votacionesJurado')

      console.log('✅ LocalStorage limpiado.')

      // 🔥 Limpiar cookie
      document.cookie =
        'userRole=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'

      console.log('✅ Cookie userRole eliminada.')

      // 🔥 Redirigir al login
      window.location.href = '/login' // o la ruta que uses para login
    } catch (error) {
      console.error('❌ Error cerrando sesión:', error)
    }
  }

  return (
    <button
      onClick={handleLogout}
      className="bg-ui-error rounded-lg px-4 py-2 font-medium text-white transition-colors"
    >
      Cerrar Sesión
    </button>
  )
}
