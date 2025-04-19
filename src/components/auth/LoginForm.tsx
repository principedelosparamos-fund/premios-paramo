import { useState } from "react";
import { auth } from "../../lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { getUserRole } from "../../lib/getUserRole";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log("✅ Usuario autenticado:", user.uid);
      const role = await getUserRole(user.uid);
      console.log("✅ Rol obtenido:", role);
      localStorage.setItem("userRole", role);
      localStorage.setItem("userEmail", email);

      if (role === "admin") {
        console.log("🔵 Redirigiendo a /admin");
        window.location.href = "/admin";
      } else {
        console.log("🟢 Redirigiendo a /jurado");
        window.location.href = "/jurado";
      }
    } catch (err: any) {
      console.error("❌ Error en login:", err);
      setError("Error al iniciar sesión. Verifica tus datos.");
    }
  }

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      <div className="py-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">Correo</label>
        <input type="email" placeholder="Correo electrónico" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" />
      </div>
      <div className="py-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
        <input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" />
      </div>
      {error && <div className="text-red-500">{error}</div>}
      <div className="py-3">
        <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-lg transition-colors">Iniciar Sesión</button>
      </div>
    </form>
  );
}