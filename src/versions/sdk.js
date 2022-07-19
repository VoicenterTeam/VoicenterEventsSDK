import EventsSDK from "../sdk"
import {StorageLogger} from "@voicenter-team/socketio-storage-logger/build/StorageLogger"

EventsSDK.prototype['initLogger'] = function () {
  const loggerInitOptions = { ...this.options.loggerConfig }

  if (this.options.loggerSocketConnection) {
    loggerInitOptions["socketConnection"] = this.options.loggerSocketConnection
  } else {
    loggerInitOptions["socketUrl"] = this.options.loggerServer
    loggerInitOptions["connectOptions"] = this.options.loggerConnectOptions
  }

  this.Logger = new StorageLogger(loggerInitOptions)
}

export default EventsSDK
