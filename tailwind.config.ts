import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          teal: "#0D9488",
          dark: "#111827",
          mint: "#E6FFFA",
          mintBorder: "#99F6E4",
        },
        alert: {
          amberBg: "#FEF3C7",
          amberText: "#D97706",
          amberBorder: "#FCD34D",
        },
        safe: {
          emeraldBg: "#D1FAE5",
          emeraldText: "#059669",
          emeraldBorder: "#6EE7B7",
        },
      },
    },
  },
  plugins: [],
};
export default config;
