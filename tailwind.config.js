/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/app/**/*.{js,jsx}", "./src/components/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        maroon: {
          950: "#3a0f14",
          900: "#4a1319",
          800: "#5c1820",
        },
        gold: {
          400: "#e0b23a",
          500: "#c99a2e",
        },
      },
      fontFamily: {
        sans: ["Helvetica Neue", "Arial", "sans-serif"],
      },
    },
  },
  plugins: [],
};
