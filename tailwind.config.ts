import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand colors from src/styles/index.js
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        // Custom brand colors
        brand: {
          orange: "#FB6D3B",
          "orange-hover": "#cb4f25",
          yellow: "#fdd561",
          "yellow-hover": "#e7bf54",
          red: "#FF5367",
          "red-light": "#FEEBEE",
          "red-light-hover": "#FDD9DE",
          purple: "#7262a6",
          "purple-light": "#8c7fb2",
        },
        wheat: {
          light: "#FDFDFB",
          warm: "#FBF9F7",
        },
        grey: {
          light: "#FBF9F7",
          DEFAULT: "#ebebeb",
          dark: "#A79F97",
        },
      },
      fontFamily: {
        "heading-en": ["Montserrat", "sans-serif"],
        "body-en": ["Montserrat", "sans-serif"],
        "heading-ar": ["Noto Kufi Arabic", "sans-serif"],
        "body-ar": ["Noto Kufi Arabic", "sans-serif"],
        sans: ["IBM Plex Sans Arabic", "Montserrat", "sans-serif"],
      },
      spacing: {
        xxs: "0.25rem",
        xs: "0.5rem",
        s: "0.75rem",
        m: "1rem",
        l: "1.25rem",
        xl: "2rem",
        xxl: "3rem",
      },
      zIndex: {
        base: "1",
        hide: "-1",
        nav: "999",
        snackbar: "99999",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};

export default config;
