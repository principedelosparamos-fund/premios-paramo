import { useEffect, useState } from 'react';
import { auth } from '../lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    window.location.href = '/';
  };

  return (
    <div className="contenedor">
      <header className='flex justify-between items-center p-4 bg-black-700'>
        <h1 className="text-xl font-bold text-white">Premios Paramo</h1>
        {isLoggedIn ? (
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
          >
            Cerrar sesión
          </button>
        ) : (
          <a
            href="/jurado"
            className="bg-gold-700 text-white px-4 py-2 rounded"
          >
            Ingreso jurados
          </a>
        )}
      </header>
    </div>
  );
}
