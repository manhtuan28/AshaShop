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
          DEFAULT: '#DB4444',
          50: '#FEF2F2',
          100: '#FEE2E2',
          200: '#FECACA',
          300: '#FCA5A5',
          400: '#F87171',
          500: '#DB4444',
          600: '#DC2626',
          700: '#B91C1C',
          800: '#991B1B',
          900: '#7F1D1D',
          hover: '#E07575',
          light: '#F5ECEC',
        },
        exclusive: {
          red: '#DB4444',
          'red-hover': '#E07575',
          'red-light': '#F5ECEC',
          black: '#000000',
          dark: '#363738',
          text: '#7D8184',
          'light-text': '#FAFAFA',
          bg: '#F5F5F5',
          card: '#F5F5F5',
          green: '#00FF66',
          gold: '#FFAD33',
          border: '#E5E7EB',
        }
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'exclusive-sm': '0px 1px 13px rgba(0, 0, 0, 0.05)',
        'exclusive-md': '0px 2px 20px rgba(0, 0, 0, 0.08)',
        'exclusive-lg': '0px 4px 30px rgba(0, 0, 0, 0.12)',
      }
    },
  },
  plugins: [],
}
