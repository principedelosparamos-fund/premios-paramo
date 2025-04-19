import { signOut } from "firebase/auth";
import { auth } from "../../lib/firebase";

export default function LogoutButton() {
  async function handleLogout() {
    try {
      await signOut(auth); // Cierra sesión de Firebase
      console.log("✅ Usuario deslogueado.");

      localStorage.removeItem("userRole");
      localStorage.removeItem("userEmail");
      console.log("✅ LocalStorage limpiado.");

      window.location.href = "/login"; // Redirige a login
    } catch (error) {
      console.error("❌ Error cerrando sesión:", error);
    }
  }

  return (
    <button onClick={handleLogout} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition">
      Cerrar Sesión
    </button>
  );
}
