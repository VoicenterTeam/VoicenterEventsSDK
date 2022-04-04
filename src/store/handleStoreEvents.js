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

export default function onNewEvent({ eventData, store, extensionsModuleName, queuesModuleName, dialersModuleName }) {
  let { name, data } = eventData
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
      let extensionIndex = extensions.findIndex(e => e.userID === extension.userID)
      if (extensionIndex !== -1) {
        store.dispatch(`${extensionsModuleName}/updateExtension`, {
          index: extensionIndex,
          extension
        })
      }
      break;
    case eventTypes.LOGIN_STATUS:
      store.commit(`${extensionsModuleName}/SET_SERVER_TIME`, data)
      store.dispatch(`${queuesModuleName}/setQueues`, data.queues)
      break;
    case eventTypes.QUEUE_EVENT:
      let queue = data.data;
      const allQueues = store.state[queuesModuleName].all || []
      let queueIndex = allQueues.findIndex(e => e.QueueID === queue.QueueID)
      if (queueIndex !== -1) {
        store.dispatch(`${queuesModuleName}/updateQueue`, {
          index: queueIndex,
          queue
        })
      }
      break;
    case eventTypes.ALL_DIALERS_STATUS:
      store.dispatch(`${dialersModuleName}/setDialers`, data.dialers)
      break;
    case eventTypes.DIALER_EVENT:
      const dialers = [data.data];
      console.log(dialers, 'dialers')
      store.dispatch(`${dialersModuleName}/updateDialers`, dialers)
      break;
    default:
      break;
  }
}
