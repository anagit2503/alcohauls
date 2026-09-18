/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#fef9f3',
          100: '#fdf2e7',
          200: '#fce5cf',
          300: '#fad3b3',
          400: '#f7b885',
          500: '#f39c12',
          600: '#d4860f',
          700: '#a8680b',
          800: '#8b5308',
          900: '#6e4206',
        },
        wine: {
          50: '#fdf5f7',
          100: '#fceaf0',
          200: '#f9d6e1',
          300: '#f4b8cc',
          400: '#eb8aaa',
          500: '#d64e6f',
          600: '#c5334a',
          700: '#a4263b',
          800: '#7d1c2b',
          900: '#5c1420',
        },
        slate: {
          900: '#0f172a',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Merriweather', 'serif'],
      },
    },
  },
  plugins: [],
}
