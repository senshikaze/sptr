/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    colors: {
      'blue': '#1fb6ff',
      'purple': '#7e5bef',
      'pink': '#ff49db',
      'orange': '#ff7849',
      'green': '#13ce66',
      'yellow': '#ffc82c',
      'gray-dark': '#07090a',
      'gray': '#8492a6',
      'gray-light': '#d3dce6',
      'white': '#ffffff',
      'teal': '#008080',
      'teal-300': '#001f1f',
      'teal-800': '#23a1a1',
      'black': '#000000',
      'light-red': '#de4567',
      'dark-red': '#982334',
      'gray-hover': '#344354',
      'red': '#af3237',
      'gray-600': '#8492a6',
      'yellow-light': '#d6dc71',
      'yellow-dark': '#9f480c',
    },
    minHeight: {
      '1/2': '50%',
      '1/3': '33%',
      '1/5': '20%',
      '3/4': '75%',
      '2/5': '40%',
      '1/4': '25%',
    },
    maxHeight: {
      '5/6': '83%'
    },
    extend: {
      animation: {
        'fade-out': 'fadeOut 2s ease-out 5s',
        'fade-in': 'fadeIn 2s ease-in',
      },
      keyFrames: {
        fadeOut: {
          '0%': { opacity: 1 },
          '100%': { opacity: 0 }
        },
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 }
        }
      },
    },
  },
  plugins: [],
}

