import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#1F2933",
        paper: "#FBFAF7",
        sage: "#6F8F72",
        moss: "#315C48",
        clay: "#B7795B",
        skysoft: "#DCEBF3"
      },
      borderRadius: {
        app: "8px"
      }
    }
  },
  plugins: []
};

export default config;
