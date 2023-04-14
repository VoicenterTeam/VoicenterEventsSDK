import EventsSDK from "../sdk"
import {getSocketIOFunction} from "../utils/loadExternalScript"
import {AsyncStorageLogger} from "@voicenter-team/socketio-storage-logger/build/AsyncStorageLogger"

EventsSDK.prototype['initLogger'] = function (url) {
  let loggerSocket
  if (this.options.loggerSocketConnection) {
    loggerSocket = this.options.loggerSocketConnection
  } else {
    loggerSocket = getSocketIOFunction(url)(this.options.loggerServer, this.options.loggerConnectOptions)
  }

  this.Logger = new AsyncStorageLogger({
    socketConnection: loggerSocket,
    ...this.options.loggerConfig
  })
}

export default EventsSDK
