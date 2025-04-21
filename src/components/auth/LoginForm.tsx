import { useState } from "react";
import { auth, db } from "../../lib/firebase"; // 🔥 Asegúrate que db esté importado
import { signInWithEmailAndPassword } from "firebase/auth";
import { getUserRole } from "../../lib/getUserRole";
import { doc, getDoc } from "firebase/firestore"; // 🔥 Nuevo para leer Firestore
import Snackbar from "../ui/Snackbar";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [snackbar, setSnackbar] = useState<{ message: string; type: "success" | "error" } | null>(null);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log("✅ Usuario autenticado:", user.uid);

      const role = await getUserRole(user.uid);
      console.log("✅ Rol obtenido:", role);

      // 🔥 Guardar email y rol en localStorage
      localStorage.setItem("userEmail", email);
      localStorage.setItem("userRole", role);

      // 🔥 NUEVO: obtener el nombre del jurado desde Firestore
      const juradosRef = doc(db, "jurados", user.uid); // UID es el ID del documento
      const juradoSnap = await getDoc(juradosRef);

      if (juradoSnap.exists()) {
        const juradoData = juradoSnap.data();
        const nombre = juradoData.nombre || "";
        localStorage.setItem("userNombre", nombre);
        console.log("✅ Nombre de jurado almacenado:", nombre);
      } else {
        console.warn("⚠️ No se encontró documento de jurado en Firestore.");
        localStorage.setItem("userNombre", ""); // Para evitar que quede undefined
      }

      // 🔥 Guardar cookie para middleware
      document.cookie = `userRole=${role}; path=/; SameSite=Lax; Secure`;
      console.log("✅ Cookie guardada:", document.cookie);

      setSnackbar({ message: "Sesión iniciada exitosamente.", type: "success" });

      // 🔥 Redirigir después de pequeño delay para que se guarden las cookies
      setTimeout(() => {
        if (role === "admin") {
          console.log("🔵 Redirigiendo a /admin");
          window.location.href = "/admin";
        } else {
          console.log("🟢 Redirigiendo a /jurado");
          window.location.href = "/jurado";
        }
      }, 300);

    } catch (err: any) {
      console.error("❌ Error en login:", err);
      setError("Error al iniciar sesión. Verifica tus datos.");
      setSnackbar({ message: "Email o contraseña incorrectos.", type: "error" });
    }
  }

  return (
    <div className="container">
      <form onSubmit={handleLogin} className="space-y-4">
        <div className="py-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Correo</label>
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
          />
        </div>
        <div className="py-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
          />
        </div>
        {error && <div className="text-red-500">{error}</div>}
        <div className="py-3">
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-lg transition-colors"
          >
            Iniciar Sesión
          </button>
        </div>
      </form>

      {/* Mostrar Snackbar si existe */}
      {snackbar && (
        <Snackbar
          message={snackbar.message}
          type={snackbar.type}
          onClose={() => setSnackbar(null)}
        />
      )}
    </div>
  );
}
