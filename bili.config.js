function getDistName (input) {
  return input.includes('extension-sdk') ? 'ext-voicenter-events-sdk': 'voicenter-events-sdk'
}

module.exports = {
  input: ["src/versions/sdk.js", "src/versions/extension-sdk.js"],
  presets: ['bili/babel'],
  output: {
    format: ['esm', 'cjs', 'umd-min'],
    moduleName: 'VoicenterEventsSDK',
  },
  extendRollupConfig: config => {
    const distName = getDistName(config.inputConfig.input[0])
    config.outputConfig.entryFileNames = `${distName}.${config.outputConfig.format}.js`
    return config
  },
  externals: ['socket.io-client', 'socket.io-client/socket.io'],
  globals: {
    'socket.io-client': 'io'
  }
};
