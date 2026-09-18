/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./pages/**/*.{js,jsx}', './components/**/*.{js,jsx}', './hooks/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#FBFBF9',
        stone: '#F3F2EE',
        line: '#E1DFD8',
        ink: '#15201B',
        muted: '#626862',
        bottle: { DEFAULT: '#1D3B30', dark: '#132A21', light: '#2C5243' },
        brass: { DEFAULT: '#A6834C', light: '#C9AE7E' },
        claret: '#7A2233',
      },
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      maxWidth: { site: '1320px' },
    },
  },
  plugins: [],
}
