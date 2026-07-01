/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // SMED brand palette (teal from the official form title bar).
        brand: {
          DEFAULT: '#007E7A',
          dark: '#005c59',
          light: '#e6f2f1',
        },
        vale: '#007E7A',
        sodexo: '#0a2896',
      },
      fontFamily: {
        sans: ['Inter', 'Helvetica', 'Arial', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
