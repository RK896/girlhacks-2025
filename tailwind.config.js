/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'marble-light': '#F8F8F8',
        'marble-dark': '#EAEAEA',
        'gold-main': '#D4AF37',
        'athena-blue': '#104975',
      },
      fontFamily: {
        'cinzel': ['Cinzel', 'serif'],
      },
    },
  },
  plugins: [],
}
