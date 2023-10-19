/* eslint-env node */
module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    extends: '@voicenter-team/ts',
    rules: {
        semi: [ 'error', 'always' ],
    },
    env: {
        browser: true
    }
};
