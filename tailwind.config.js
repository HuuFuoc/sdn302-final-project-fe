/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        primary: {
          DEFAULT: "#1A8FE3",
          50: "#e8f4fc",
          100: "#d1e9f9",
          200: "#a3d3f3",
          300: "#75bded",
          400: "#47a7e7",
          500: "#1A8FE3",
          600: "#1572b6",
          700: "#105588",
          800: "#0a395b",
          900: "#051c2d",
        },
        secondary: {
          DEFAULT: "#6610F2",
          50: "#efe6fc",
          100: "#dfcdf9",
          200: "#bf9bf3",
          300: "#9f69ed",
          400: "#7f37e7",
          500: "#6610F2",
          600: "#520dc2",
          700: "#3d0a91",
          800: "#290661",
          900: "#140330",
        },
        accent: {
          DEFAULT: "#F17105",
          foreground: "#ffffff",
          50: "#fef3e8",
          100: "#fde7d1",
          200: "#fbcfa3",
          300: "#f9b775",
          400: "#f79f47",
          500: "#F17105",
        },
        fun: {
          DEFAULT: "#E6C229",
          foreground: "#1f2937",
          50: "#fdf9e6",
          100: "#fbf3cd",
          200: "#f7e79b",
          300: "#f3db69",
          400: "#efcf37",
          500: "#E6C229",
        },
        strong: {
          DEFAULT: "#D11149",
          foreground: "#ffffff",
          50: "#fce8ee",
          100: "#f9d1dd",
          200: "#f3a3bb",
          300: "#ed7599",
          400: "#e74777",
          500: "#D11149",
        },
        muted: {
          DEFAULT: "#f1f5f9",
          foreground: "#64748b",
        },
        destructive: {
          DEFAULT: "#ef4444",
          foreground: "#ffffff",
        },
      },
      borderRadius: {
        lg: "1rem",
        md: "0.75rem",
        sm: "0.5rem",
        xl: "1.25rem",
        "2xl": "1.5rem",
        "3xl": "2rem",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [],
}