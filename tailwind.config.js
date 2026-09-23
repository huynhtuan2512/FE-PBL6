/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: '#DC2626',
        ink: '#0F172A',
        canvas: '#FFFAF5',
        gold: '#D97706',
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'sans-serif'],
      },
      boxShadow: {
        float: '0 16px 42px rgba(69, 10, 10, 0.16)',
      },
    },
  },
  plugins: [],
};