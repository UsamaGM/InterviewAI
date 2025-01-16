/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#1F5AC2",
        secondary: "#8870E7",
        tertiary: "#A1BADD",
        primaryContrast: "#E6ECF8",
        secondaryContrast: "#E4F5D4",
        light: "#FEFFFF",
        dark: "#131313",
      },
    },
  },
  plugins: [],
};
