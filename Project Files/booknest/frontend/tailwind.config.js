/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#6366f1',
        secondary: '#ec4899',
        'bg-dark': '#0f172a',
        'bg-card': '#1e293b',
        'text-main': '#f8fafc',
        'text-muted': '#94a3b8',
        border: '#334155',
      },
    },
  },
  plugins: [],
}
