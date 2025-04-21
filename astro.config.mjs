// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  integrations: [react()],

  // Configuramos todas las páginas para renderizado en servidor por defecto
  // Para páginas estáticas, usar "export const prerender = true;" en el archivo .astro
  output: "server",

  vite: {
    plugins: [tailwindcss()]
  },

  adapter: vercel(),
});