import { signOut } from "firebase/auth";
import { auth } from "../../lib/firebase";

export default function LogoutButton() {
  async function handleLogout() {
    try {
      // 🔥 Cerrar sesión en Firebase
      await signOut(auth);
      console.log("✅ Usuario deslogueado de Firebase.");

      // 🔥 Limpiar localStorage
      localStorage.removeItem("userEmail");
      localStorage.removeItem("userRole");
      localStorage.removeItem("userNombre");

      console.log("✅ LocalStorage limpiado.");

      // 🔥 Limpiar cookie
      document.cookie = "userRole=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

      console.log("✅ Cookie userRole eliminada.");

      // 🔥 Redirigir al login
      window.location.href = "/login"; // o la ruta que uses para login
    } catch (error) {
      console.error("❌ Error cerrando sesión:", error);
    }
  }

  return (
    <button
      onClick={handleLogout}
      className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
    >
      Cerrar Sesión
    </button>
  );
}
