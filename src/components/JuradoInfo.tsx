import { useEffect, useState } from 'react';
import { auth } from '../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

export default function JuradoInfo() {
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setEmail(user.email);
      } else {
        setEmail(null);
      }
      setLoading(false);
    });

    return () => unsubscribe(); // limpia el listener
  }, []);

  if (loading) {
    return <p>Cargando datos del jurado...</p>;
  }

  return (
    <div className="mb-6">
      {email ? (
        <p className="text-lg font-medium">📧 Jurado: {email}</p>
      ) : (
        <p className="text-red-500 font-medium">⚠️ No autenticado</p>
      )}
    </div>
  );
}
