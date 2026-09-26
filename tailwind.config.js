/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./pages/**/*.{js,jsx}', './components/**/*.{js,jsx}', './hooks/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#FBFBF9',
        stone: '#F3F2EE',
        line: '#E1DFD8',
        ink: '#141414',
        muted: '#6B6B6B',
        // Named for the shop's original bottle-green; the palette is black now, so these are
        // neutral. The name is kept because it's referenced throughout the styles and pages.
        bottle: { DEFAULT: '#141414', dark: '#000000', light: '#333333' },
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
