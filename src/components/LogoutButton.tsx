import { signOut } from "firebase/auth";
import { auth } from "../lib/firebase";

const LogoutButton = () => {
  const handleLogout = async () => {
    console.log("Click en botón de logout"); // Primer rastreador

    try {
      await signOut(auth);
      console.log("Sesión cerrada correctamente");
      localStorage.removeItem("userRole");
      window.location.href = "/login";
    } catch (error) {
      console.error("⚠️ Error cerrando sesión:", error);
      alert("Error al cerrar sesión.");
    }
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition"
    >
      Cerrar sesión
    </button>
  );
};

export default LogoutButton;