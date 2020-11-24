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
                    default: 'var(--primary-color)',
                    50: 'var(--primary-color-opacity-50)',
                    100: 'var(--primary-color-opacity)',
                    200: 'var(--primary-color-opacity-200)',
                    300: 'var(--primary-color-opacity-300)',
                },
                steel: {
                    default: 'var(--steel)',
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
                },
                blue: {
                    ...defaultTheme.colors.blue,
                    default: '#2575FF',
                },
                red: {
                    ...defaultTheme.colors.red,
                    default: '#ff6060',
                    focus: 'var(--red-focus)',
                },
                green: {
                    ...defaultTheme.colors.green,
                    default: '#7ED321',
                    main: '#7ED321',
                },
                orange: {
                    ...defaultTheme.colors.orange,
                    350: 'var(--orange-350)',
                },
            },
            fontFamily: {
                montserrat: ['Montserrat', 'sans-serif'],
                mono: ['Roboto Mono', 'monospace'],
            },
            boxShadow: {
                default: '0 10px 20px 0 rgba(209, 213, 223, 0.25)',
                'base': '0px 0px 5px #E0E2E5',
            },
            minWidth: {
                16: '4rem',
                screen: '100vw',
            },
            maxWidth: {
                ...defaultTheme.maxWidth,
                40: '10rem',
                56: '14rem',
                '50-p': '50%',
                '65-p': '65%',
                '90-p': '90%',
            },
            minHeight: {
                ...defaultTheme.minHeight,
                22: '5.25rem',
            },
            maxHeight: {
                ...defaultTheme.maxHeight,
                8: '2rem',
                64: '16rem',
                75: '18.75rem',
                91: '22.75rem',
            },
            spacing: {
                '0-25': '0.0625rem',
                '0-5': '0.125rem',
                '1-5': '0.375rem',
                '2-5': '0.5625rem',
                '2-5-5': '0.6875rem',
                '4-5': '1.125rem',
                '5': '1.4375rem',
                '6-5': '1.625rem',
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
                35: '8.75rem',
                37: '9.0625rem',
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
                md: '769px',
                lg: '1024px',
                xl: '1280px',
            },
            lineHeight: {
                ...defaultTheme.lineHeight,
                21: '1.3125rem',
            },
        },
    },
    variants: {},
    plugins: [],
}
