import io from 'socket.io-client/socket.io';
import eventTypes from './eventTypes';
import { defaultServers } from './config';
import Logger from './Logger';

const defaultOptions = {
  url: `https://monitorapi.voicenter.co.il/monitorAPI/getMonitorUrls`,
  token: null,
  forceNew: true,
  reconnectionDelayMax: 10000,
  timeout: 10000,
  protocol: 'https'
};

class EventsSDK {
  constructor(options = {}) {
    this.options = {
      ...defaultOptions,
      ...options,
    };
    if (!this.options.url) {
      throw new Error('Server url is required in order to create a connection');
    }
    if (!this.options.token) {
      throw new Error('A token property should be provided');
    }
    this.Logger = new Logger(this.options);
    this.servers = [];
    this.server = null;
    this.socket = null;
    this.connectionEstablished = false;
    this.reconnectOptions = {
      retryCount: 1,
      reconnectionDelay: 10000, // 10 seconds. After each re-connection attempt this number will increase (minReconnectionDelay * attempts) => 10, 20, 30, 40 seconds ... up to 5min
      minReconnectionDelay: 10000, // 10 seconds
      maxReconnectionDelay: 60000 * 5 // 5 minutes
    };
  }

  _onConnect() {
    this.reconnectOptions.retryCount = 1;
    let minReconnectDelay = this.reconnectOptions.minReconnectionDelay;
    this.reconnectOptions.reconnectionDelay = minReconnectDelay;
    this.socket.io.reconnectionDelay(minReconnectDelay);
    this.socket.io.reconnectionDelayMax(minReconnectDelay);
    this.Logger.log(eventTypes.CONNECT, this.reconnectOptions)
  }

  _onConnectError() {
    this.Logger.log(eventTypes.CONNECT_ERROR, this.reconnectOptions)
  }

  _onReconnectAttempt() {
    if (this.reconnectOptions.reconnectionDelay < this.reconnectOptions.maxReconnectionDelay) {
      let newDelay = this.reconnectOptions.minReconnectionDelay * this.reconnectOptions.retryCount;
      this.reconnectOptions.reconnectionDelay = newDelay;
      this.socket.io.reconnectionDelay(newDelay);
      this.socket.io.reconnectionDelayMax(newDelay);
    }
    this.reconnectOptions.retryCount++;
    this.Logger.log(eventTypes.RECONNECT_ATTEMPT, this.reconnectOptions)
  }

  _onDisconnect() {
    this._findNextAvailableServer();
    this._initSocketConnection();
    this._initSocketEvents();
    this.Logger.log(eventTypes.DISCONNECT, this.reconnectOptions)
  }

  _parsePacket(packet) {
    if (!packet.data) {
      return {};
    }
    let name = packet.data[0];
    let data = packet.data[1];
    return {
      name,
      data
    };
  }

  async init() {
    if (this.connectionEstablished) {
      return;
    }
    await this._getServers();
    this._findCurrentServer();
    this._initSocketConnection();
    this._initSocketEvents();
  }

  _initSocketConnection() {
    let domain = this.server.Domain;
    let protocol = this.options.protocol;
    let url = `${protocol}://${domain}`;
    this.socket = io(url, {
      ...this.options,
      debug: false
    });
    this.connectionEstablished = true;
  }

  _initSocketEvents() {
    this.socket.on(eventTypes.RECONNECT_ATTEMPT, this._onReconnectAttempt.bind(this));
    this.socket.on(eventTypes.CONNECT, this._onConnect.bind(this));
    this.socket.on(eventTypes.CONNECT_ERROR, this._onConnectError.bind(this));
  }

  _findCurrentServer() {
    let server = null;
    if (this.servers.length) {
      server = this.servers[0];
    }
    this.server = server;
    if (!this.server) {
      throw new Error('Could not find any server to establish connection with');
    }
  }

  _findNextAvailableServer() {
    let currentServerPriority = this.server.Priority;
    if (currentServerPriority > 0) {
      let nextServerPriority = currentServerPriority - 1;
      let nextServer = this.servers.find(server => server.Priority === nextServerPriority);
      if (!nextServer) {
        return;
      }
      this.server = nextServer;
    }
  }

  async _getServers() {
    try {
      let res = await fetch(`${this.options.url}/${this.options.token}`);
      this.servers = await res.json();
    } catch (e) {
      this.servers = defaultServers;
    }
  }

  on(eventName, callback) {
    this.socket.onevent = (packet) => {
      if (!packet.data) {
        return;
      }
      let evt = this._parsePacket(packet);
      this.Logger.log(`New event -> ${evt.name}`, evt);
      if (eventName === '*') {
        callback(evt);
      } else if (evt.name === eventName) {
        callback(evt);
      }
    };
  }

  emit(eventName, data) {
    this.socket.emit(eventName, data);
  }

  /**
   * Login
   * @param data
   */
  login() {
    return new Promise((resolve, reject) => {
      this.on(eventTypes.LOGIN, data => {
        resolve(data)
      })
      this.Logger.log(`EMIT -> login`, this.reconnectOptions)
      this.emit('login', { token: this.options.token });
      this.socket.on(eventTypes.ERROR, err => {
        if(!resolved) {
          reject(err);
        }
      })
    });
  }

}

export default EventsSDK;
