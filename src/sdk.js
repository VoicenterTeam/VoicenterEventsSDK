import io from 'socket.io-client/socket.io'
import eventTypes from './eventTypes'
const defaultOptions = {
  url: 'https://monitor5.voicenter.co.il/',
  timeout: 10000,
  token: null
}
class EventsSDK {
  constructor(options = {}) {
    this.options = {
      ...defaultOptions,
      ...options,
    }
    if (!this.options.url) {
      throw new Error('Server url is required in order to create a connection')
    }
    if (!this.options.token) {
      throw new Error('A token property should be provided')
    }
    this.socket = io(this.options.url)
  }

  _onConnect(data) {
    console.log("CONNECT", data)
  }

  _onDisconnect(data) {
    console.log("DISCONNECT", data)
  }

  _parsePacket(packet) {
    if (!packet.data) {
      return {}
    }
    let name = packet.data[0]
    let data = packet.data[1]
    return {
      name,
      data
    }
  }

  on(eventName, callback) {
   this.socket.onevent = (packet) => {
     if (!packet.data) {
       return
     }
     let evt = this._parsePacket(packet)
     if (eventName === '*') {
       callback(evt)
     } else if (evt.name === eventName) {
       callback(evt)
     }
   }
  }

  /**
   * Login
   * @param data
   */
  login() {
    return new Promise((resolve, reject) => {
      let resolved = false
      this.socket.onevent = (packet) => {
        if (!packet.data) {
          return
        }
        let { name, data } = this._parsePacket(packet)
        if (name === eventTypes.LOGIN) {
          resolve(data)
        }
      }
      this.socket.emit('login', { token: this.options.token })
      setTimeout(() => {
        if (!resolved) {
          reject('Login call timed out. Please try again')
        }
      }, this.options.timeout)
    })
  }

}

export default EventsSDK
