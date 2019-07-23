let defaultTheme = require('tailwindcss/defaultTheme')
module.exports = {
    theme: {
        extend: {
            colors: {
                primary: {
                    default: 'var(--primary-color)'
                },
                secondary: {
                    default: 'var(--secondary-color)'
                },
                gray: {
                    ...defaultTheme.colors.gray,
                    500: '#899398'
                },
                blue: {
                    ...defaultTheme.colors.blue,
                    default: '#2575FF'
                },
                red: {
                    ...defaultTheme.colors.red,
                    default: '#ff6060'
                },
                green: {
                    ...defaultTheme.colors.green,
                    default: '#7ed321'
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
