const colors = require("tailwindcss/colors");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
    colors: {
      white: colors.white,
      black: colors.black,
      grey: {
        50: colors.neutral["50"],
        100: colors.neutral["100"],
        200: colors.neutral["200"],
        300: colors.neutral["300"],
        400: colors.neutral["400"],
        500: colors.neutral["500"],
        600: colors.neutral["600"],
        700: colors.neutral["700"],
        800: colors.neutral["800"],
        900: colors.neutral["900"],
      },
      blue: {
        50: "#6DCFF6",
        100: "#60cff6",
        200: "#0089d7",
        300: "#0079be",
      },
    },
  },
  plugins: [],
};
