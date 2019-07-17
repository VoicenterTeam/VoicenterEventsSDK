module.exports = {
  input: 'src/index.js',
  output: {
    format: ['esm', 'cjs', 'umd-min'],
    moduleName: 'VoicenterEventsSDK',
    fileName({ format }) {
      return `voicenter-events-sdk.${format}.js`
    }
  },
  externals: ['socket.io-client'],
  globals: {
    'socket.io-client': 'io'
  }
};
