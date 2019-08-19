const version = '__VERSION__'
import sdk from './sdk'
if (typeof window !== 'undefined') {
  // Make it available on window
  window.EventsSDK = sdk
}

export default sdk

export eventTypes from './eventTypes';
export serverTypes from './serverTypes';
