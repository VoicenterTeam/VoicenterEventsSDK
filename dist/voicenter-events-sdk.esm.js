import _regeneratorRuntime from '../node_modules/@babel/runtime/regenerator';
import io from 'socket.io-client/socket.io';
import debounce from 'lodash/debounce';

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
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

function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    var ownKeys = Object.keys(source);

    if (typeof Object.getOwnPropertySymbols === 'function') {
      ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
        return Object.getOwnPropertyDescriptor(source, sym).enumerable;
      }));
    }

    ownKeys.forEach(function (key) {
      _defineProperty(target, key, source[key]);
    });
  }

  return target;
}

var eventTypes = {
  LOGIN: 'loginStatus',
  LOGIN_RESPONSE: 'loginResponse',
  QUEUE_EVENT: 'QueueEvent',
  EXTENSION_EVENT: 'ExtensionEvent',
  ALL_EXTENSION_STATUS: 'AllExtensionsStatus',
  CONNECT_ERROR: 'connect_error',
  CONNECT_TIMEOUT: 'connect_timeout',
  DISCONNECT: 'disconnect',
  RECONNECT: 'reconnect',
  RECONNECT_ATTEMPT: 'reconnect_attempt',
  RECONNECTING: 'reconnecting',
  RECONNECT_ERROR: 'reconnect_error',
  RECONNECT_FAILED: 'reconnect_failed',
  KEEP_ALIVE: 'keepalive',
  KEEP_ALIVE_RESPONSE: 'keepaliveResponse',
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
  token: null,
  forceNew: false,
  reconnectionDelay: 10000,
  reconnectionDelayMax: 10000,
  timeout: 10000,
  keepAliveTimeout: 60000,
  protocol: 'https',
  transports: ['websocket'],
  upgrade: false
};

