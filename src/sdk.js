import io from 'socket.io-client/socket.io';
import eventTypes from './eventTypes';
import { defaultServers } from './config';
import Logger from './Logger';
import debounce from 'lodash/debounce'
import { getServerWithHighestPriority } from './utils';

const defaultOptions = {
  url: `https://monitorapi.voicenter.co.il/monitorAPI/getMonitorUrls`,
  servers: defaultServers,
  token: null,
  forceNew: true,
  reconnectionDelay: 10000,
  reconnectionDelayMax: 10000,
  maxReconnectAttempts: 2,
  timeout: 10000,
  keepAliveTimeout: 60000,
  idleTimeout: 60000 * 5, // 5 minutes
  protocol: 'https',
  transports: ['websocket'],
  upgrade: false,
  serverFetchStrategy: 'remote', // get servers from external url options: remote | static
  serverType: null, // can be 1 or 2. 2 is used for chrome extension
};

let allConnections = [];
let listenersMap = new Map();
class EventsSDK {
  constructor(options = {}) {
    this.options = {
      ...defaultOptions,
      ...options,
    };
    this.argumentOptions = {
      ...options
    }
    if (!this.options.token) {
      throw new Error('A token property should be provided');
    }
    this.Logger = new Logger(this.options);
    this.servers = [];
    this.server = null;
    this.socket = null;
    this.connected = false;
    this.connectionEstablished = false;
    this.lastKeepAliveTimestamp = new Date().getTime()
    this._initReconnectOptions();
    this._listenersMap = listenersMap;
    this._retryConnection = debounce(this._connect.bind(this), this.reconnectOptions.reconnectionDelay, { leading: true, trailing: false })
    this._loginEventTriggered = false
    this._lastLoginTimestamp = null
    this._lastPong = null
  }

  _initReconnectOptions() {
    this.reconnectOptions = {
      retryCount: 1,
      maxReconnectAttempts: this.options.maxReconnectAttempts,
      reconnectionDelay: this.options.reconnectionDelay, // 10 seconds. After each re-connection attempt this number will increase (minReconnectionDelay * attempts) => 10, 20, 30, 40 seconds ... up to 5min
      minReconnectionDelay: this.options.reconnectionDelay, // 10 seconds
      maxReconnectionDelay: 60000 * 5 // 5 minutes
    }
  }

  _onConnect() {
    this._initReconnectDelays();
    this.connected = true;
    this.Logger.log(eventTypes.CONNECT, this.reconnectOptions);
  }

  _initReconnectDelays() {
    this.reconnectOptions.retryCount = 1;
    let minReconnectDelay = this.reconnectOptions.minReconnectionDelay;
    this.reconnectOptions.reconnectionDelay = minReconnectDelay;
    this.socket.io.reconnectionDelay(minReconnectDelay);
    this.socket.io.reconnectionDelayMax(minReconnectDelay);
  }

  _onConnectError(data) {
    this._retryConnection('next');
    this.connected = false;
    this.Logger.log(eventTypes.CONNECT_ERROR, data)
  }

  _onError(err) {
    this.Logger.log(eventTypes.ERROR, err);
  }

  _onReconnectFailed() {
    this._retryConnection('next');
    this.Logger.log(eventTypes.RECONNECT_FAILED, this.reconnectOptions);
  }

  _onConnectTimeout() {
    this._retryConnection('next');
    this.Logger.log(eventTypes.CONNECT_TIMEOUT, this.reconnectOptions)
  }

