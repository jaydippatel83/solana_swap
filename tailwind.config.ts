import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        solana: {
          purple: "#9945FF",
          green: "#14F195",
          blue: "#00D4FF",
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-solana': 'linear-gradient(135deg, #9945FF 0%, #14F195 100%)',
      },
    },
  },
  plugins: [],
};
export default config;

