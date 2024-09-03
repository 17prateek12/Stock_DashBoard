/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ["./src/**/*.{html,js,ts,jsx,tsx}"],
  theme: {
    screens: {
      xl: { max: "1280px" },
      sm: { max: "640px" },
      md: { max: "768px" },
      lg: { max: "1024px" },
      navmd: { max: "900px" },
    },
    extend: {
        colors: {
          text:"var(--text)", 
          muted: "var(--muted)",
          btn:"var(--btn)",
          btntxt:"var(--btntxt)",
          loginform:"var(--loginform)",
          navside:"var(--navside)",
        },
    },
  },
  plugins: [],
}


