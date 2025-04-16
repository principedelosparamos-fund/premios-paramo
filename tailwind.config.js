// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports= {

  content: ['./src/**/*.{astro,js,ts,jsx,tsx,html}'],
  theme: {
    extend: {
      colors: {
        black: {
          700: 'oklch(0.13 0 0)',
            600: 'oklch(0.18 0 0)',
            500: 'oklch(0.27 0 0)',
        }

        ,
        gray: {
          300: 'oklch(0.75 0 0)',
            100: 'oklch(0.95 0 0)',
        }

        ,
        white: 'oklch(1 0 0)',
        gold: {
          700: 'oklch(0.7 0.2 95)',
            600: 'oklch(0.72 0.21 95)',
            500: 'oklch(0.8 0.18 95)',
            300: 'oklch(0.88 0.14 95)',
        }

        ,
        copper: {
          700: 'oklch(0.35 0.2 30)',
            600: 'oklch(0.45 0.22 30)',
            500: 'oklch(0.58 0.22 30)',
            300: 'oklch(0.74 0.15 30)',
        }

        ,
        yellow: {
          700: 'oklch(0.72 0.18 95)',
            600: 'oklch(0.9 0.17 95)',
            500: 'oklch(0.95 0.14 95)',
            300: 'oklch(0.98 0.08 95)',
        }

        ,
        olive: {
          500: 'oklch(0.58 0.08 130)',
            300: 'oklch(0.75 0.05 130)',
        }

        ,
        sky: {
          200: 'oklch(0.85 0.03 250)',
        }

        ,
        midnight: {
          700: 'oklch(0.18 0.04 280)',
        }

        ,
      }

      ,
      fontFamily: {
        paramo: ['"Cinzel"', 'serif'],
      }

      ,
    }

    ,
  }

  ,
  plugins: [],
}