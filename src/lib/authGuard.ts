// src/lib/authGuard.ts

/**
 * Verifica si el usuario está autenticado basándose en localStorage.
 * Si no está autenticado, lo redirige a /login.
 */
/* export const checkAuth = () => {
    if (typeof window !== 'undefined') {
      const role = localStorage.getItem('userRole');

      if (!role) {
        console.warn("Usuario no autenticado. Redirigiendo a login...");
        window.location.href = '/login';
      }
    }
  };
 */
