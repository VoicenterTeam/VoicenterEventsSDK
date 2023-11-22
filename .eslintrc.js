/* eslint-env node */
module.exports = {
    root: true,
    plugins: [
        '@typescript-eslint'
    ],
    extends: [
        'plugin:@typescript-eslint/recommended',
        'plugin:jest/recommended',
        'eslint:recommended'
    ],
    rules: {
        '@typescript-eslint/ban-ts-comment': [ 'error' ],
        '@typescript-eslint/no-unused-vars': 'error',
        'no-unused-vars': 'off',
        'no-debugger': 'off',
        'no-console': 'off',
        'no-redeclare': 'off',
        '@typescript-eslint/no-redeclare': [ 'error' ],
        semi: [ 'error', 'never' ],
        quotes: [ 'error', 'single' ],
        'object-curly-spacing': [ 'error', 'always' ],
        'array-bracket-spacing': [ 'error', 'always' ],
        'space-before-function-paren': [ 'error', 'always' ],
        '@typescript-eslint/no-var-requires': 0,
        indent: [ 'error', 4, { SwitchCase: 1 } ],
        'quote-props': [ 'error', 'as-needed' ],
        'object-property-newline': [ 'error' ],
        'key-spacing': [ 'error', { afterColon: true } ],
        'object-curly-newline': [ 'error', {
            ObjectExpression: {
                multiline: true,
                consistent: true
            },
            ObjectPattern: { multiline: true },
            ExportDeclaration: {
                multiline: true,
                minProperties: 3
            }
        } ]
    },
    env: {
        es2021: true,
        node: true
    }
}