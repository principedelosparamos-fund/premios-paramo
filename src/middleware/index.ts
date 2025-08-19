// src/middleware.ts (ejemplo Astro; idea igual en Next)
import type { MiddlewareHandler } from 'astro';

export const onRequest: MiddlewareHandler = async (ctx, next) => {
  const { pathname } = new URL(ctx.request.url);

  // 1) Rutas públicas (sin login/rol)
  const PUBLIC_PATHS = new Set([
    '/', '/acerca', '/login',
    '/Jurado', // ← permitir ver el formulario público
  ]);

  // 2) Dejar pasar públicas y estáticos
  if (
    PUBLIC_PATHS.has(pathname) ||
    pathname.startsWith('/_image') ||
    pathname.startsWith('/assets')
  ) {
    return next();
  }

  // 3) Proteger SOLO subrutas privadas: /Jurado/*
  const requiereJurado = pathname.startsWith('/Jurado/'); // ¡con barra y J mayúscula!
  if (requiereJurado) {
    const user = await obtenerUsuarioDesdeCookieOToken(ctx); // tu función real
    if (!user) return Response.redirect(new URL('/login', ctx.request.url));

    const tieneRol = await verificarRolEnFirestore(user); // tu función real
    if (!tieneRol) return Response.redirect(new URL('/login', ctx.request.url));
  }

  return next();
};
