// middleware/auth.ts
import { defineMiddleware } from "astro/middleware";

export const onRequest = defineMiddleware(async (context, next) => {
  const role = context.cookies.get("userRole")?.value || "";

  // Protección de rutas de admin
  if (context.url.pathname.startsWith("/dashboard") || context.url.pathname.startsWith("/jurado/registro")) {
    if (role !== "admin") {
      return new Response(null, {
        status: 302,
        headers: { Location: "/login" },
      });
    }
  }

  // Protección de rutas de jurado
  if (context.url.pathname.startsWith("/jurado") && !context.url.pathname.startsWith("/jurado/registro")) {
    if (role !== "jurado" && role !== "admin") {
      return new Response(null, {
        status: 302,
        headers: { Location: "/login" },
      });
    }
  }

  return next();
});
