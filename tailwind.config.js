let defaultTheme = require('tailwindcss/defaultTheme')
module.exports = {
    theme: {
        extend: {
            colors: {
                primary: {
                    default: 'var(--primary-color)',
                    100: 'var(--primary-color-opacity)'
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
                montserrat: ['Montserrat', 'sans-serif'],
                mono: ['Roboto Mono', 'monospace']
            },
            boxShadow: {
                default: '0 10px 20px 0 rgba(209, 213, 223, 0.25)'
            },
            minWidth: {
                16: '4rem'
            },
            spacing: {
                9: '2.25rem',
                14: '3.5rem',
                18: '4.5rem'
            },
            fontSize: {
                'main-xs': 'var(--font-size-xs)',
                'main-sm': 'var(--font-size-sm)',
                'main-base': 'var(--font-size-base)',
                'main-lg': 'var(--font-size-lg)',
                'main-xl': 'var(--font-size-xl)',
                'main-2xl': 'var(--font-size-2xl)'
            },
            screens: {
                xs: 0,
                sm: '640px',
                md: '769px',
                lg: '1024px',
                xl: '1280px',
            },
        }
    },
    variants: {},
    plugins: []
}
