/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bv-black':  '#0c0c0c',
        'bv-dark':   '#1a1a1a',
        'bv-gold':   '#c9a84c',
        'bv-light':  '#f0d080',
        'bv-cream':  '#f5f0e8',
        'bv-warm':   '#e8dcc8',
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'serif'],
        body:    ['Lato', 'sans-serif'],
        script:  ['"Great Vibes"', 'cursive'],
      },
    },
  },
  plugins: [],
}
