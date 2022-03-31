import debounce from 'lodash/debounce';
import md5 from 'js-md5';

function _typeof(obj) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  }, _typeof(obj);
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
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
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

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}

function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
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
  CONNECT: 'connect',
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
  ERROR: 'error',
  ALL_DIALERS_STATUS: 'AllDialersStatus',
  DIALER_EVENT: 'DialerEvent'
};

var environments = {
  BROWSER: 'browser',
  CHROME_EXTENSION: 'chrome-extension'
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

var Logger = /*#__PURE__*/function () {
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
      extensionsModuleName = _ref.extensionsModuleName,
      queuesModuleName = _ref.queuesModuleName,
      dialersModuleName = _ref.dialersModuleName;
  var name = eventData.name,
      data = eventData.data;
  store.commit("".concat(extensionsModuleName, "/SET_IS_SOCKET_OFFLINE"), isSocketOffline(eventData));

  switch (name) {
    case eventTypes.ALL_EXTENSION_STATUS:
      store.dispatch("".concat(extensionsModuleName, "/setExtensions"), data.extensions);
      break;

    case eventTypes.EXTENSION_EVENT:
      var extension = data.data; // Event reason: NEWCALL/ANSWER/HANGUP

      extension['lastEvent'] = {
        reason: data.reason,
        ivrid: data.ivruniqueid
      };
      var extensions = store.state[extensionsModuleName].extensions;
      var extensionIndex = extensions.findIndex(function (e) {
        return e.userID === extension.userID;
      });

      if (extensionIndex !== -1) {
        store.dispatch("".concat(extensionsModuleName, "/updateExtension"), {
          index: extensionIndex,
          extension: extension
        });
      }

      break;

    case eventTypes.LOGIN_STATUS:
      store.commit("".concat(extensionsModuleName, "/SET_SERVER_TIME"), data);
      store.dispatch("".concat(queuesModuleName, "/setQueues"), data.queues);
      break;

    case eventTypes.QUEUE_EVENT:
      var queue = data.data;
      var allQueues = store.state[queuesModuleName].all || [];
      var queueIndex = allQueues.findIndex(function (e) {
        return e.QueueID === queue.QueueID;
      });

      if (queueIndex !== -1) {
        store.dispatch("".concat(queuesModuleName, "/updateQueue"), {
          index: queueIndex,
          queue: queue
        });
      }

      break;

    case eventTypes.ALL_DIALERS_STATUS:
      store.dispatch("".concat(dialersModuleName, "/setDialers"), data.dialers);
      break;

    case eventTypes.DIALER_EVENT:
      store.dispatch("".concat(dialersModuleName, "/updateDialers"), data.dialers);
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

function isCallOnHold() {
  var call = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var status = call.callstatus || '';
  status = status.toLowerCase();
  return call.answered && status === HOLD_STATUS;
}

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
          if (extension.calls.filter(isCallOnHold).length) {
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
      return getters.extensionsWithCalls.filter(function (el) {
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

var _mutations$1;

var types$1 = {
  SET_QUEUES: 'SET_QUEUES',
  UPDATE_QUEUES: 'UPDATE_QUEUES'
};
var state$1 = {
  all: []
};
var mutations$1 = (_mutations$1 = {}, _defineProperty(_mutations$1, types$1.SET_QUEUES, function (state, value) {
  state.all = value;
}), _defineProperty(_mutations$1, types$1.UPDATE_QUEUES, function (state, _ref) {
  var index = _ref.index,
      queue = _ref.queue;
  state.all.splice(index, 1, queue);
}), _mutations$1);
var actions$1 = {
  setQueues: async function setQueues(_ref2, value) {
    var commit = _ref2.commit;
    commit(types$1.SET_QUEUES, value);
  },
  updateQueue: async function updateQueue(_ref3, value) {
    var commit = _ref3.commit;
    commit(types$1.UPDATE_QUEUES, value);
  }
};
var getters$1 = {
  queueWithActiveCalls: function queueWithActiveCalls(state) {
    return state.all.filter(function (el) {
      return el.Calls.length;
    });
  },
  allQueueCalls: function allQueueCalls(state, getters) {
    var allCalls = [];
    getters.queueWithActiveCalls.forEach(function (queue) {
      var calls = queue.Calls || [];
      allCalls.push.apply(allCalls, _toConsumableArray(calls));
    });
    return allCalls;
  },
  filterQueuesByIds: function filterQueuesByIds(state) {
    return function (queueIds) {
      if (!queueIds || !Array.isArray(queueIds)) {
        return state.all;
      }

      return state.all.filter(function (e) {
        return queueIds.includes(e.QueueID);
      });
    };
  }
};
var queuesModule = {
  namespaced: true,
  state: state$1,
  mutations: mutations$1,
  actions: actions$1,
  getters: getters$1
};

var _mutations$2;

var types$2 = {
  SET_DIALERS: 'SET_DIALERS',
  UPDATE_DIALERS: 'UPDATE_DIALERS'
};
var state$2 = {
  all: []
};
var mutations$2 = (_mutations$2 = {}, _defineProperty(_mutations$2, types$2.SET_DIALERS, function (state, value) {
  state.all = value;
}), _defineProperty(_mutations$2, types$2.UPDATE_DIALERS, function (state, data) {
  state.all = data;
}), _mutations$2);
var actions$2 = {
  setDialers: async function setDialers(_ref, value) {
    var commit = _ref.commit;
    commit(types$2.SET_DIALERS, value);
  },
  updateDialers: async function updateDialers(_ref2, value) {
    var commit = _ref2.commit;
    commit(types$2.UPDATE_DIALERS, value);
  }
};
var getters$2 = {
  getAllDialers: function getAllDialers(state) {
    return state.all;
  },
  getAllDialersWithTypeIVR: function getAllDialersWithTypeIVR(state) {
    console.log(state, 'state', state.all);
    return state.all.filter(function (el) {
      return el.type === 'IVR';
    });
  },
  getAllDialersWithTypeAUTOMATIC: function getAllDialersWithTypeAUTOMATIC(state) {
    return state.all.filter(function (el) {
      return el.type === 'Automatic';
    });
  }
};
var dialersModule = {
  namespaced: true,
  state: state$2,
  mutations: mutations$2,
  actions: actions$2,
  getters: getters$2
};

function getServerWithHighestPriority(servers) {
  // Highest priority server is the one with lowest Priority value
  var chosenServer = null;
  var maxPriority = Number.MAX_SAFE_INTEGER;
  servers.forEach(function (server) {
    if (server.Priority < maxPriority) {
      maxPriority = server.Priority;
      chosenServer = server;
    }
  });
  return chosenServer;
}
function isValidDate(date) {
  return !isNaN(date.getTime());
}

async function externalLogin(url, _ref) {
  var email = _ref.email,
      password = _ref.password,
      token = _ref.token,
      username = _ref.username;
  var body = null;

  if (token) {
    body = JSON.stringify({
      token: token
    });
  } else if (username) {
    body = JSON.stringify({
      username: username,
      password: password
    });
  } else {
    body = JSON.stringify({
      email: email,
      pin: password
    });
  }

  var res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: body
  });
  var data = await res.json();

  if (data.error) {
    throw new Error(data.error);
  }

  return data.Data.Socket;
}
function getExternalLoginUrl(baseUrl, loginType) {
  if (loginType === 'user') {
    return "".concat(baseUrl, "/User");
  } else if (loginType === 'token') {
    return "".concat(baseUrl, "/Token");
  } else if (loginType === 'account') {
    return "".concat(baseUrl, "/Account");
  }

  return baseUrl;
}
async function refreshToken(url, oldRefreshToken) {
  var res = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': "Bearer ".concat(oldRefreshToken)
    }
  });
  return res.json();
}

function loadBrowserScript(url) {
  return new Promise(function (resolve, reject) {
    var script = document.createElement('script');
    script.src = url;

    script.onload = function () {
      resolve();
    };

    script.onerror = function () {
      reject();
    };

    document.body.append(script);
  });
}

async function loadExtensionScript(url) {
  try {
    var script = await fetch(url);
    script = await script.text();
    eval(script);
  } catch (e) {
    return Promise.reject(e);
  }
}

async function loadExternalScript(url, environment, getSocketIOFunction) {
  if (typeof getSocketIOFunction === 'function') {
    self.io = getSocketIOFunction(url);
    return;
  }

  switch (environment) {
    case environments.BROWSER:
      await loadBrowserScript(url);
      break;

    case environments.CHROME_EXTENSION:
      await loadExtensionScript(url);
  }
}

var defaultOptions = {
  url: "https://monitorapi.voicenter.co.il/monitorAPI/getMonitorUrls",
  environment: environments.BROWSER,
  getSocketIOFunction: undefined,
  fallbackServer: {
    Domain: 'monitor5.voicenter.co.il',
    Priority: 0
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
  idleInterval: 60000 * 5,
  // 5 minutes
  protocol: 'https',
  transports: ['websocket'],
  upgrade: false,
  store: null,
  extensionsModuleName: 'sdkExtensions',
  queuesModuleName: 'sdkQueues',
  dialersModuleName: 'sdkDialers',
  serverFetchStrategy: 'remote',
  // get servers from external url options: remote | static
  serverType: null // can be 1 or 2. 2 is used for chrome extension

};
var allConnections = [];
var listenersMap = new Map();

var EventsSDK = /*#__PURE__*/function () {
  function EventsSDK() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, EventsSDK);

    this.options = Object.assign({}, defaultOptions, options);
    this.argumentOptions = Object.assign({}, options);

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

    this._registerDialerModule();
  }

  _createClass(EventsSDK, [{
    key: "getLastEventTimestamp",
    value: function getLastEventTimestamp() {
      return this._lastEventTimestamp;
    }
  }, {
    key: "_reSync",
    value: function _reSync() {
      this.emit(eventTypes.RESYNC, {
        cache: false
      });
    }
  }, {
    key: "_registerExtensionsModule",
    value: function _registerExtensionsModule() {
      var moduleName = this.options.extensionsModuleName || 'sdkExtensions';

      if (!this._validateStoreModule(moduleName)) {
        return;
      }

      this.options.store.registerModule(moduleName, extensionsModule);
      this._handleLocalEvents = true;
    }
  }, {
    key: "_registerQueueModule",
    value: function _registerQueueModule() {
      var moduleName = this.options.queuesModuleName || 'sdkQueues';

      if (!this._validateStoreModule(moduleName)) {
        return;
      }

      this.options.store.registerModule(moduleName, queuesModule);
      this._handleLocalEvents = true;
    }
  }, {
    key: "_registerDialerModule",
    value: function _registerDialerModule() {
      var moduleName = this.options.dialersModuleName || 'sdkDialers';

      if (!this._validateStoreModule(moduleName)) {
        return;
      }

      this.options.store.registerModule(moduleName, dialersModule);
      this._handleLocalEvents = true;
    }
  }, {
    key: "_validateStoreModule",
    value: function _validateStoreModule(moduleName) {
      var store = this.options.store;

      if (!store) {
        return false;
      }

      if (store.state[moduleName]) {
        store.unregisterModule(moduleName);
      }

      return true;
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
      this._retryConnection('next', true);

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
      this._retryConnection('next', true);

      this.Logger.log(eventTypes.RECONNECT_FAILED, this.reconnectOptions);
    }
  }, {
    key: "_onConnectTimeout",
    value: function _onConnectTimeout() {
      this._retryConnection('next', true);

      this.Logger.log(eventTypes.CONNECT_TIMEOUT, this.reconnectOptions);
    }
  }, {
    key: "_onReconnectAttempt",
    value: function _onReconnectAttempt() {
      this.connected = false;

      if (this.reconnectOptions.retryCount >= this.reconnectOptions.maxReconnectAttempts) {
        this._retryConnection('next', true);

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

      this._connect('next', true);
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
        this._lastEventTimestamp = new Date().getTime();
      } else {
        this._initSocketConnection();
      }
    }
  }, {
    key: "_onLoginResponse",
    value: async function _onLoginResponse(data) {
      if (data.Client) {
        await loadExternalScript(data.Client, this.options.environment, this.options.getSocketIOFunction);
      }

      if (data.URL) {
        this.server = {
          Priority: 0,
          Domain: data.URL.replace('https://', '')
        };
      }

      if (data.URLList && Array.isArray(data.URLList)) {
        this.servers = data.URLList.map(function (url, index) {
          return {
            Priority: index,
            Domain: url.replace('https://', '')
          };
        });
      }

      if (data.Token) {
        this.options.token = data.Token;
        this.token = data.Token;
        await this._connect('default', true);
      }

      if (data.TokenExpiry) {
        this.options.tokenExpiry = data.TokenExpiry;
      }

      if (data.RefreshToken) {
        this.options.refreshToken = data.RefreshToken;

        this._handleTokenExpiry();
      }
    }
  }, {
    key: "_handleTokenExpiry",
    value: function _handleTokenExpiry() {
      var _this = this;

      var date = new Date(this.options.tokenExpiry);

      if (!isValidDate(date)) {
        return;
      }

      var timeout = date.getTime() - new Date().getTime() - 5000; // 5 seconds before expire

      setTimeout(async function () {
        var Socket = null;
        var res = await refreshToken(_this.options.refreshTokenUrl, _this.options.refreshToken);

        if (res.Data) {
          Socket = res.Data.Socket;
          return await _this._onLoginResponse(Socket);
        }

        throw new Error("Error on refreshToken");
      }, timeout);
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
    value: async function _connect() {
      var server = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'default';
      var skipLogin = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
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

      if (skipLogin) {
        return;
      }

      await this.login(this.options.loginType);
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
      var options = {
        reconnection: false,
        perMessageDeflate: false,
        upgrade: false,
        transports: ['websocket'],
        debug: false
      };

      if (this.token) {
        options.query = {
          token: this.token
        };
      }

      this.socket = self.io(url, options);
      allConnections.push(this.socket);
      this.connectionEstablished = true;
    }
  }, {
    key: "_initSocketEvents",
    value: function _initSocketEvents() {
      var _this2 = this;

      this.socket.on(eventTypes.RECONNECT_ATTEMPT, function (data) {
        return _this2._onReconnectAttempt(data);
      }).on(eventTypes.RECONNECT_FAILED, function (data) {
        return _this2._onReconnectFailed(data);
      }).on(eventTypes.CONNECT, function (data) {
        return _this2._onConnect(data);
      }).on(eventTypes.CONNECT_TIMEOUT, function (data) {
        return _this2._onConnectTimeout(data);
      }).on(eventTypes.CONNECT_ERROR, function (data) {
        return _this2._onConnectError(data);
      }).on(eventTypes.RECONNECT_ERROR, function (data) {
        return _this2._onReconnectAttempt(data);
      }).on(eventTypes.ERROR, function (data) {
        return _this2._onError(data);
      }).on(eventTypes.DISCONNECT, function (data) {
        return _this2._onDisconnect(data);
      });
      this.socket.onpacket = this._onEvent.bind(this);
      this.socket.onevent = this._onEvent.bind(this);
    }
  }, {
    key: "_initKeepAlive",
    value: function _initKeepAlive() {
      var _this3 = this;

      if (this.keepAliveInterval) {
        clearInterval(this.keepAliveInterval);
      }

      if (this.idleInterval) {
        clearInterval(this.idleInterval);
      }

      this.keepAliveInterval = setInterval(async function () {
        var now = new Date().getTime();
        var delta = _this3.options.keepAliveTimeout * 2;

        if (now > _this3.getLastEventTimestamp() + delta) {
          await _this3._connect('next', true);
          return;
        }

        if (!_this3.socket) {
          _this3._initSocketConnection();

          return;
        }

        if (now > _this3.getLastEventTimestamp() + _this3.options.keepAliveTimeout) {
          _this3.emit(eventTypes.KEEP_ALIVE, _this3.options.token);

          return;
        }
      }, this.options.keepAliveTimeout); // this.idleInterval = setInterval(() => {
      //   this.reSync(false)
      // }, this.options.idleInterval)
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
        this.server = this.options.fallbackServer;
      }

      return this.server;
    }
  }, {
    key: "_findNextAvailableServer",
    value: function _findNextAvailableServer() {
      var currentServerPriority = this.server.Priority;
      this.Logger.log("Failover -> Trying to find another server");

      if (currentServerPriority === this.servers.length - 1) {
        return this._findMaxPriorityServer();
      }

      var nextServerPriority = currentServerPriority + 1;
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
      return null;
    }
  }, {
    key: "_findMaxPriorityServer",
    value: function _findMaxPriorityServer() {
      this.Logger.log("Fallback -> Trying to find previous server", '_findMaxPriorityServer');
      var maxPriorityServer = getServerWithHighestPriority(this.servers);

      if (!this.server) {
        this.server = maxPriorityServer;
        return this.server;
      }

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
      }
    }
  }, {
    key: "_onEvent",
    value: function _onEvent(packet) {
      var _this4 = this,
          _eventMappings;

      if (!packet.data) {
        return;
      }

      var evt = this._parsePacket(packet);

      this.Logger.log("New event -> ".concat(evt.name), evt);
      this._lastEventTimestamp = new Date().getTime();

      this._listenersMap.forEach(function (callback, eventName) {
        if (eventName === '*') {
          callback(evt);
        } else if (evt.name === eventName) {
          callback(evt);
        }
      });

      var eventMappings = (_eventMappings = {}, _defineProperty(_eventMappings, eventTypes.KEEP_ALIVE_RESPONSE, this._onKeepAlive), _defineProperty(_eventMappings, eventTypes.LOGIN_RESPONSE, this._onLoginResponse), _defineProperty(_eventMappings, eventTypes.EXTENSION_UPDATED, this._reSync), _defineProperty(_eventMappings, eventTypes.QUEUES_UPDATED, this._reSync), _defineProperty(_eventMappings, eventTypes.DIALERS_UPDATED, this._reSync), _defineProperty(_eventMappings, eventTypes.LOGIN_STATUS, function () {
        if (!_this4.connected) {
          _this4._onConnect();
        }
      }), _eventMappings);
      var eventHandler = eventMappings[evt.name];

      if (eventHandler && typeof eventHandler === 'function') {
        eventHandler.call(this, evt.data);
      }

      if (this._handleLocalEvents) {
        onNewEvent(Object.assign({
          eventData: evt
        }, this.options));
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

      await this._getToken();
      await this._getTabsSession();
      await this.login(this.options.loginType);
      await this._getServers();
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
        this.socket.close();
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
  }, {
    key: "_getToken",
    value: function _getToken() {
      var loginType = this.options.loginType;
      this.token = this.options.token;

      if (loginType === 'token') {
        if (!this.token) {
          throw new Error('Token login type expects the token option to be provided');
        }
      }
    }
  }, {
    key: "_getTabsSession",
    value: function _getTabsSession() {
      if (this.options.environment !== environments.BROWSER) {
        return Promise.resolve();
      }

      if (!window.sessionStorage.length) {
        // Ask other tabs for session storage
        localStorage.setItem('getSessionStorage', Date.now());
      }

      return new Promise(function (resolve) {
        window.addEventListener('storage', function (event) {
          if (event.key === 'getSessionStorage') {
            // Some tab asked for the sessionStorage -> send it
            localStorage.setItem('sessionStorage', JSON.stringify(window.sessionStorage));
            localStorage.removeItem('sessionStorage');
          } else if (event.key === 'sessionStorage' && !sessionStorage.length) {
            // sessionStorage is empty -> fill it
            var data = JSON.parse(event.newValue);

            for (var key in data) {
              if (data.hasOwnProperty(key)) {
                window.sessionStorage.setItem(key, data[key]);
              }
            }

            resolve();
          }
        });
      });
    }
    /**
     * Login (logs in based on the token/credentials provided)
     * @param type (login type. Can be token/user/code/account)
     * @return {Promise<void>}
     */

  }, {
    key: "login",
    value: function login() {
      var _this5 = this;

      var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'token';
      // throttle login for 1 second
      var payload = {
        token: this.options.token,
        email: this.options.email,
        username: this.options.username,
        password: this.options.password
      };
      var key = md5(JSON.stringify(payload));
      var delay = 1000;

      if (this._lastLoginTimestamp + delay > new Date().getTime()) {
        return Promise.resolve();
      }

      this._lastLoginTimestamp = new Date().getTime();
      return new Promise(async function (resolve, reject) {
        try {
          var loginSession = window.sessionStorage.getItem(key);

          if (loginSession) {
            loginSession = JSON.parse(loginSession);

            _this5.Logger.log('got data from session', loginSession);

            await _this5._onLoginResponse(loginSession);
            return resolve(loginSession);
          }
        } catch (err) {
          _this5.Logger.log('Error on getting session', err);
        }

        try {
          var url = getExternalLoginUrl(_this5.options.loginUrl, type);
          var res = await externalLogin(url, payload);
          await _this5._onLoginResponse(res);

          if (_this5.options.environment === environments.BROWSER) {
            window.sessionStorage.setItem(key, JSON.stringify(res));
          }

          resolve(res);
        } catch (err) {
          _this5.servers = _this5.argumentOptions.servers || defaultServers;
          reject(err);
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
