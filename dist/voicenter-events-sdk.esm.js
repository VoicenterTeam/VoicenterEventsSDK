import io from 'socket.io-client/socket.io';
import debounce from 'lodash/debounce';

function _typeof(obj) {
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function (obj) {
      return typeof obj;
    };
  } else {
    _typeof = function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

var eventTypes = {
  LOGIN_STATUS: 'loginStatus',
  LOGIN: 'login',
  LOGIN_USER: 'loginUser',
  LOGIN_CODE: 'loginUserCode',
  LOGIN_ACCOUNT: 'loginAccount',
  LOGIN_RESPONSE: 'loginResponse',
  QUEUE_EVENT: 'QueueEvent',
  QUEUES_UPDATED: 'QueuesUpdated',
  DIALERS_UPDATED: 'DialersUpdated',
  EXTENSION_EVENT: 'ExtensionEvent',
  EXTENSION_UPDATED: 'ExtensionsUpdated',
  ALL_EXTENSION_STATUS: 'AllExtensionsStatus',
  CONNECT_ERROR: 'connect_error',
  CONNECT_TIMEOUT: 'connect_timeout',
  DISCONNECT: 'disconnect',
  PONG: 'pong',
  RECONNECT: 'reconnect',
  RECONNECT_ATTEMPT: 'reconnect_attempt',
  RESYNC: 'resync',
  RECONNECTING: 'reconnecting',
  RECONNECT_ERROR: 'reconnect_error',
  RECONNECT_FAILED: 'reconnect_failed',
  KEEP_ALIVE: 'keepalive',
  KEEP_ALIVE_RESPONSE: 'keepaliveResponse',
  CLOSE: 'closeme',
  ERROR: 'error'
};

var defaultServers = [{
  'URLID': 59,
  'Priority': 5,
  'Version': 2,
  'Domain': 'monitor1.voicenter.co'
}, {
  'URLID': 3,
  'Priority': 4,
  'Version': 2,
  'Domain': 'monitor3.voicenter.co.il'
}, {
  'URLID': 4,
  'Priority': 3,
  'Version': 2,
  'Domain': 'monitor4.voicenter.co.il'
}, {
  'URLID': 11,
  'Priority': 2,
  'Version': 2,
  'Domain': 'monitor11.voicenter.co'
}, {
  'URLID': 5,
  'Priority': 0,
  'Version': 2,
  'Domain': 'monitor5.voicenter.co.il'
}];

var Logger =
/*#__PURE__*/
function () {
  function Logger() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Logger);

    this.debug = options.debug;
  }
  /**
   * Logs to console a colored message
   * @param message
   * @param data
   * @private
   */


  _createClass(Logger, [{
    key: "_log",
    value: function _log(message, data) {
      var toLog = data ? "".concat(message, ", %c Data -> ").concat(JSON.stringify(data)) : "".concat(message);
      var now = new Date().toUTCString();
      console.log("%c ".concat(now, ": %c ").concat(toLog), "color: #276749;", "color: #4299e1;", "color: #2c3e50;");
    }
    /**
     * Logs to console a colored message
     * @param message
     * @param data
     * @private
     */

  }, {
    key: "_error",
    value: function _error(message, data) {
      var toLog = data ? "".concat(message, ", Data -> ").concat(JSON.stringify(data)) : "".concat(message);
      var now = new Date().toUTCString();
      console.error("".concat(now, ": ").concat(toLog));
    }
    /**
     * Logs messages in case debug mode is set
     * @param message
     * @param data
     */

  }, {
    key: "log",
    value: function log(message, data) {
      if (this.debug) {
        if (message && !data) {
          this._log(message);
        } else {
          this._log(message, data);
        }
      }
    }
    /**
     * Logs error messages in case debug mode is set
     * @param message
     * @param data
     */

  }, {
    key: "error",
    value: function error(message, data) {
      if (this.debug) {
        if (message && !data) {
          this._error(message);
        } else {
          this._error(message, data);
        }
      }
    }
  }]);

  return Logger;
}();

