// tailwind.config.js

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Ensure all relevant files are scanned for Tailwind classes
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Montserrat', 'sans-serif'], // Define your custom font
      },
    },
  },
  plugins: [],
};
