const version = '__VERSION__'
const sdk = {
  msg: 'hello'
}

export default sdk

if (typeof window !== 'undefined') {
  // Make it available on window
  window.voicenteEventsSDK = sdk
}
