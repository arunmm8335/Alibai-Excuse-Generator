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
        cyberpunk: {
          "primary": "#ff0080",
          "secondary": "#00ffff",
          "accent": "#ffff00",
          "neutral": "#1a1a1a",
          "base-100": "#000000",
          "base-200": "#0a0a0a",
          "base-300": "#1a1a1a",
          "base-content": "#ffffff",
          "info": "#00ffff",
          "success": "#00ff00",
          "warning": "#ffff00",
          "error": "#ff0000",

          "--rounded-box": "0.5rem",
          "--rounded-btn": "0.25rem",
          "--rounded-badge": "1rem",
        },
        synthwave: {
          "primary": "#e779c1",
          "secondary": "#58c7f3",
          "accent": "#f3cc30",
          "neutral": "#20134e",
          "base-100": "#2d1b69",
          "base-200": "#1a103f",
          "base-300": "#0f0a23",
          "base-content": "#f9f7fd",
          "info": "#53c0f3",
          "success": "#71ead2",
          "warning": "#f3cc30",
          "error": "#e24056",

          "--rounded-box": "1rem",
          "--rounded-btn": "0.5rem",
          "--rounded-badge": "1.9rem",
        },
      },
    ],
  },
}