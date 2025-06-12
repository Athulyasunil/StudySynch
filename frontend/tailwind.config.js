// tailwind.config.js

const config = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#0d9488',   // Teal
        secondary: '#0f766e', // Darker Teal
        tertiary: '#f3f4f6',  // Light Gray
      },
      borderRadius: {
        full: '9999px',
        xl: '1rem',
      },
    },
  },
  plugins: [],
};

export default config;
