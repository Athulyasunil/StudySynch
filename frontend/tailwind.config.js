// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1E3A8A',   // e.g., blue-800
        secondary: '#F59E0B', // e.g., amber-500
        tertiary: '#10B981',  // e.g., emerald-500
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
