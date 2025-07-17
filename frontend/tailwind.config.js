/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [require("daisyui")],

  daisyui: {
    themes: [
      "light",
      {
        aiStudio: {
          "primary": "#6366f1",
          "secondary": "#8b5cf6",
          "accent": "#06b6d4",
          "neutral": "#f8fafc",
          "base-100": "#0f172a",
          "base-200": "#1e293b",
          "base-300": "#334155",
          "base-content": "#f1f5f9",
          "info": "#0ea5e9",
          "success": "#10b981",
          "warning": "#f59e0b",
          "error": "#ef4444",

          // Modern rounded corners
          "--rounded-box": "1.5rem",
          "--rounded-btn": "1rem",
          "--rounded-badge": "2rem",

          // Custom shadows for depth
          "--shadow": "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          "--shadow-lg": "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        },
        blackout: {
          "primary": "#222222",
          "secondary": "#333333",
          "accent": "#444444",
          "neutral": "oklch(0 0 0)",
          "base-100": "oklch(0 0 0)",
          "base-200": "oklch(0 0 0)",
          "base-300": "oklch(0 0 0)",
          "base-content": "#ffffff",
          "info": "#3b82f6",
          "success": "#22c55e",
          "warning": "#f59e0b",
          "error": "#ef4444",
          "--rounded-box": "1.2rem",
          "--rounded-btn": "0.8rem",
          "--rounded-badge": "1.5rem",
          "--shadow": "0 8px 32px 0 rgba(0,0,0,0.85)",
          "--shadow-lg": "0 20px 25px -5px rgba(0,0,0,0.9), 0 10px 10px -5px rgba(0,0,0,0.7)",
        },
      },
    ],
  },
}
