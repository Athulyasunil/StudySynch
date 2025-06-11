// frontend/postcss.config.js

// Use ES module export syntax instead of CommonJS 'module.exports'
// Turbopack expects this when resolving configuration files in certain contexts.
export default {
  plugins: {
    // This has been updated to use the dedicated PostCSS plugin package for Tailwind CSS.
    // '@tailwindcss/postcss' processes the @tailwind directives in your CSS files.
    '@tailwindcss/postcss': {},
    // 'autoprefixer' automatically adds vendor prefixes to CSS rules
    // (e.g., -webkit-, -moz-) for cross-browser compatibility.
    autoprefixer: {},
  },
};
