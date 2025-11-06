/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        amoled: {
          black: '#000000',
          white: '#FFFFFF',
          gray: {
            100: '#1A1A1A',
            200: '#2A2A2A',
            300: '#3A3A3A',
            400: '#4A4A4A',
          }
        }
      }
    },
  },
  plugins: [],
}