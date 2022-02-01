const colors = require('./src/assets/tailwind/colors.js')

let defaultTheme = require('tailwindcss/defaultTheme')
module.exports = {
    purge: [
        './src/**/*.html',
        './src/**/*.vue',
        './src/**/*.jsx',
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    ...defaultTheme.colors.blue,
                    DEFAULT: 'var(--primary-color)',
                    'base': 'var(--primary-color)',
                    50: 'var(--primary-color-opacity-50)',
                    100: 'var(--primary-color-opacity)',
                    200: 'var(--primary-color-opacity-200)',
                    300: 'var(--primary-color-opacity-300)',
                },
                steel: {
                    DEFAULT: 'var(--steel)',
                },
                gray: {
                    ...defaultTheme.colors.gray,
                    150: 'var(--gray-150)',
                    200: 'var(--gray-200)',
                    300: 'var(--gray-300)',
                    350: 'var(--gray-350)',
                    400: 'var(--gray-400)',
                    500: 'var(--cool-grey)',
                    550: 'var(--gray-550)',
                    650: 'var(--gray-650)',
                    900: 'var(--gray-900)',
                    950: 'var(--gray-950)',
                    light: 'var(--gray-light)',
                    DEFAULT: 'var(--gray-400)',
                    border: 'var(--gray-550)'
                },
                blue: {
                    ...defaultTheme.colors.blue,
                    DEFAULT: '#2575FF',
                },
                red: {
                    ...defaultTheme.colors.red,
                    DEFAULT: '#ff6060',
                    focus: 'var(--red-focus)',
                },
                green: {
                    ...defaultTheme.colors.green,
                    DEFAULT: '#7ED321',
                    main: '#7ED321',
                },
                orange: {
                    ...defaultTheme.colors.orange,
                    350: 'var(--orange-350)',
                },
                ...colors
            },
            borderColor: {
                ...colors
            },
            fill: {
                ...colors
            },
            stroke: {
                ...colors
            },
            fontFamily: {
                montserrat: ['Montserrat', 'sans-serif'],
                mono: ['Roboto Mono', 'monospace'],
            },
            boxShadow: {
                DEFAULT: '0 10px 20px 0 rgba(209, 213, 223, 0.25)',
                base: '0px 0px 5px #E0E2E5',
                light: '0px 1px 6px #D1D5DF',
                lighter: '0px 0px 5px #D8D8D8',
                radio: '0px 0px 5px var(--primary)'
            },
            minWidth: {
                ...defaultTheme.spacing,
                ...defaultTheme.minWidth,
                16: '4rem',
                '2xl': '42rem',
                '3xl': '48rem',
                '4xl': '56rem',
                '5xl': '64rem',
                '6xl': '72rem',
                '7xl': '80rem',
                screen: '100vw',
            },
            maxWidth: {
                ...defaultTheme.spacing,
                ...defaultTheme.maxWidth,
                40: '10rem',
                45: '12.5',
                56: '14rem',
                '50-p': '50%',
                '65-p': '65%',
                '90-p': '90%',
            },
            minHeight: {
                ...defaultTheme.spacing,
                ...defaultTheme.minHeight,
                22: '5.25rem',
                20: '5rem',
                40: '10rem',
                41: '10.5rem',
            },
            maxHeight: {
                ...defaultTheme.spacing,
                ...defaultTheme.maxHeight,
                8: '2rem',
                28: '7rem',
                40: '10rem',
                56: '14rem',
                64: '16rem',
                75: '18.75rem',
                91: '22.75rem',
                '65vh':'65vh'
            },
            spacing: {
                '0-25': '0.0625rem',
                '0-5': '0.125rem',
                '3px': '0.1875rem',
                '1-25': '0.3125rem',
                '1-5': '0.375rem',
                '2-5': '0.5625rem',
                '2-5-5': '0.6875rem',
                '4-5': '1.125rem',
                '5': '1.4375rem',
                5.5: '1.375rem',
                '6-5': '1.625rem',
                '6-6': '1.6875rem',
                7: '1.875rem',
                9: '2.25rem',
                13: '3.3125rem',
                14: '3.5rem',
                18: '4.5rem',
                22: '5.25rem',
                '23-5': '5.5rem',
                23: '5.875rem',
                28: '7rem',
                29: '7.25rem',
                30: '7.5rem',
                35: '8.75rem',
                37: '9.0625rem',
                38: '9.375rem',
                39: '9.875rem',
                75: '18.75rem',
                91: '22.75rem',
            },
            fontSize: {
                'main-xs': 'var(--font-size-xs)',
                'main-sm': 'var(--font-size-sm)',
                'main-base': 'var(--font-size-base)',
                'main-lg': 'var(--font-size-lg)',
                'main-xl': 'var(--font-size-xl)',
                'main-2xl': 'var(--font-size-2xl)',
                'main-3xl': 'var(--font-size-3xl)',
            },
            screens: {
                xs: 0,
                sm: '640px',
                md: '760px',
                lg: '1024px',
                xl: '1280px',
                '2xl': '1380px',
                '3xl': '1441px',
            },
            lineHeight: {
                ...defaultTheme.lineHeight,
                21: '1.3125rem',
            },
            zIndex: {
                ...defaultTheme.zIndex,
                999999: 999999,
            },
            borderRadius: {
                ...defaultTheme.borderRadius,
                '4xl': '2rem',
            },
            height: {
                7.5: '2.125rem'
            },
            width: {
                22.7: '5.75rem',
                70: '17.5rem',
                100: '30rem',
            }
        },
    },
    variants: {},
    plugins: [],
}
