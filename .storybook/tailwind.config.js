/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ['./src/**/*.{ts,tsx}'],
  plugins: [
    // require('@tailwindcss/forms'),
    require('../src/tailwind')
  ],
}