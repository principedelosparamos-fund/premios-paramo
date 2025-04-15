// tailwind.config.js
  /** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{astro,js,ts,jsx,tsx,html}'],
    theme: {
      extend: {
        colors: {
          black: {
            700: '#121212',
            600: '#1A1A1A',
            500: '#2E2E2E',
          },
          gray: {
            300: '#B3B3B3',
            100: '#F5F5F5',
          },
          white: '#FFFFFF',
          gold: {
            700: '#C59F24',
            600: '#D4AF37',
            500: '#E5C970',
            300: '#F7E29C',
          },
          copper: {
            700: '#742C22',
            600: '#9C3B2F',
            500: '#C84D3D',
            300: '#E98A7F',
          },
          yellow: {
            700: '#B58E00',
            600: '#FFD700',
            500: '#FFE766',
            300: '#FFF5B0',
          },
          olive: {
            500: '#647C56',
            300: '#A3B18A',
          },
          sky: {
            200: '#CBD5E1',
          },
          midnight: {
            700: '#2D1B3C',
          },
        },
        fontFamily: {
          titulo: ['"Josefin Sans"', 'sans-serif'],
          texto: ['"Raleway"', 'sans-serif'],
        },
      },
    },
    plugins: [],
  }

