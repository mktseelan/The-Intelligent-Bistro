/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./data/**/*.{js,jsx,ts,tsx}",
    "./services/**/*.{js,jsx,ts,tsx}",
    "./store/**/*.{js,jsx,ts,tsx}",
    "./types/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#1E1916",
        cream: "#F7F0E8",
        parchment: "#FBF5EF",
        sand: "#E7D7C9",
        cocoa: "#6E4E37",
        copper: "#C26A3D",
        burgundy: "#7B3F35",
        olive: "#6D7A51",
        blush: "#F1DDD1",
      },
      boxShadow: {
        card: "0 12px 30px rgba(68, 42, 28, 0.10)",
        float: "0 18px 40px rgba(63, 35, 23, 0.14)",
      },
    },
  },
  plugins: [],
};
