const version = '__VERSION__'
import sdk from './versions/sdk'
if (typeof window !== 'undefined') {
  // Make it available on window
  window.EventsSDK = sdk
}

export default sdk
