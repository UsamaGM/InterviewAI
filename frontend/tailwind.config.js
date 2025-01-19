/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#4E79A7",
        primaryContrast: "#FFFFFF",
        secondary: "#59A14F",
        secondaryContrast: "#FFFFFF",
        secondaryDark: "#2D6D27",
        accent: "#F28E2B",
        accentContrast: "#FFFFFF",
        accentLight: "#FFD98E",
        dark: "#2F2F2F",
        lightGray: "#B0B0C3",
        light: "#F9F9F9",
        shadowDark: "#00000033", // Opacity-based shadow
        tertiary: "#EDC948",
        tertiaryContrast: "#2F2F2F",
        warning: "#D62728",
        warningContrast: "#FFFFFF",
      },
      boxShadow: {
        dark: "0px 4px 6px #00000033", // Predefined dark shadow
      },
    },
  },
  plugins: [],
};
