import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        success: "var(--success)",
        warning: "var(--warning)",
        destructive: "var(--destructive)",
        steel: "var(--steel)",
      },
      backgroundImage: {
        chrome:
          "linear-gradient(180deg, #ffffff 0%, #dde4ec 34%, #b4bfcc 58%, #f0f4f9 100%)",
        "chrome-soft":
          "linear-gradient(180deg, rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.03))",
        graphite: "linear-gradient(180deg, #161c25 0%, #0b0e13 100%)",
        "steel-soft":
          "linear-gradient(180deg, rgba(127, 168, 212, 0.22), rgba(127, 168, 212, 0.06))",
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
      },
      boxShadow: {
        soft: "0 10px 30px rgba(0, 0, 0, 0.45)",
        card: "0 14px 38px rgba(0, 0, 0, 0.5)",
        chrome:
          "0 10px 26px rgba(0, 0, 0, 0.55), inset 0 1px 0 rgba(255, 255, 255, 0.55)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
