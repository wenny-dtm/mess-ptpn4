/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#0d9488', // Teal 600
          50: '#f0fdfa',
          100: '#ccfbf1',
          800: '#115e59',
          900: '#134e4a',
        },
        secondary: '#0f766e', // Teal 700
      }
    },
  },
  plugins: [],
}
