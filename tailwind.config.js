/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts,scss,css}', './index.html'],
  plugins: [require('tailwindcss-primeui')],
  theme: {
    screens: {
      xs: '410px',
      sm: '576px',
      md: '768px',
      lg: '992px',
      xl: '1200px',
      '2xl': '1920px'
    }
  }
};
