const colors = require('tailwindcss/colors');

module.exports = {
  content: ['./src/renderer/**/*.{js,jsx,ts,tsx,ejs}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        sky: colors.sky,
        cyan: colors.cyan,
      },
      fontFamily: {
        sans: [
          'InterVar',
          {
            fontVariationSettings: '"opsz" 32',
          },
        ],
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
