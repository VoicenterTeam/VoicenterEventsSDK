const version = '__VERSION__'
import sdk from './sdk'

export default sdk

if (typeof window !== 'undefined') {
  // Make it available on window
  window.voicenteEventsSDK = sdk
}
