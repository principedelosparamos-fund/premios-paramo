import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../lib/firebase";
import { getUserRole } from "../lib/getUserRole";

const LoginForm = () => {

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const email = event.currentTarget.email.value;
    const password = event.currentTarget.password.value;

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Leer el rol del usuario
      const role = await getUserRole(user.uid);

      if (!role) {
        alert("No tienes permisos para ingresar.");
        await auth.signOut();
        return;
      }

      // Guardar el rol en localStorage
      localStorage.setItem("userRole", role);

      // Redirigir según el rol
      if (role === "admin") {
        window.location.href = '/dashboard';
      } else if (role === "jurado") {
        window.location.href = '/jurado';
      } else {
        alert("Rol no autorizado.");
        await auth.signOut();
      }

    } catch (error) {
      if (import.meta.env.DEV) {
        console.error("⚠️ Error al iniciar sesión:", error);
      }
      alert("Error en el inicio de sesión. Verifica tu correo y contraseña.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
    <input
      type="email"
      name="email"
      placeholder="Correo electrónico"
      required
      className="border p-2 rounded"
    />
    <input
      type="password"
      name="password"
      placeholder="Contraseña"
      required
      className="border p-2 rounded"
    />
    <button type="submit" className="bg-blue-600 text-white py-2 rounded">
      Iniciar sesión
    </button>
  </form>
  );
};

export default LoginForm;