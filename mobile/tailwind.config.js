/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#1E1916",
        cream: "#F7F0E8",
        sand: "#E7D7C9",
        cocoa: "#6E4E37",
        copper: "#C26A3D",
        olive: "#6D7A51",
        blush: "#F1DDD1",
      },
      boxShadow: {
        card: "0 12px 30px rgba(68, 42, 28, 0.10)",
      },
    },
  },
  plugins: [],
};

