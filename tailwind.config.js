let defaultTheme = require('tailwindcss/defaultTheme')
module.exports = {
  theme: {
    extend: {
      colors: {
        gray: {
          ...defaultTheme.colors.gray,
          500: '#899398'
        },
        blue: {
          ...defaultTheme.colors.blue,
          default: '#2575FF'
        }
      },
      fontFamily: {
        montserrat: ['Montserrat', 'sans-serif']
      },
      boxShadow: {
        default: '0 10px 20px 0 rgba(209, 213, 223, 0.25)'
      }
    }
  },
  variants: {},
  plugins: []
}
