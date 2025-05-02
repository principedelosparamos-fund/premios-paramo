export default {
  theme: {
    extend: {
      animation: {
        slowZoom: 'slowZoom 20s ease-in-out infinite alternate',
      },
      keyframes: {
        slowZoom: {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(1.1)' }, // Mejor escala, no exagerada
        },
      },
    },
  },
}
