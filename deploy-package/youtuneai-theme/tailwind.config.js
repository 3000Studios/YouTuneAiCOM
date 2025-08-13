/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './*.php',
    './**/*.php',
    './assets/js/**/*.js',
    './assets/css/**/*.css'
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'display': ['Orbitron', 'system-ui', 'sans-serif'],
      },
      colors: {
        'youtune': {
          50: '#f0f9ff',
          500: '#3b82f6',
          900: '#1e3a8a',
        },
        'neon': {
          blue: '#00f0ff',
          purple: '#b000ff',
          pink: '#ff00aa',
        }
      },
      animation: {
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'bounce-slow': 'bounce 3s infinite',
      }
    },
  },
  plugins: [],
}