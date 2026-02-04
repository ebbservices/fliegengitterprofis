/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          orange: '#FF8C42',
          dark: '#2C2C2C',
          light: '#F5F5F5',
        },
        secondary: {
          gray: '#6B6B6B',
        },
      },
      fontFamily: {
        sans: ['Open Sans', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