var EventsSDK =
/*#__PURE__*/
function () {
  function EventsSDK() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, EventsSDK);

    this.options = _objectSpread({}, defaultOptions, options);

    if (!this.options.token) {
      throw new Error('A token property should be provided');
    }

    this.Logger = new Logger(this.options);
    this.servers = [];
    this.server = null;
    this.socket = null;
    this.connected = false;
    this.connectionEstablished = false;
    this.shouldReconnect = true;

    this._initReconnectOptions();

    this._listenersMap = new Map();
    this._retryConnection = debounce(this._connect.bind(this), this.reconnectOptions.reconnectionDelay, {
      leading: true,
      trailing: false
    });
  }

  _createClass(EventsSDK, [{
    key: "_initReconnectOptions",
    value: function _initReconnectOptions() {
      this.reconnectOptions = {
        retryCount: 1,
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
    value: function _onReconnectAttempt(attempts) {
      if (attempts > 2) {
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
    value: function _onDisconnect() {
      if (this.shouldReconnect) {
        this._connect('next');
      }

      this.connected = false;
      this.Logger.log(eventTypes.DISCONNECT, this.reconnectOptions);
    }
  }, {
    key: "_onKeepAlive",
    value: function _onKeepAlive(data) {
      if (data === false && this.connected) {
        this._initSocketConnection();

        this.Logger.log(eventTypes.KEEP_ALIVE_RESPONSE, this.reconnectOptions);
      }
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
      this.shouldReconnect = true;
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
        // skip the connect because we didn't find a new server to connect to.
        return;
      }

      this._initSocketConnection();

      this._initSocketEvents();

      this._initKeepAlive();

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

      if (this.socket) {
        this.socket.close();
      }

      this.socket = io(url, _objectSpread({}, this.options, {
        debug: false
      }));
      this.connectionEstablished = true;
    }
  }, {
    key: "_initSocketEvents",
    value: function _initSocketEvents() {
      this.socket.on(eventTypes.RECONNECT_ATTEMPT, this._onReconnectAttempt.bind(this));
      this.socket.on(eventTypes.RECONNECT_FAILED, this._onReconnectFailed.bind(this));
      this.socket.on(eventTypes.CONNECT, this._onConnect.bind(this));
      this.socket.on(eventTypes.DISCONNECT, this._onDisconnect.bind(this));
      this.socket.on(eventTypes.CONNECT_ERROR, this._onConnectError.bind(this));
      this.socket.on(eventTypes.CONNECT_TIMEOUT, this._onConnectTimeout.bind(this));
      this.socket.on(eventTypes.KEEP_ALIVE_RESPONSE, this._onKeepAlive.bind(this));
    }
  }, {
    key: "_initKeepAlive",
    value: function _initKeepAlive() {
      var _this = this;

      setTimeout(function () {
        if (_this.socket) {
          _this.emit(eventTypes.KEEP_ALIVE, _this.options.token);

          _this._connect('prev');
        } else {
          _this._initSocketConnection();
        }
      }, this.options.keepAliveTimeout);
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
    value: function () {
      var _getServers2 = _asyncToGenerator(
      /*#__PURE__*/
      _regeneratorRuntime.mark(function _callee() {
        var res;
        return _regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;
                _context.next = 3;
                return fetch("".concat(this.options.url, "/").concat(this.options.token));

              case 3:
                res = _context.sent;
                _context.next = 6;
                return res.json();

              case 6:
                this.servers = _context.sent;
                _context.next = 12;
                break;

              case 9:
                _context.prev = 9;
                _context.t0 = _context["catch"](0);
                this.servers = defaultServers;

              case 12:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this, [[0, 9]]);
      }));

      function _getServers() {
        return _getServers2.apply(this, arguments);
      }

      return _getServers;
    }()
  }, {
    key: "_onEvent",
    value: function _onEvent() {
      var _this2 = this;

      this.socket.onevent = function (packet) {
        if (!packet.data) {
          return;
        }

        var evt = _this2._parsePacket(packet);

        _this2.Logger.log("New event -> ".concat(evt.name), evt);

        _this2._listenersMap.forEach(function (callback, eventName) {
          if (eventName === '*') {
            callback(evt);
          } else if (evt.name === eventName) {
            callback(evt);
          }
        });
      };
    }
    /**
     * Initializes socket connection. Should be called before any other action
     * @return {Promise<boolean>}
     */

  }, {
    key: "init",
    value: function () {
      var _init = _asyncToGenerator(
      /*#__PURE__*/
      _regeneratorRuntime.mark(function _callee2() {
        return _regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                if (!this.connectionEstablished) {
                  _context2.next = 2;
                  break;
                }

                return _context2.abrupt("return", true);

              case 2:
                _context2.next = 4;
                return this._getServers();

              case 4:
                this._connect();

                this._initReconnectDelays();

                return _context2.abrupt("return", true);

              case 7:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function init() {
        return _init.apply(this, arguments);
      }

      return init;
    }()
    /**
     * Disconnects definitively from the servers
     */

  }, {
    key: "disconnect",
    value: function disconnect() {
      this.shouldReconnect = false;
      this.socket.close();
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

      this._onEvent();
    }
    /**
     * Emits an event to the server
     * @param {string} eventName (name of the event)
     * @param {object} data (data for the event)
     */

  }, {
    key: "emit",
    value: function emit(eventName, data) {
      this._checkInit();

      this.Logger.log("EMIT -> ".concat(eventName), data);
      this.socket.emit(eventName, data);
    }
    /**
     * Login (logs in based on the token/credentials provided)
     */

  }, {
    key: "login",
    value: function login() {
      var _this3 = this;

      this._checkInit();

      var resolved = false;
      return new Promise(function (resolve, reject) {
        _this3.on(eventTypes.LOGIN, function (data) {
          resolved = true;
          resolve(data);
        });

        _this3.emit('login', {
          token: _this3.options.token
        });

        _this3.socket.on(eventTypes.ERROR, function (err) {
          if (!resolved) {
            reject(err);
          }
        });
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