var sdkEventReasons = {
  NEWCALL: 'NEWCALL',
  ANSWER: 'ANSWER',
  HANGUP: 'HANGUP'
};
var offlineEvents = [eventTypes.CONNECT_ERROR, eventTypes.CONNECT_TIMEOUT, eventTypes.DISCONNECT, eventTypes.RECONNECT_ATTEMPT, eventTypes.RECONNECTING, eventTypes.RECONNECT_ERROR, eventTypes.RECONNECT_FAILED, sdkEventReasons.CLOSE];

function isSocketOffline(event) {
  var name = event.name;
  return offlineEvents.includes(name);
}

function onNewEvent(_ref) {
  var eventData = _ref.eventData,
      store = _ref.store,
      extensionsModuleName = _ref.extensionsModuleName;
  debugger;
  var name = eventData.name,
      data = eventData.data;
  store.commit('extensions/SET_IS_SOCKET_OFFLINE', isSocketOffline(eventData));

  switch (name) {
    case eventTypes.ALL_EXTENSION_STATUS:
      store.dispatch('extensions/setExtensions', data.extensions);
      break;

    case eventTypes.EXTENSION_EVENT:
      var extension = data.data; // Event reason: NEWCALL/ANSWER/HANGUP

      extension['lastEvent'] = {
        reason: data.reason,
        ivrid: data.ivruniqueid
      };
      var extensions = store.state[extensionsModuleName].extensions;
      var index = extensions.findIndex(function (e) {
        return e.userID === extension.userID;
      });

      if (index !== -1) {
        store.dispatch('extensions/updateExtension', {
          index: index,
          extension: extension
        });
      }

      break;

    case eventTypes.LOGIN:
      store.commit('extensions/SET_SERVER_TIME', data);
      break;

    default:
      break;
  }
}

var callStatuses = {
  CALLING: 100,
  HOLD: 101
};

var _mutations;
var ISRAEL_TIMEZONE_OFFSET = 180 * 60 * 1000;
var MINUTE = 60 * 1000;
var LOGOUT_STATUS = 2;
var HOLD_STATUS = 'hold';
var types = {
  SET_EXTENSIONS: 'SET_EXTENSIONS',
  UPDATE_EXTENSIONS: 'UPDATE_EXTENSIONS',
  SET_SERVER_TIME: 'SET_SERVER_TIME',
  SET_IS_SOCKET_OFFLINE: 'SET_IS_SOCKET_OFFLINE'
};
var state = {
  extensions: [],
  serverTime: null,
  serverDelta: 0,
  serverOffset: 0,
  isSocketOffline: false,
  offlineSocketTimestamp: null
};
var mutations = (_mutations = {}, _defineProperty(_mutations, types.SET_EXTENSIONS, function (state, value) {
  state.extensions = value;
}), _defineProperty(_mutations, types.UPDATE_EXTENSIONS, function (state, _ref) {
  var index = _ref.index,
      extension = _ref.extension;
  state.extensions.splice(index, 1, extension);
}), _defineProperty(_mutations, types.SET_SERVER_TIME, function (state, value) {
  state.serverOffset = value.servertimeoffset * 60 * 1000 || ISRAEL_TIMEZONE_OFFSET;
  state.serverTime = value.servertime * 1000 - state.serverOffset;
  state.serverDelta = new Date().getTime() - state.serverTime;
}), _defineProperty(_mutations, types.SET_IS_SOCKET_OFFLINE, function (state, value) {
  state.isSocketOffline = value;

  if (value) {
    state.offlineSocketTimestamp = new Date().getTime();
  } else {
    state.offlineSocketTimestamp = null;
  }
}), _mutations);
var actions = {
  setExtensions: async function setExtensions(_ref2, value) {
    var commit = _ref2.commit;
    commit(types.SET_EXTENSIONS, value);
  },
  updateExtension: async function updateExtension(_ref3, value) {
    var commit = _ref3.commit;
    commit(types.UPDATE_EXTENSIONS, value);
  }
};
var getters = {
  isSocketOffline: function isSocketOffline(state) {
    if (!state.offlineSocketTimestamp || isNaN(state.offlineSocketTimestamp)) {
      return false;
    }

    var now = new Date().getTime(); // show after 1 minute of disconnect

    return state.isSocketOffline && now - state.offlineSocketTimestamp > MINUTE;
  },
  extensionsWithCalls: function extensionsWithCalls(state) {
    return function (hideLoggedOutUsers) {
      var groupedExtensions = [];
      state.extensions.forEach(function (extension) {
        if (extension.calls.length > 0) {
          if (extension.calls.filter(function (call) {
            return call.answered && call.callstatus === HOLD_STATUS;
          }).length) {
            extension['representativeStatus'] = callStatuses.HOLD;
          } else {
            extension['representativeStatus'] = callStatuses.CALLING;
          }
        }

        groupedExtensions.push(extension);
      });

      if (hideLoggedOutUsers) {
        return groupedExtensions.filter(function (e) {
          return e.representativeStatus !== LOGOUT_STATUS;
        });
      }

      return groupedExtensions;
    };
  },
  extensionCountByStatus: function extensionCountByStatus(state, getters) {
    return function (status) {
      return getters.extensionWithCalls.filter(function (el) {
        return el.representativeStatus === status;
      }).length || 0;
    };
  }
};
var extensionsModule = {
  namespaced: true,
  state: state,
  mutations: mutations,
  actions: actions,
  getters: getters
};

