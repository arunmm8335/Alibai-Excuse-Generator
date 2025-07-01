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
          "primary": "#8ab4f8",
          "secondary": "#a855f7",
          "accent": "#10b981",
          "neutral": "#e8eaed",
          "base-100": "#202124",
          "base-200": "#2d2e31",
          "base-300": "#3c4043",
          "info": "#3abff8",
          "success": "#36d399",
          "warning": "#fbbd23",
          "error": "#f87272",

          // --- UPDATED: More pronounced rounded corners ---
          "--rounded-box": "1rem",      // For cards, chat bubbles, etc.
          "--rounded-btn": "0.8rem",      // For all buttons
          "--rounded-badge": "1.9rem",  // For badges
        },
      },
    ],
  },
}