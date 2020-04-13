import eventTypes from '../eventTypes';

export const sdkEventReasons = {
  NEWCALL: 'NEWCALL',
  ANSWER: 'ANSWER',
  HANGUP: 'HANGUP'
}
const offlineEvents = [
  eventTypes.CONNECT_ERROR,
  eventTypes.CONNECT_TIMEOUT,
  eventTypes.DISCONNECT,
  eventTypes.RECONNECT_ATTEMPT,
  eventTypes.RECONNECTING,
  eventTypes.RECONNECT_ERROR,
  eventTypes.RECONNECT_FAILED,
  sdkEventReasons.CLOSE
]
function isSocketOffline(event) {
  let { name } = event
  return offlineEvents.includes(name)
}

export default function onNewEvent({ eventData, store, extensionsModuleName }) {
  let {name, data} = eventData
  store.commit(`${extensionsModuleName}/SET_IS_SOCKET_OFFLINE`, isSocketOffline(eventData))
  switch (name) {
    case eventTypes.ALL_EXTENSION_STATUS:
      store.dispatch(`${extensionsModuleName}/setExtensions`, data.extensions)
      break;
    case eventTypes.EXTENSION_EVENT:
      let extension = data.data
      // Event reason: NEWCALL/ANSWER/HANGUP
      extension['lastEvent'] = {
        reason: data.reason,
        ivrid: data.ivruniqueid
      }
      const extensions = store.state[extensionsModuleName].extensions
      let index = extensions.findIndex(e => e.userID === extension.userID)
      if (index !== -1) {
        store.dispatch(`${extensionsModuleName}/updateExtension`, {index, extension})
      }
      break;
    case eventTypes.LOGIN_STATUS:
      store.commit(`${extensionsModuleName}/SET_SERVER_TIME`, data)
      break;
    default:
      break;
  }
}