function getServerWithHighestPriority(servers) {
  var chosenServer = null;
  var maxPriority = -1;
  servers.forEach(function (server) {
    if (server.Priority > maxPriority) {
      maxPriority = server.Priority;
      chosenServer = server;
    }
  });
  return chosenServer;
}

var defaultOptions = {
  url: "https://monitorapi.voicenter.co.il/monitorAPI/getMonitorUrls",
  servers: defaultServers,
  token: null,
  forceNew: true,
  reconnectionDelay: 10000,
  reconnectionDelayMax: 10000,
  maxReconnectAttempts: 2,
  timeout: 10000,
  keepAliveTimeout: 60000,
  idleTimeout: 60000 * 5,
  // 5 minutes
  protocol: 'https',
  transports: ['websocket'],
  upgrade: false,
  store: null,
  extensionsModuleName: 'sdkExtensions',
  serverFetchStrategy: 'remote',
  // get servers from external url options: remote | static
  serverType: null // can be 1 or 2. 2 is used for chrome extension

};
var allConnections = [];
var listenersMap = new Map();

var EventsSDK =
/*#__PURE__*/
function () {
  function EventsSDK() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, EventsSDK);

    this.options = Object.assign({}, defaultOptions, {}, options);
    this.argumentOptions = Object.assign({}, options);

    if (!this.options.token) {
      throw new Error('A token property should be provided');
    }

    this.Logger = new Logger(this.options);
    this.servers = [];
    this.server = null;
    this.socket = null;
    this.connected = false;
    this.connectionEstablished = false;
    this.lastKeepAliveTimestamp = new Date().getTime();

    this._initReconnectOptions();

    this._listenersMap = listenersMap;
    this._retryConnection = debounce(this._connect.bind(this), this.reconnectOptions.reconnectionDelay, {
      leading: true,
      trailing: false
    });
    this._loginEventTriggered = false;
    this._lastLoginTimestamp = null;
    this._lastPong = null;
    this._handleLocalEvents = false;

    this._registerExtensionsModule();
  }

  _createClass(EventsSDK, [{
    key: "_registerExtensionsModule",
    value: function _registerExtensionsModule() {
      var store = this.options.store;

      if (!store) {
        return;
      }

      var moduleName = this.options.extensionsModuleName || 'sdkExtensions';
      store.registerModule(moduleName, extensionsModule);
      this._handleLocalEvents = true;
    }
  }, {
    key: "_initReconnectOptions",
    value: function _initReconnectOptions() {
      this.reconnectOptions = {
        retryCount: 1,
        maxReconnectAttempts: this.options.maxReconnectAttempts,
        reconnectionDelay: this.options.reconnectionDelay,
        // 10 seconds. After each re-connection attempt this number will increase (minReconnectionDelay * attempts) => 10, 20, 30, 40 seconds ... up to 5min
        minReconnectionDelay: this.options.reconnectionDelay,
        // 10 seconds
        maxReconnectionDelay: 60000 * 5 // 5 minutes

      };
    }
  }, {
    key: "_onConnect",
    value: function _onConnect() {
      this._initReconnectDelays();

      this.connected = true;
      this.Logger.log(eventTypes.CONNECT, this.reconnectOptions);
    }
  }, {
    key: "_initReconnectDelays",
    value: function _initReconnectDelays() {
      this.reconnectOptions.retryCount = 1;
      var minReconnectDelay = this.reconnectOptions.minReconnectionDelay;
      this.reconnectOptions.reconnectionDelay = minReconnectDelay;
      this.socket.io.reconnectionDelay(minReconnectDelay);
      this.socket.io.reconnectionDelayMax(minReconnectDelay);
    }
  }, {
    key: "_onConnectError",
    value: function _onConnectError(data) {
      this._retryConnection('next');

      this.connected = false;
      this.Logger.log(eventTypes.CONNECT_ERROR, data);
    }
  }, {
    key: "_onError",
    value: function _onError(err) {
      this.Logger.log(eventTypes.ERROR, err);
    }
  }, {
    key: "_onReconnectFailed",
    value: function _onReconnectFailed() {
      this._retryConnection('next');

      this.Logger.log(eventTypes.RECONNECT_FAILED, this.reconnectOptions);
    }
  }, {
    key: "_onConnectTimeout",
    value: function _onConnectTimeout() {
      this._retryConnection('next');

      this.Logger.log(eventTypes.CONNECT_TIMEOUT, this.reconnectOptions);
    }
  }, {
    key: "_onReconnectAttempt",
    value: function _onReconnectAttempt() {
      if (this.reconnectOptions.retryCount >= this.reconnectOptions.maxReconnectAttempts) {
        this._retryConnection('next');

        return;
      }

      if (this.reconnectOptions.reconnectionDelay < this.reconnectOptions.maxReconnectionDelay) {
        var newDelay = this.reconnectOptions.minReconnectionDelay * this.reconnectOptions.retryCount;
        this.reconnectOptions.reconnectionDelay = newDelay;
        this.socket.io.reconnectionDelay(newDelay);
        this.socket.io.reconnectionDelayMax(newDelay);
      }

      this.reconnectOptions.retryCount++;
      this.Logger.log(eventTypes.RECONNECT_ATTEMPT, this.reconnectOptions);
    }
  }, {
    key: "_onDisconnect",
    value: function _onDisconnect(reason) {
      this.connected = false;
      this.Logger.log(eventTypes.DISCONNECT, reason);

      this._connect('next');
    }
  }, {
    key: "_onKeepAlive",
    value: function _onKeepAlive(data) {
      if (_typeof(data) === 'object' && data.errorCode !== 0) {
        this._initSocketConnection();

        return;
      }

      if (data && this.connected) {
        this.Logger.log(eventTypes.KEEP_ALIVE_RESPONSE);
        this.lastKeepAliveTimestamp = new Date().getTime();
      } else {
        this._initSocketConnection();
      }
    }
  }, {
    key: "_onLoginResponse",
    value: function _onLoginResponse(data) {
      if (data.ErrorCode === 0 && data.Token && !this.options.token) {
        this.options.token = data.Token;
      }
    }
  }, {
    key: "_onPong",
    value: function _onPong() {
      this._lastPong = new Date().getTime();
    }
  }, {
    key: "_parsePacket",
    value: function _parsePacket(packet) {
      if (!packet.data) {
        return {};
      }

      var name = packet.data[0];
      var data = packet.data[1];
      return {
        name: name,
        data: data
      };
    }
  }, {
    key: "_connect",
    value: function _connect() {
      var server = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'default';
      var serverToConnect = null;

      if (server === 'default') {
        serverToConnect = this._findCurrentServer();
      } else if (server === 'next') {
        serverToConnect = this._findNextAvailableServer();
      } else if (server === 'prev') {
        serverToConnect = this._findMaxPriorityServer();
      } else {
        throw new Error("Incorrect 'server' parameter passed to connect function ".concat(server, ". Should be 'default' or 'next'"));
      }

      if (!serverToConnect) {
        this.server = this._findCurrentServer();
      }

      this._initSocketConnection();

      this._initSocketEvents();

      this._initKeepAlive();

      this._initReconnectDelays();

      this.login();
    }
  }, {
    key: "_checkInit",
    value: function _checkInit() {
      if (!this.connectionEstablished) {
        throw new Error('Make sure you call "sdk.init()" before doing other operations.');
      }
    }
  }, {
    key: "_initSocketConnection",
    value: function _initSocketConnection() {
      var domain = this.server.Domain;
      var protocol = this.options.protocol;
      var url = "".concat(protocol, "://").concat(domain);
      this.Logger.log('Connecting to..', url);
      this.closeAllConnections();
      this.socket = io(url, Object.assign({}, this.options, {
        query: {
          token: this.options.token
        },
        debug: false
      }));
      allConnections.push(this.socket);
      this.connectionEstablished = true;
      this._loginEventTriggered = false;
    }
  }, {
    key: "_initSocketEvents",
    value: function _initSocketEvents() {
      this.socket.onevent = this._onEvent.bind(this);
    }
  }, {
    key: "_initKeepAlive",
    value: function _initKeepAlive() {
      var _this = this;

      if (this.keepAliveInterval) {
        clearInterval(this.keepAliveInterval);
      }

      if (this.idleInterval) {
        clearInterval(this.idleInterval);
      }

      this.keepAliveInterval = setInterval(function () {
        var now = new Date().getTime();
        var maxDelay = _this.options.keepAliveTimeout * 3; // If keep alive timeout is 1 minute and we still don't get a response after 3 minutes, find another server

        if (now > _this.lastKeepAliveTimestamp + maxDelay) {
          _this._connect('next');
        }

        if (!_this.socket) {
          _this._initSocketConnection();

          return;
        }

        _this.emit(eventTypes.KEEP_ALIVE, _this.options.token);
      }, this.options.keepAliveTimeout);
      this.idleInterval = setInterval(function () {
        _this.reSync(false); // if we are idle for more time, try reconnecting


        if (_this._lastPong + _this.options.idleTimeout * 3 > new Date().getTime()) {
          _this._connect('next');
        }
      }, this.options.idleTimeout);
    }
  }, {
    key: "_findCurrentServer",
    value: function _findCurrentServer() {
      var server = null;

      if (this.servers.length) {
        server = this.servers[0];
      }

      this.server = server;

      if (!this.server) {
        throw new Error('Could not find any server to establish connection with');
      }

      return this.server;
    }
  }, {
    key: "_findNextAvailableServer",
    value: function _findNextAvailableServer() {
      var currentServerPriority = this.server.Priority;
      this.Logger.log("Failover -> Trying to find another server");

      if (currentServerPriority > 0) {
        var nextServerPriority = currentServerPriority - 1;
        var nextServer = this.servers.find(function (server) {
          return server.Priority === nextServerPriority;
        });

        if (!nextServer) {
          nextServer = this._findMaxPriorityServer();

          if (!nextServer) {
            return;
          }
        }

        if (this.server.Domain !== nextServer.Domain) {
          this.server = nextServer;
          return this.server;
        }

        this.Logger.log("Failover -> Found new server. Connecting to it...", this.server);
      }

      return null;
    }
  }, {
    key: "_findMaxPriorityServer",
    value: function _findMaxPriorityServer() {
      this.Logger.log("Fallback -> Trying to find previous server", '_findMaxPriorityServer');
      var maxPriorityServer = getServerWithHighestPriority(this.servers);

      if (this.server && maxPriorityServer.Domain !== this.server.Domain) {
        this.server = maxPriorityServer;
        this.Logger.log("Fallback -> Trying to find previous server", this.server);
        return this.server;
      }

      return null;
    }
  }, {
    key: "_getServers",
    value: async function _getServers() {
      // Ignore server fetch if we have a list of servers passed via options
      if (this.options.serverFetchStrategy === 'static' && this.argumentOptions.servers && Array.isArray(this.argumentOptions.servers) && this.argumentOptions.servers.length > 1) {
        this.servers = this.argumentOptions.servers;
        return;
      }

      try {
        var params = {};

        if (this.options.serverType) {
          params.type = this.options.serverType;
        }

        var res = await fetch("".concat(this.options.url, "/").concat(this.options.token), params);
        this.servers = await res.json();
      } catch (e) {
        this.servers = this.argumentOptions.servers || defaultServers;
      }
    }
  }, {
    key: "_onEvent",
    value: function _onEvent(packet) {
      var _this2 = this,
          _eventMappings;

      if (!packet.data) {
        return;
      }

      var evt = this._parsePacket(packet);

      this.Logger.log("New event -> ".concat(evt.name), evt);

      this._listenersMap.forEach(function (callback, eventName) {
        if (eventName === '*') {
          callback(evt);
        } else if (evt.name === eventName) {
          callback(evt);
        }
      });

      var eventMappings = (_eventMappings = {}, _defineProperty(_eventMappings, eventTypes.RECONNECT_ATTEMPT, this._onReconnectAttempt), _defineProperty(_eventMappings, eventTypes.RECONNECT_FAILED, this._onReconnectFailed), _defineProperty(_eventMappings, eventTypes.CONNECT, this._onConnect), _defineProperty(_eventMappings, eventTypes.DISCONNECT, this._onDisconnect), _defineProperty(_eventMappings, eventTypes.ERROR, this._onError), _defineProperty(_eventMappings, eventTypes.CONNECT_ERROR, this._onConnectError), _defineProperty(_eventMappings, eventTypes.CONNECT_TIMEOUT, this._onConnectTimeout), _defineProperty(_eventMappings, eventTypes.KEEP_ALIVE_RESPONSE, this._onKeepAlive), _defineProperty(_eventMappings, eventTypes.LOGIN_RESPONSE, this._onLoginResponse), _defineProperty(_eventMappings, eventTypes.PONG, this._onPong), _defineProperty(_eventMappings, eventTypes.EXTENSION_UPDATED, this._retryConnection), _defineProperty(_eventMappings, eventTypes.QUEUES_UPDATED, this._retryConnection), _defineProperty(_eventMappings, eventTypes.DIALERS_UPDATED, this._retryConnection), _defineProperty(_eventMappings, eventTypes.LOGIN_STATUS, function () {
        if (!_this2.connected) {
          _this2._onConnect();
        }
      }), _eventMappings);
      var eventHandler = eventMappings[evt.name];

      if (eventHandler && typeof eventHandler === 'function') {
        eventHandler.call(this, evt.data);
      }

      if (this._handleLocalEvents) {
        onNewEvent(Object.assign({
          eventData: evt
        }, this));
      }
    }
    /**
     * Initializes socket connection. Should be called before any other action
     * @return {Promise<boolean>}
     */

  }, {
    key: "init",
    value: async function init() {
      if (this.connectionEstablished) {
        return true;
      }

      if (this.socket) {
        this.emit(eventTypes.CLOSE);
      }

      await this._getServers();

      this._connect();

      this._initReconnectDelays();

      return true;
    }
    /**
     * Sets the monitor code token
     * @param token
     */

  }, {
    key: "setToken",
    value: async function setToken(token) {
      this.options.token = token;
      this.disconnect();
      await this.init();
    }
    /**
     * Closes all existing connections
     */

  }, {
    key: "closeAllConnections",
    value: function closeAllConnections() {
      allConnections.forEach(function (connection) {
        connection.close();
        connection.disconnect();
      });
      allConnections = [];

      if (this.socket) {
        this.socket.disconnect();
        this.socket = null;
      }
    }
    /**
     * Disconnects the socket instance from the servers
     */

  }, {
    key: "disconnect",
    value: function disconnect() {
      this._listenersMap = new Map();
      this.closeAllConnections();
    }
    /**
     * Listens for new events
     * @param {string} eventName (name of the event, * for all events)
     * @param {function} callback (callback function when even with the specified name is received)
     */

  }, {
    key: "on",
    value: function on(eventName, callback) {
      this._listenersMap.set(eventName, callback);

      this._checkInit();
    }
    /**
     * Emits an event to the server
     * @param {string} eventName (name of the event)
     * @param {object} data (data for the event)
     */

  }, {
    key: "emit",
    value: function emit(eventName) {
      var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      this._checkInit();

      this.Logger.log("EMIT -> ".concat(eventName), data);
      this.socket.emit(eventName, data);
    }
    /**
     * Calls resync event to resync socket data
     * @param cache
     */

  }, {
    key: "reSync",
    value: function reSync() {
      var cache = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
      this.emit(eventTypes.RESYNC, {
        cache: cache
      });
    }
  }, {
    key: "setMonitorUrl",
    value: async function setMonitorUrl(url) {
      var oldUrl = this.options.url;
      var oldStrategy = this.options.serverFetchStrategy;

      try {
        if (!url) {
          return;
        }

        this.options.url = url;
        this.options.serverFetchStrategy = 'remote';
        await this.init();
      } catch (err) {
        this._onError(err);

        this.options.url = oldUrl;
        this.options.serverFetchStrategy = oldStrategy;
        await this.init();
      }
    }
    /**
     * Login (logs in based on the token/credentials provided)
     * @param type (login type. Can be token/user/code/account)
     * @return {Promise<void>}
     */

  }, {
    key: "login",
    value: function login() {
      var _this3 = this;

      var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'login';
      // throttle login for 1 second
      var delay = 1000;

      if (this._lastLoginTimestamp + delay > new Date().getTime()) {
        return Promise.resolve();
      }

      var _self = this;

      this._checkInit();

      var resolved = false;
      this._lastLoginTimestamp = new Date().getTime();
      return new Promise(function (resolve, reject) {
        _this3.on(eventTypes.LOGIN_STATUS, function (data) {
          if (_self.onLogin) _self.onLogin(data);
          resolved = true;
          resolve(data);
        });

        _this3.socket.on(eventTypes.ERROR, function (err) {
          if (_self.onError) _self.onError(err);

          if (resolved === false) {
            reject(err);
          }
        });

        if (type === 'login') {
          _this3.emit(eventTypes.LOGIN, {
            token: _this3.options.token
          });
        } else if (type === 'user') {
          _this3.emit(eventTypes.LOGIN_USER, {
            user: _this3.options.user,
            password: _this3.options.password
          });
        } else if (type === 'code') {
          _this3.emit(eventTypes.LOGIN_CODE, {
            code: _this3.options.code,
            orgCode: _this3.options.organizationCode
          });
        } else if (type === 'account') {
          _this3.emit(eventTypes.LOGIN_USER, {
            user: _this3.options.user,
            password: _this3.options.password
          });
        }
      });
    }
  }]);

  return EventsSDK;
}();

if (typeof window !== 'undefined') {
  // Make it available on window
  window.EventsSDK = EventsSDK;
}

export default EventsSDK;
