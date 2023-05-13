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
      'black': '#000000',
      'light-red': '#de4567',
      'dark-red': '#982334',
      'gray-hover': '#344354',
    },
    extend: {
      animation: {
        fadeOut: 'fadeOut 2s ease-out',
      },
      keyFrames: theme => ({
        fadeOut: {
          '0%': {opacity: 1},
          '100%': {opacity: 0}
        },
      }),
    },
  },
  plugins: [],
}

