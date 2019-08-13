module.exports = {
  input: 'src/index.js',
  presets: ['bili/babel'],
  output: {
    format: ['esm', 'cjs', 'umd-min'],
    moduleName: 'VoicenterEventsSDK',
    fileName({ format }) {
      return `voicenter-events-sdk.${format}.js`
    }
  },
  externals: ['socket.io-client', 'socket.io-client/socket.io'],
  globals: {
    'socket.io-client': 'io'
  }
};
