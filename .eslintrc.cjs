/* eslint-env node */
module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    ignorePatterns: [ 'dist', 'node_modules', 'docs' ],
    extends: [
        '@voicenter-team/ts',
        'plugin:jest/recommended'
    ],
    env: {
        browser: true,
        webextensions: true,
    },
    rules: {
        'no-dupe-class-members': 'off'
    }
}
