import eventTypes from './eventTypes';
import { defaultServers } from './config';
import Logger from './Logger';
import debounce from 'lodash/debounce'
import handleStoreEvents from './store/handleStoreEvents'
import extensionsModule from './store/extensions'
import queuesModule from './store/queues'
import { getServerWithHighestPriority, isValidDate } from './utils';
import { externalLogin, refreshToken, getExternalLoginUrl } from './utils/externalLogin';
import { loadExternalScript } from './utils/loadExternalScript'
import md5 from "js-md5";


const defaultOptions = {
  url: `https://monitorapi.voicenter.co.il/monitorAPI/getMonitorUrls`,
  fallbackServer: {
    Domain: 'monitor5.voicenter.co.il',
    Priority: 0,
  },
  loginUrl: 'https://loginapi.voicenter.co.il/monitorAPI/Login',
  refreshTokenUrl: 'https://loginapi.voicenter.co.il/monitorAPI/RefreshIdentityToken',
  servers: defaultServers,
  token: null,
  loginType: 'token',
  forceNew: true,
  reconnectionDelay: 10000,
  reconnectionDelayMax: 10000,
  maxReconnectAttempts: 2,
  timeout: 10000,
  keepAliveTimeout: 60000,
  idleInterval: 60000 * 5, // 5 minutes
  protocol: 'https',
  transports: ['websocket'],
  upgrade: false,
  store: null,
  extensionsModuleName: 'sdkExtensions',
  queuesModuleName: 'sdkQueues',
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
    if (!this.options.loginType) {
      throw new Error('A login type should be provided');
    }
    this.Logger = new Logger(this.options);
    this.servers = [];
    this.server = null;
    this.socket = null;
    this.connected = false;
    this.connectionEstablished = false;
    this._lastEventTimestamp = new Date().getTime();
    this._initReconnectOptions();
    this._listenersMap = listenersMap;
    this._retryConnection = debounce(this._connect.bind(this), this.reconnectOptions.reconnectionDelay, {
      leading: true,
      trailing: false
    });
    this._lastLoginTimestamp = null;
    this._handleLocalEvents = false;
    this._registerExtensionsModule();
    this._registerQueueModule();
  }

  getLastEventTimestamp() {
    return this._lastEventTimestamp
  }
  _reSync () {
    this.emit(eventTypes.RESYNC, {
      cache: false
    });
  }
  _registerExtensionsModule() {
    const moduleName = this.options.extensionsModuleName || 'sdkExtensions'
    if (!this._validateStoreModule(moduleName)) {
      return
    }
    this.options.store.registerModule(moduleName, extensionsModule)
    this._handleLocalEvents = true
  }

  _registerQueueModule() {
    const moduleName = this.options.queuesModuleName || 'sdkQueues'
    if (!this._validateStoreModule(moduleName)) {
      return
    }
    this.options.store.registerModule(moduleName, queuesModule)
    this._handleLocalEvents = true
  }

  _validateStoreModule(moduleName) {
    const { store } = this.options
    if (!store) {
      return false
    }
    if (store.state[moduleName]) {
      store.unregisterModule(moduleName)
    }
    return true
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
      this._lastEventTimestamp = new Date().getTime()
    } else {
      this._initSocketConnection();
    }
  }

  async _onLoginResponse(data) {
    if (data.Client) {
      await loadExternalScript(data.Client)
    }
    if (data.URL) {
      this.server = {
        Priority: 0,
        Domain: data.URL.replace('https://', '')
      }
    }
    if (data.URLList && Array.isArray(data.URLList)) {
      this.servers = data.URLList.map((url, index) => {
        return {
          Priority: index,
          Domain: url.replace('https://', '')
        }
      })
    }
    if (data.Token) {
      this.options.token = data.Token;
      this.token = data.Token
      await this._connect('default', true)
    }

    if (data.RefreshToken) {
      this.options.refreshToken = data.RefreshToken
      this._handleTokenExpiry()
    }
    if (data.TokenExpiry) {
      this.options.tokenExpiry = data.TokenExpiry
    }
  }

  _handleTokenExpiry() {
    const date = new Date(this.options.tokenExpiry)
    if (!isValidDate(date)) {
      return
    }
    const timeout = date.getTime() - new Date().getTime() - 5000 // 5 seconds before expire
    setTimeout(async () => {
      const res = await refreshToken(this.options.refreshTokenUrl, this.options.refreshToken)
      await this._onLoginResponse(res)
    }, timeout)
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

  async _connect(server = 'default', skipLogin = false) {
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
    if (skipLogin) {
      return
    }
    await this.login(this.options.loginType)
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
    const options = {
      ...this.options,
      debug: false
    }
    if (this.token) {
      options.query = {
        token: this.token
      }
    }
    this.socket = window.io(url, options);
    allConnections.push(this.socket);
    this.connectionEstablished = true;
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
    this.keepAliveInterval = setInterval(async () => {
      const now = new Date().getTime()
      const delta = this.options.keepAliveTimeout * 2

      if (now > this.getLastEventTimestamp() + delta) {
        await this._connect('next', true)
        return
      }
      if (!this.socket) {
        this._initSocketConnection();
        return
      }
      if (now > this.getLastEventTimestamp() + this.options.keepAliveTimeout) {
        this.emit(eventTypes.KEEP_ALIVE, this.options.token);
      }

    }, this.options.keepAliveTimeout);

    this.idleInterval = setInterval(() => {
      this.reSync(false)
    }, this.options.idleInterval)
  }

  _findCurrentServer() {
    let server = null;
    if (this.servers.length) {
      server = this.servers[0];
    }
    this.server = server;
    if (!this.server) {
      this.server = this.options.fallbackServer
    }
    return this.server;
  }

  _findNextAvailableServer() {
    let currentServerPriority = this.server.Priority;
    this.Logger.log(`Failover -> Trying to find another server`);
    if (currentServerPriority === this.servers.length - 1) {
      return this._findMaxPriorityServer()
    }
    let nextServerPriority = currentServerPriority + 1
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
    return null
  }

  _findMaxPriorityServer() {
    this.Logger.log(`Fallback -> Trying to find previous server`, '_findMaxPriorityServer');
    let maxPriorityServer = getServerWithHighestPriority(this.servers);
    if (!this.server) {
      this.server = maxPriorityServer;
      return this.server
    }
    if (this.server && maxPriorityServer.Domain !== this.server.Domain) {
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
    }
  }

  _onEvent(packet) {
    if (!packet.data) {
      return;
    }
    let evt = this._parsePacket(packet);
    this.Logger.log(`New event -> ${evt.name}`, evt);
    this._lastEventTimestamp = new Date().getTime()
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
      [eventTypes.EXTENSION_UPDATED]: this._reSync,
      [eventTypes.QUEUES_UPDATED]: this._reSync,
      [eventTypes.DIALERS_UPDATED]: this._reSync,
      [eventTypes.LOGIN_STATUS]: () => {
        if (!this.connected) {
          this._onConnect()
        }
      }
    };
    const eventHandler = eventMappings[evt.name];
    if (eventHandler && typeof eventHandler === 'function') {
      eventHandler.call(this, evt.data);
    }
    if (this._handleLocalEvents) {
      handleStoreEvents({
        eventData: evt,
        ...this.options
      });
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
      this.emit(eventTypes.CLOSE);
    }
    await this._getToken();
    await this._getTabsSession();
    await this.login(this.options.loginType)
    await this._getServers();
    return true;
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

  _getToken() {
    const { loginType } = this.options
    this.token = this.options.token;
    if (loginType === 'token') {
      if (!this.token) {
        throw new Error('Token login type expects the token option to be provided');
      }
    }
  }
  _getTabsSession(){
      if (!window.sessionStorage.length) {
        // Ask other tabs for session storage
        localStorage.setItem('getSessionStorage', Date.now());
      };
      window.addEventListener('storage', (event) => {
        //console.log('storage event', event);
        if (event.key == 'getSessionStorage') {
          // Some tab asked for the sessionStorage -> send it
          localStorage.setItem('sessionStorage', JSON.stringify(window.sessionStorage));
          localStorage.removeItem('sessionStorage');
        } else if (event.key == 'sessionStorage' && !sessionStorage.length) {
          // sessionStorage is empty -> fill it
          var data = JSON.parse(event.newValue),
                value;
          for (let key in data) {
            window.sessionStorage.setItem(key, data[key]);
          }
        }
      })
      return new Promise(resolve => setTimeout((resolve), 500))
  }

  /**
   * Login (logs in based on the token/credentials provided)
   * @param type (login type. Can be token/user/code/account)
   * @return {Promise<void>}
   */
  login(type = 'token') {
    // throttle login for 1 second
    let payload = {
      token: this.options.token,
      email: this.options.email,
      username: this.options.username,
      password: this.options.password
    }
    let key = md5(JSON.stringify(payload))
    const delay = 1000;
    if (this._lastLoginTimestamp + delay > new Date().getTime()) {
      return Promise.resolve()
    }
    this._lastLoginTimestamp = new Date().getTime()  
    return new Promise(async (resolve, reject) => {
      try{     
        let loginSession = window.sessionStorage.getItem(key);
        if(loginSession){
          loginSession = JSON.parse(loginSession)
          this.Logger.log('got data from session', loginSession);
          await this._onLoginResponse(loginSession)
          return resolve(loginSession);
        }
      }catch(err){
        this.Logger.log('Error on getting session',err)
      }
      try {
        let url = getExternalLoginUrl(this.options.loginUrl, type)
        const res = await externalLogin(url,payload)
        await this._onLoginResponse(res)
        
        window.sessionStorage.setItem(key, JSON.stringify(res));

        resolve(res)
      } catch (err) {
        this.servers = this.argumentOptions.servers || defaultServers;
        reject(err)
      }
    });
  }

}

export default EventsSDK;
