import io from 'socket.io-client/socket.io';
import eventTypes from './eventTypes';
import { defaultServers } from './config';
import Logger from './Logger';
import debounce from 'lodash/debounce'

const defaultOptions = {
  url: `https://monitorapi.voicenter.co.il/monitorAPI/getMonitorUrls`,
  token: null,
  forceNew: true,
  reconnectionDelay: 10000,
  reconnectionDelayMax: 10000,
  timeout: 10000,
  keepAliveTimeout: 60000,
  protocol: 'https',
  transports: ['websocket']
};

class EventsSDK {
  constructor(options = {}) {
    this.options = {
      ...defaultOptions,
      ...options,
    };
    if (!this.options.token) {
      throw new Error('A token property should be provided');
    }
    this.Logger = new Logger(this.options);
    this.servers = [];
    this.server = null;
    this.socket = null;
    this.connected = false
    this.connectionEstablished = false;
    this._initReconnectOptions();
    this._retryConnection = debounce(this._connect.bind(this), this.reconnectOptions.reconnectionDelay, { leading: true, trailing: false })
  }

  _initReconnectOptions() {
    this.reconnectOptions = {
      retryCount: 1,
      reconnectionDelay: this.options.reconnectionDelay, // 10 seconds. After each re-connection attempt this number will increase (minReconnectionDelay * attempts) => 10, 20, 30, 40 seconds ... up to 5min
      minReconnectionDelay: this.options.reconnectionDelay, // 10 seconds
      maxReconnectionDelay: 60000 * 5 // 5 minutes
    }
  }
  _onConnect() {
    this._initReconnectDelays()
    this.connected = true
    this.Logger.log(eventTypes.CONNECT, this.reconnectOptions)
  }

  _initReconnectDelays() {
    this.reconnectOptions.retryCount = 1;
    let minReconnectDelay = this.reconnectOptions.minReconnectionDelay;
    this.reconnectOptions.reconnectionDelay = minReconnectDelay;
    this.socket.io.reconnectionDelay(minReconnectDelay);
    this.socket.io.reconnectionDelayMax(minReconnectDelay);
  }

  _onConnectError(data) {
    this._retryConnection('next')
    this.connected = false
    this.Logger.log(eventTypes.CONNECT_ERROR, data)
  }

  _onReconnectFailed() {
    this._retryConnection('next')
    this.Logger.log(eventTypes.RECONNECT_FAILED, this.reconnectOptions)
  }

  _onConnectTimeout() {
    this._retryConnection('next')
    this.Logger.log(eventTypes.CONNECT_TIMEOUT, this.reconnectOptions)
  }

  _onReconnectAttempt(attempts) {
    if (attempts > 2) {
      this._retryConnection('next')
      return
    }
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
    this._connect('next')
    this.connected = false
    this.Logger.log(eventTypes.DISCONNECT, this.reconnectOptions)
  }

  _onKeepAlive(data) {
    if(data === false && this.connected) {
      this._initSocketConnection()
      this.Logger.log(eventTypes.KEEP_ALIVE_RESPONSE, this.reconnectOptions)
    }
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

  _connect(server = 'default') {
    if (server === 'default') {
      this._findCurrentServer();
    } else if (server === 'next') {
      this._findNextAvailableServer()
    } else {
      throw new Error(`Incorrect 'server' parameter passed to connect function ${server}. Should be 'default' or 'next'`)
    }
    this._initSocketConnection();
    this._initSocketEvents();
    this._initKeepAlive();
  }

  _checkInit() {
     if (!this.connectionEstablished) {
       throw new Error('Make sure you call "sdk.init()" before doing other operations.')
     }
  }

  _initSocketConnection() {
    let domain = this.server.Domain;
    let protocol = this.options.protocol;
    let url = `${protocol}://${domain}`;
    this.Logger.log('Connecting to..', url)
    if (this.socket) {
      this.socket.disconnect()
    }
    this.socket = io(url, {
      ...this.options,
      debug: false
    });
    this.connectionEstablished = true;
  }

  _initSocketEvents() {
    this.socket.on(eventTypes.RECONNECT_ATTEMPT, this._onReconnectAttempt.bind(this));
    this.socket.on(eventTypes.RECONNECT_FAILED, this._onReconnectFailed.bind(this));
    this.socket.on(eventTypes.CONNECT, this._onConnect.bind(this));
    this.socket.on(eventTypes.DISCONNECT, this._onDisconnect.bind(this));
    this.socket.on(eventTypes.CONNECT_ERROR, this._onConnectError.bind(this));
    this.socket.on(eventTypes.CONNECT_TIMEOUT, this._onConnectTimeout.bind(this));
    this.socket.on(eventTypes.KEEP_ALIVE_RESPONSE, this._onKeepAlive.bind(this));
  }

  _initKeepAlive() {
    setTimeout(()=>{
      if(this.socket) {
        this.emit(eventTypes.KEEP_ALIVE, this.options.token);
      }
      else {
        this._initSocketConnection()
      }
      this._initKeepAlive();
    }, this.options.keepAliveTimeout);
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
    this.Logger.log(`Failover -> Trying to find another server`)
    if (currentServerPriority > 0) {
      let nextServerPriority = currentServerPriority - 1;
      let nextServer = this.servers.find(server => server.Priority === nextServerPriority);
      if (!nextServer) {
        let prevPriority = currentServerPriority + 1
        nextServer = this.servers.find(server => server.Priority === prevPriority);
        if (!nextServer) {
          return
        }
      }
      this.server = nextServer;
      this.Logger.log(`Failover -> Found new server. Connecting to it...`, this.server)
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

  /**
   * Initializes socket connection. Should be called before any other action
   * @return {Promise<boolean>}
   */
  async init() {
    if (this.connectionEstablished) {
      return true;
    }
    await this._getServers();
    this._connect()
    this._initReconnectDelays()
    return true
  }


  /**
   * Listens for new events
   * @param {string} eventName (name of the event, * for all events)
   * @param {function} callback (callback function when even with the specified name is received)
   */
  on(eventName, callback) {
    this._checkInit()
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

  /**
   * Emits an event to the server
   * @param {string} eventName (name of the event)
   * @param {object} data (data for the event)
   */

  emit(eventName, data) {
    this._checkInit()
    this.Logger.log(`EMIT -> ${eventName}`, data)
    this.socket.emit(eventName, data);
  }

  /**
   * Login (logs in based on the token/credentials provided)
   */
  login() {
    this._checkInit()
    let resolved = false
    return new Promise((resolve, reject) => {
      this.on(eventTypes.LOGIN, data => {
        resolved = true
        resolve(data)
      })
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
