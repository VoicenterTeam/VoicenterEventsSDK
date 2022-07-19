import EventsSDK from "../sdk"
import s1_3_7 from "../helpers/socketLibrary/s1_3_7";
import {AsyncStorageLogger} from "@voicenter-team/socketio-storage-logger/build/AsyncStorageLogger"

EventsSDK.prototype['initLogger'] = function () {
  const loggerSocket = s1_3_7.call(self)(this.options.loggerServer, this.options.loggerConnectOptions)

  this.Logger = new AsyncStorageLogger({
    socketConnection: loggerSocket,
    ...this.options.loggerConfig
  })
}

export default EventsSDK
