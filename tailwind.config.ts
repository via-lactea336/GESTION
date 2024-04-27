import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        primary: {
          50: "#fbf5fe",
          100: "#f7ebfc",
          200: "#eed6f8",
          300: "#e3b6f1",
          400: "#d38ae8",
          500: "#bd5dd8",
          600: "#ac4ac4",
          700: "#89309b",
          800: "#72297f",
          900: "#5f2669",
        },
      },
    },
  },
  plugins: [],
};
export default config;
