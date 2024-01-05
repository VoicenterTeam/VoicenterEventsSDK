/* eslint-env node */
module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    extends: [
        '@voicenter-team/ts',
        'plugin:jest/recommended'
    ],
    env: {
        browser: true
    },
    rules: {
        'no-dupe-class-members': 'off'
    }
}
