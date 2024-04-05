import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      fontFamily: {
        sans: ["DM Sans", "sans-serif"],
      },
      colors: {
        primary: "#243F5F", // nano-blue
        gold: "#E8C075", // nano-yellow
        white: {
          DEFAULT: "#FFFFFF",
          100: "#F6F7F7",
        },
        gray: {
          DEFAULT: "#F5F6F6",
          100: "#F0F0F0",
        },
        brown: {
          50: "#A27F3C",
        },
      },
    },
  },
  plugins: [],
};
export default config;
