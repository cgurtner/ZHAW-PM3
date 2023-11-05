/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundColor: {
        'dark-dh': '#252840',
        'light-dh': '#00b470'
      },
      colors: {
        'dark-dh': '#252840',
        'light-dh': '#00b470'
      }
    },
  },
  plugins: [],
}
