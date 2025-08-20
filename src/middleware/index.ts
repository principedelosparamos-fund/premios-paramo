// src/middleware/index.ts
import type { MiddlewareHandler } from 'astro';

export const onRequest: MiddlewareHandler = async (ctx, next) => {
  const { pathname } = new URL(ctx.request.url);

  // 1) Rutas públicas
  const PUBLIC_PATHS = new Set<string>([
    '/',
    '/acerca',
    '/login',
    '/Jurado', // base pública para ver formulario
  ]);

  // 1.1) Bypass de assets/estáticos
  const isStatic =
    pathname.startsWith('/_image') ||
    pathname.startsWith('/assets') ||
    pathname.startsWith('/favicon') ||
    pathname.startsWith('/fonts') ||
    pathname.startsWith('/images');

  if (PUBLIC_PATHS.has(pathname) || isStatic) {
    return next();
  }

  // 2) Proteger solo subrutas privadas relevantes
  const requiereJuradoPrivado = pathname.startsWith('/Jurado/');
  const requiereAdmin = pathname.startsWith('/admin');

  if (!(requiereJuradoPrivado || requiereAdmin)) {
    return next();
  }

  // 3) Lazy import de helpers (para no cargar Firebase en rutas públicas)
  try {
    const { obtenerUsuarioDesdeCookieOToken, verificarRolEnFirestore } =
      await import('../lib/getUserRole'); // ⚠️ ajusta si tu helper está en otro archivo

    const user = await obtenerUsuarioDesdeCookieOToken(ctx);
    if (!user) {
      return Response.redirect(new URL('/login', ctx.request.url));
    }

    const tieneRol = await verificarRolEnFirestore(user);
    if (!tieneRol) {
      return Response.redirect(new URL('/login', ctx.request.url));
    }

    return next();
  } catch (err) {
    console.error('[middleware] fallo control de acceso:', err);
    return Response.redirect(new URL('/login', ctx.request.url));
  }
};
