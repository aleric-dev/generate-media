/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        'space-mono': ['"Space Mono"', 'monospace'],
        'jetbrains': ['"JetBrains Mono"', 'monospace'],
        'inter': ['Inter', 'sans-serif'],
        'roboto': ['Roboto', 'sans-serif'],
        'outfit': ['Outfit', 'sans-serif'],
        'plus-jakarta': ['"Plus Jakarta Sans"', 'sans-serif'],
        'syne': ['Syne', 'sans-serif'],
        'courier-prime': ['"Courier Prime"', 'monospace']
      }
    },
  },
  plugins: [],
}
