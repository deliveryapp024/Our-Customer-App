/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './App.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        // Primary - Cyan accent from designs
        primary: {
          DEFAULT: '#00E5FF',
          50: '#E0FCFF',
          100: '#B8F8FF',
          200: '#7AF2FF',
          300: '#3DEBFF',
          400: '#00E5FF',
          500: '#00B8CC',
          600: '#008A99',
          700: '#005C66',
          800: '#002E33',
          900: '#001719',
        },
        // Background colors (dark theme)
        background: {
          DEFAULT: '#000000',
          secondary: '#1A1A1A',
          card: '#2A2A2A',
        },
        // Text colors
        text: {
          primary: '#FFFFFF',
          secondary: '#9E9E9E',
          muted: '#6B6B6B',
        },
        // Status colors
        success: '#00C853',
        warning: '#FFB300',
        error: '#FF5252',
      },
      fontFamily: {
        sans: ['Inter', 'System'],
      },
    },
  },
  plugins: [],
};
