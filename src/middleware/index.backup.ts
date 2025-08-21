// src/middleware.ts (ejemplo Astro; idea igual en Next)
import type { MiddlewareHandler } from 'astro';

export const onRequest: MiddlewareHandler = async (ctx, next) => {
  const { pathname } = new URL(ctx.request.url);

  // 1) Rutas públicas (sin login/rol)
  const PUBLIC_PATHS = new Set([
    '/', '/acerca', '/login',
    '/Jurado', // ← permitir ver el formulario público
  ]);

// 2) Bypass para públicas y estáticos (déjalo como lo tienes)

// 3) Proteger SOLO subrutas privadas: /Jurado/*
const isJuradoBase = pathname === '/Jurado';
const isJuradoPrivado = pathname.startsWith('/Jurado/');

if (isJuradoPrivado) {
  const user = await obtenerUsuarioDesdeCookieOToken(ctx); // tu función actual
  if (!user) return Response.redirect(new URL('/login', ctx.request.url));

  const tieneRol = await verificarRolEnFirestore(user);    // tu función actual
  if (!tieneRol) return Response.redirect(new URL('/login', ctx.request.url));
}

// Nota: si es /Jurado (base), NO redirigimos. Devolvemos next() para que se vea el formulario.
return next();
