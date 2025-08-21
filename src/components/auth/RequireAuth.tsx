import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { auth } from "../../lib/firebase"; // import relativo

type AllowRole = "admin" | "jurado";

export default function RequireAuth({
  children,
  allow,
}: {
  children: React.ReactNode;
  allow?: AllowRole;
}) {
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState<any>(null);

  // 1) Esperar sesión de Firebase
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setReady(true);
    });
    return unsub;
  }, []);

  // 2) Redirecciones una vez lista la sesión
  useEffect(() => {
    if (!ready) return;

    // Sin sesión -> a /login
    if (!user) {
      window.location.replace("/login");
      return;
    }

    // Con sesión -> validar rol si se pidió
    if (allow) {
      const role = localStorage.getItem("userRole"); // lo guardas en LoginForm
      if (allow === "admin" && role !== "admin") {
        window.location.replace("/Jurado");
        return;
      }
      if (allow === "jurado" && role !== "jurado") {
        window.location.replace("/admin");
        return;
      }
    }
  }, [ready, user, allow]);

  if (!ready || !user) return null; // evita parpadeos/SSR
  return <>{children}</>;
}
