import EventsSDK from "../sdk"
import {StorageLogger} from "@voicenter-team/socketio-storage-logger/build/StorageLogger"

EventsSDK.prototype['initLogger'] = function () {
  this.Logger = new StorageLogger({
    socketUrl: this.options.loggerServer,
    connectOptions: this.options.loggerConnectOptions,
    ...this.options.loggerConfig
  })
}

export default EventsSDK
