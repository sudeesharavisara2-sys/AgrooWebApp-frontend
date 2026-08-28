/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        agroo: {
          50: '#f2f9ee',
          100: '#e0f1d6',
          200: '#c2e3af',
          300: '#9bd07f',
          400: '#77bb56',
          500: '#579e38',
          600: '#437d2b',
          700: '#356124',
          800: '#2d4d21',
          900: '#27411f',
        },
      },
    },
  },
  plugins: [],
};
