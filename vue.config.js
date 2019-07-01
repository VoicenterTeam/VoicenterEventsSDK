let externals = {
  'socket.io-client': {
    commonjs: 'socket.io-client',
    commonjs2: 'socket.io-client',
    root: 'io'
  }
}
let isProd = process.env.NODE_ENV === 'production'
module.exports = {
  configureWebpack:  {
    externals: isProd ? externals : {}
  }
}
