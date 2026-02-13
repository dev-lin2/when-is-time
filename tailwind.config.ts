import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: "hsl(var(--card))",
        cardForeground: "hsl(var(--card-foreground))",
        primary: "hsl(var(--primary))",
        primaryForeground: "hsl(var(--primary-foreground))",
        secondary: "hsl(var(--secondary))",
        secondaryForeground: "hsl(var(--secondary-foreground))",
        muted: "hsl(var(--muted))",
        mutedForeground: "hsl(var(--muted-foreground))",
        border: "hsl(var(--border))",
        ring: "hsl(var(--ring))",
        destructive: "hsl(var(--destructive))",
      },
      fontFamily: {
        display: ["'Space Grotesk'", "system-ui", "sans-serif"],
        body: ["'Manrope'", "system-ui", "sans-serif"],
        mono: ["'IBM Plex Mono'", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      backgroundImage: {
        "mesh-light":
          "radial-gradient(circle at 10% 20%, rgba(56, 189, 248, 0.20), transparent 32%), radial-gradient(circle at 85% 30%, rgba(251, 146, 60, 0.18), transparent 36%), radial-gradient(circle at 60% 80%, rgba(16, 185, 129, 0.16), transparent 32%)",
        "mesh-dark":
          "radial-gradient(circle at 10% 20%, rgba(14, 116, 144, 0.35), transparent 32%), radial-gradient(circle at 85% 30%, rgba(194, 65, 12, 0.28), transparent 36%), radial-gradient(circle at 60% 80%, rgba(5, 150, 105, 0.24), transparent 32%)",
      },
      animation: {
        "fade-up": "fade-up 600ms ease-out both",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
