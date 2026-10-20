import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        veyra: {
          black: '#000000',
          charcoal: '#121212',
          darkgray: '#1E1E1E',
          accentBlue: '#3B82F6',
          accentGreen: '#10B981',
          textMain: '#FFFFFF',
          textMuted: '#A0A0A0',
        }
      },
    },
  },
  plugins: [],
}
