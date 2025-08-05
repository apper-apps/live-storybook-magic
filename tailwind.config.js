/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#FFF5F7',
          100: '#FFE6EC',
          200: '#FFD1DC',
          300: '#FFB3C6',
          400: '#FF8BA7',
          500: '#FF6B9D',
          600: '#E55A87',
          700: '#C44569',
          800: '#9C3650',
          900: '#7A2B3E'
        },
        secondary: {
          50: '#FEF7E0',
          100: '#FDECC4',
          200: '#FBD38D',
          300: '#F6AD55',
          400: '#ED8936',
          500: '#FFC107',
          600: '#E2A900',
          700: '#B7791F',
          800: '#975A16',
          900: '#744210'
        },
        surface: '#FFF5F7',
        background: '#FFEAA7'
      },
      fontFamily: {
        'display': ['Fredoka One', 'cursive'],
        'body': ['Plus Jakarta Sans', 'sans-serif']
      },
      borderRadius: {
        'xl': '16px',
        '2xl': '24px'
      },
      boxShadow: {
        'card': '0 8px 16px rgba(0, 0, 0, 0.1)',
        'card-hover': '0 12px 24px rgba(0, 0, 0, 0.15)'
      }
    },
  },
  plugins: [],
}