  _onReconnectAttempt() {
    if (this.reconnectOptions.retryCount >= this.reconnectOptions.maxReconnectAttempts) {
      this._retryConnection('next');
      return;
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

  _onDisconnect(reason) {
    this.connected = false;
    this.Logger.log(eventTypes.DISCONNECT, reason);
    this._connect('next')
  }

  _onKeepAlive(data) {
    if (typeof data === 'object' && data.errorCode !== 0) {
      this._initSocketConnection();
      return
    }
    if (data && this.connected) {
      this.Logger.log(eventTypes.KEEP_ALIVE_RESPONSE);
      this.lastKeepAliveTimestamp = new Date().getTime()
    } else {
      this._initSocketConnection();
    }
  }

  _onLoginResponse(data) {
    if (data.ErrorCode === 0 && data.Token && !this.options.token) {
      this.options.token = data.Token
    }
  }

  _onPong() {
    this._lastPong = new Date().getTime()
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
    let serverToConnect = null;
    if (server === 'default') {
      serverToConnect = this._findCurrentServer();
    } else if (server === 'next') {
      serverToConnect = this._findNextAvailableServer()
    } else if (server === 'prev') {
      serverToConnect = this._findMaxPriorityServer()
    } else {
      throw new Error(`Incorrect 'server' parameter passed to connect function ${server}. Should be 'default' or 'next'`)
    }
    if (!serverToConnect) {
      this.server = this._findCurrentServer();
    }
    this._initSocketConnection();
    this._initSocketEvents();
    this._initKeepAlive();
    this._initReconnectDelays();
    this.login()
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
    this.Logger.log('Connecting to..', url);
    this.closeAllConnections();
    this.socket = io(url, {
      ...this.options,
      query: {
        token: this.options.token
      },
      debug: false
    });
    allConnections.push(this.socket);
    this.connectionEstablished = true;
    this._loginEventTriggered = false
  }

  _initSocketEvents() {
    this.socket.onevent = this._onEvent.bind(this)
  }

  _initKeepAlive() {
    if (this.keepAliveInterval) {
      clearInterval(this.keepAliveInterval)
    }

    if (this.idleInterval) {
      clearInterval((this.idleInterval))
    }
    this.keepAliveInterval = setInterval(()=>{
      const now = new Date().getTime()
      const maxDelay = this.options.keepAliveTimeout * 3
      // If keep alive timeout is 1 minute and we still don't get a response after 3 minutes, find another server
      if (now > this.lastKeepAliveTimestamp + maxDelay) {
        this._connect('next')
      }
      if (!this.socket) {
        this._initSocketConnection();
        return
      }
      this.emit(eventTypes.KEEP_ALIVE, this.options.token);
    }, this.options.keepAliveTimeout);

    this.idleInterval = setInterval(() => {
      this.reSync(false)
      // if we are idle for more time, try reconnecting
      if (this._lastPong + this.options.idleTimeout * 3 > new Date().getTime()) {
        this._connect('next')
      }
    }, this.options.idleTimeout)
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
    return this.server;
  }

  _findNextAvailableServer() {
    let currentServerPriority = this.server.Priority;
    this.Logger.log(`Failover -> Trying to find another server`);
    if (currentServerPriority > 0) {
      let nextServerPriority = currentServerPriority - 1;
      let nextServer = this.servers.find(server => server.Priority === nextServerPriority);
      if (!nextServer) {
        nextServer = this._findMaxPriorityServer();
        if (!nextServer) {
          return
        }
      }
      if (this.server.Domain !== nextServer.Domain) {
        this.server = nextServer;
        return this.server
      }
      this.Logger.log(`Failover -> Found new server. Connecting to it...`, this.server);
    }
    return null
  }

  _findMaxPriorityServer() {
    this.Logger.log(`Fallback -> Trying to find previous server`, '_findMaxPriorityServer');
    let maxPriorityServer = getServerWithHighestPriority(this.servers);
    if(this.server && maxPriorityServer.Domain !== this.server.Domain) {
      this.server = maxPriorityServer;
      this.Logger.log(`Fallback -> Trying to find previous server`, this.server);
      return this.server
    }
    return null
  }

  async _getServers() {
    // Ignore server fetch if we have a list of servers passed via options
    if (this.options.serverFetchStrategy === 'static' && this.argumentOptions.servers && Array.isArray(this.argumentOptions.servers) && this.argumentOptions.servers.length > 1) {
      this.servers = this.argumentOptions.servers
      return
    }
    try {
      let params = {};
      if (this.options.serverType) {
        params.type = this.options.serverType
      }
      let res = await fetch(`${this.options.url}/${this.options.token}`, params);
      this.servers = await res.json();
    } catch (e) {
      this.servers = this.argumentOptions.servers || defaultServers;
    }
  }

  _onEvent(packet) {
    if (!packet.data) {
      return;
    }
    let evt = this._parsePacket(packet);
    this.Logger.log(`New event -> ${evt.name}`, evt);
    this._listenersMap.forEach((callback, eventName) => {
      if (eventName === '*') {
        callback(evt);
      } else if (evt.name === eventName) {
        callback(evt);
      }
    })
    const eventMappings = {
      [eventTypes.RECONNECT_ATTEMPT]: this._onReconnectAttempt,
      [eventTypes.RECONNECT_FAILED]: this._onReconnectFailed,
      [eventTypes.CONNECT]: this._onConnect,
      [eventTypes.DISCONNECT]: this._onDisconnect,
      [eventTypes.ERROR]: this._onError,
      [eventTypes.CONNECT_ERROR]: this._onConnectError,
      [eventTypes.CONNECT_TIMEOUT]: this._onConnectTimeout,
      [eventTypes.KEEP_ALIVE_RESPONSE]: this._onKeepAlive,
      [eventTypes.LOGIN_RESPONSE]: this._onLoginResponse,
      [eventTypes.PONG]: this._onPong,
      [eventTypes.EXTENSION_UPDATED]: this._retryConnection,
      [eventTypes.QUEUES_UPDATED]: this._retryConnection,
      [eventTypes.DIALERS_UPDATED]: this._retryConnection,
      [eventTypes.LOGIN_STATUS]: () => {
        if (!this.connected) {
          this._onConnect()
        }
      }
    }
    const eventHandler = eventMappings[evt.name]
    if (eventHandler && typeof eventHandler === 'function') {
      eventHandler.call(this, evt.data)
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
    if (this.socket) {
      this.emit(eventTypes.CLOSE)
    }
    await this._getServers();
    this._connect();
    this._initReconnectDelays();
    return true
  }

  /**
   * Sets the monitor code token
   * @param token
   */
  async setToken(token) {
    this.options.token = token
    this.disconnect()
    await this.init()
  }
  /**
   * Closes all existing connections
   */
  closeAllConnections() {
    allConnections.forEach(connection => {
      connection.close()
      connection.disconnect()
    })
    allConnections = []
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
    }
  }
  /**
   * Disconnects the socket instance from the servers
   */
  disconnect() {
    this._listenersMap = new Map();
    this.closeAllConnections()
  }

  /**
   * Listens for new events
   * @param {string} eventName (name of the event, * for all events)
   * @param {function} callback (callback function when even with the specified name is received)
   */
  on(eventName, callback) {
    this._listenersMap.set(eventName, callback);
    this._checkInit()
  }

  /**
   * Emits an event to the server
   * @param {string} eventName (name of the event)
   * @param {object} data (data for the event)
   */

  emit(eventName, data = {}) {
    this._checkInit();
    this.Logger.log(`EMIT -> ${eventName}`, data);
    this.socket.emit(eventName, data);
  }

  /**
   * Calls resync event to resync socket data
   * @param cache
   */
  reSync(cache = true) {
    this.emit(eventTypes.RESYNC, { cache })
  }

  async setMonitorUrl(url) {
    const oldUrl = this.options.url
    const oldStrategy = this.options.serverFetchStrategy
    try {
      if (!url) {
        return
      }
      this.options.url = url
      this.options.serverFetchStrategy = 'remote'
      await this.init()
    } catch (err) {
      this._onError(err)
      this.options.url = oldUrl
      this.options.serverFetchStrategy = oldStrategy
      await this.init()
    }
  }

  /**
   * Login (logs in based on the token/credentials provided)
   * @param type (login type. Can be token/user/code/account)
   * @return {Promise<void>}
   */
  login(type = 'login') {
    // throttle login for 1 second
    const delay = 1000
    if (this._lastLoginTimestamp + delay > new Date().getTime()) {
      return Promise.resolve()
    }
    let _self = this;
    this._checkInit();
    let resolved = false;
    this._lastLoginTimestamp = new Date().getTime()
    return new Promise((resolve, reject) => {
      this.on(eventTypes.LOGIN_STATUS, data => {
        if(_self.onLogin) _self.onLogin(data);
        resolved = true;
        resolve(data)
      });
      this.socket.on(eventTypes.ERROR, err => {
        if(_self.onError) _self.onError(err);
        if(resolved === false) {
          reject(err);
        }
      })
      if (type === 'login') {
        this.emit(eventTypes.LOGIN, { token: this.options.token });
      } else if (type === 'user') {
        this.emit(eventTypes.LOGIN_USER, { user: this.options.user, password: this.options.password });
      } else if (type === 'code') {
        this.emit(eventTypes.LOGIN_CODE, { code: this.options.code, orgCode: this.options.organizationCode });
      } else if (type === 'account') {
        this.emit(eventTypes.LOGIN_USER, { user: this.options.user, password: this.options.password });
      }
    });
  }

}

export default EventsSDK;
