const version = '__VERSION__'
import sdk from './sdk'
if (typeof window !== 'undefined') {
  // Make it available on window
  window.voicenteEventsSDK = sdk
}

export default sdk
