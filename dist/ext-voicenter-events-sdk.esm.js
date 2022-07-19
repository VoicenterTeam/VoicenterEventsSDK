import debounce from 'lodash/debounce';
import md5 from 'js-md5';
import { AsyncStorageLogger } from '@voicenter-team/socketio-storage-logger/build/AsyncStorageLogger';

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
      var dialer = data.data;
      var allDialers = store.state[dialersModuleName].all || [];
      var dialerIndex = allDialers.findIndex(function (e) {
        return e.campaignID === dialer.campaignID;
      });

      if (dialerIndex !== -1) {
        store.dispatch("".concat(dialersModuleName, "/updateDialers"), {
          index: dialerIndex,
          dialer: dialer
        });
      }

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
}), _defineProperty(_mutations$2, types$2.UPDATE_DIALERS, function (state, _ref) {
  var index = _ref.index,
      dialer = _ref.dialer;
  state.all.splice(index, 1, dialer);
}), _mutations$2);
var actions$2 = {
  setDialers: async function setDialers(_ref2, value) {
    var commit = _ref2.commit;
    commit(types$2.SET_DIALERS, value);
  },
  updateDialers: async function updateDialers(_ref3, value) {
    var commit = _ref3.commit;
    commit(types$2.UPDATE_DIALERS, value);
  }
};
var getters$2 = {
  getAllDialers: function getAllDialers(state) {
    return state.all;
  },
  getAllDialersWithTypeIVR: function getAllDialersWithTypeIVR(state) {
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

/* eslint-disable */
function s1_3_7 () {
  return function e(t, n, r) {
    function o(s, a) {
      if (!n[s]) {
        if (!t[s]) {
          var c = "function" == typeof require && require;
          if (!a && c) return c(s, !0);
          if (i) return i(s, !0);
          throw new Error("Cannot find module '" + s + "'");
        }

        var p = n[s] = {
          exports: {}
        };
        t[s][0].call(p.exports, function (e) {
          var n = t[s][1][e];
          return o(n ? n : e);
        }, p, p.exports, e, t, n, r);
      }

      return n[s].exports;
    }

    for (var i = "function" == typeof require && require, s = 0; s < r.length; s++) {
      o(r[s]);
    }

    return o;
  }({
    1: [function (t, e) {
      e.exports = t("./lib/");
    }, {
      "./lib/": 2
    }],
    2: [function (t, e, n) {
      function r(t, e) {
        "object" == _typeof(t) && (e = t, t = void 0), e = e || {};
        var n,
            r = o(t),
            i = r.source,
            p = r.id;
        return e.forceNew || e["force new connection"] || !1 === e.multiplex ? (a("ignoring socket cache for %s", i), n = s(i, e)) : (c[p] || (a("new io instance for %s", i), c[p] = s(i, e)), n = c[p]), n.socket(r.path);
      }

      var o = t("./url"),
          i = t("socket.io-parser"),
          s = t("./manager"),
          a = t("debug")("socket.io-client");
      e.exports = n = r;
      var c = n.managers = {};
      n.protocol = i.protocol, n.connect = r, n.Manager = t("./manager"), n.Socket = t("./socket");
    }, {
      "./manager": 3,
      "./socket": 5,
      "./url": 6,
      debug: 10,
      "socket.io-parser": 44
    }],
    3: [function (t, e) {
      function n(t, e) {
        return this instanceof n ? (t && "object" == _typeof(t) && (e = t, t = void 0), e = e || {}, e.path = e.path || "/socket.io", this.nsps = {}, this.subs = [], this.opts = e, this.reconnection(e.reconnection !== !1), this.reconnectionAttempts(e.reconnectionAttempts || 1 / 0), this.reconnectionDelay(e.reconnectionDelay || 1e3), this.reconnectionDelayMax(e.reconnectionDelayMax || 5e3), this.randomizationFactor(e.randomizationFactor || .5), this.backoff = new f({
          min: this.reconnectionDelay(),
          max: this.reconnectionDelayMax(),
          jitter: this.randomizationFactor()
        }), this.timeout(null == e.timeout ? 2e4 : e.timeout), this.readyState = "closed", this.uri = t, this.connected = [], this.encoding = !1, this.packetBuffer = [], this.encoder = new s.Encoder(), this.decoder = new s.Decoder(), this.autoConnect = e.autoConnect !== !1, void (this.autoConnect && this.open())) : new n(t, e);
      }

      var r = (t("./url"), t("engine.io-client")),
          o = t("./socket"),
          i = t("component-emitter"),
          s = t("socket.io-parser"),
          a = t("./on"),
          c = t("component-bind"),
          p = (t("object-component"), t("debug")("socket.io-client:manager")),
          u = t("indexof"),
          f = t("backo2");
      e.exports = n, n.prototype.emitAll = function () {
        this.emit.apply(this, arguments);

        for (var t in this.nsps) {
          this.nsps[t].emit.apply(this.nsps[t], arguments);
        }
      }, n.prototype.updateSocketIds = function () {
        for (var t in this.nsps) {
          this.nsps[t].id = this.engine.id;
        }
      }, i(n.prototype), n.prototype.reconnection = function (t) {
        return arguments.length ? (this._reconnection = !!t, this) : this._reconnection;
      }, n.prototype.reconnectionAttempts = function (t) {
        return arguments.length ? (this._reconnectionAttempts = t, this) : this._reconnectionAttempts;
      }, n.prototype.reconnectionDelay = function (t) {
        return arguments.length ? (this._reconnectionDelay = t, this.backoff && this.backoff.setMin(t), this) : this._reconnectionDelay;
      }, n.prototype.randomizationFactor = function (t) {
        return arguments.length ? (this._randomizationFactor = t, this.backoff && this.backoff.setJitter(t), this) : this._randomizationFactor;
      }, n.prototype.reconnectionDelayMax = function (t) {
        return arguments.length ? (this._reconnectionDelayMax = t, this.backoff && this.backoff.setMax(t), this) : this._reconnectionDelayMax;
      }, n.prototype.timeout = function (t) {
        return arguments.length ? (this._timeout = t, this) : this._timeout;
      }, n.prototype.maybeReconnectOnOpen = function () {
        !this.reconnecting && this._reconnection && 0 === this.backoff.attempts && this.reconnect();
      }, n.prototype.open = n.prototype.connect = function (t) {
        if (p("readyState %s", this.readyState), ~this.readyState.indexOf("open")) return this;
        p("opening %s", this.uri), this.engine = r(this.uri, this.opts);
        var e = this.engine,
            n = this;
        this.readyState = "opening", this.skipReconnect = !1;
        var o = a(e, "open", function () {
          n.onopen(), t && t();
        }),
            i = a(e, "error", function (e) {
          if (p("connect_error"), n.cleanup(), n.readyState = "closed", n.emitAll("connect_error", e), t) {
            var r = new Error("Connection error");
            r.data = e, t(r);
          } else n.maybeReconnectOnOpen();
        });

        if (!1 !== this._timeout) {
          var s = this._timeout;
          p("connect attempt will timeout after %d", s);
          var c = setTimeout(function () {
            p("connect attempt timed out after %d", s), o.destroy(), e.close(), e.emit("error", "timeout"), n.emitAll("connect_timeout", s);
          }, s);
          this.subs.push({
            destroy: function destroy() {
              clearTimeout(c);
            }
          });
        }

        return this.subs.push(o), this.subs.push(i), this;
      }, n.prototype.onopen = function () {
        p("open"), this.cleanup(), this.readyState = "open", this.emit("open");
        var t = this.engine;
        this.subs.push(a(t, "data", c(this, "ondata"))), this.subs.push(a(this.decoder, "decoded", c(this, "ondecoded"))), this.subs.push(a(t, "error", c(this, "onerror"))), this.subs.push(a(t, "close", c(this, "onclose")));
      }, n.prototype.ondata = function (t) {
        this.decoder.add(t);
      }, n.prototype.ondecoded = function (t) {
        this.emit("packet", t);
      }, n.prototype.onerror = function (t) {
        p("error", t), this.emitAll("error", t);
      }, n.prototype.socket = function (t) {
        var e = this.nsps[t];

        if (!e) {
          e = new o(this, t), this.nsps[t] = e;
          var n = this;
          e.on("connect", function () {
            e.id = n.engine.id, ~u(n.connected, e) || n.connected.push(e);
          });
        }

        return e;
      }, n.prototype.destroy = function (t) {
        var e = u(this.connected, t);
        ~e && this.connected.splice(e, 1), this.connected.length || this.close();
      }, n.prototype.packet = function (t) {
        p("writing packet %j", t);
        var e = this;
        e.encoding ? e.packetBuffer.push(t) : (e.encoding = !0, this.encoder.encode(t, function (t) {
          for (var n = 0; n < t.length; n++) {
            e.engine.write(t[n]);
          }

          e.encoding = !1, e.processPacketQueue();
        }));
      }, n.prototype.processPacketQueue = function () {
        if (this.packetBuffer.length > 0 && !this.encoding) {
          var t = this.packetBuffer.shift();
          this.packet(t);
        }
      }, n.prototype.cleanup = function () {
        for (var t; t = this.subs.shift();) {
          t.destroy();
        }

        this.packetBuffer = [], this.encoding = !1, this.decoder.destroy();
      }, n.prototype.close = n.prototype.disconnect = function () {
        this.skipReconnect = !0, this.backoff.reset(), this.readyState = "closed", this.engine && this.engine.close();
      }, n.prototype.onclose = function (t) {
        p("close"), this.cleanup(), this.backoff.reset(), this.readyState = "closed", this.emit("close", t), this._reconnection && !this.skipReconnect && this.reconnect();
      }, n.prototype.reconnect = function () {
        if (this.reconnecting || this.skipReconnect) return this;
        var t = this;
        if (this.backoff.attempts >= this._reconnectionAttempts) p("reconnect failed"), this.backoff.reset(), this.emitAll("reconnect_failed"), this.reconnecting = !1;else {
          var e = this.backoff.duration();
          p("will wait %dms before reconnect attempt", e), this.reconnecting = !0;
          var n = setTimeout(function () {
            t.skipReconnect || (p("attempting reconnect"), t.emitAll("reconnect_attempt", t.backoff.attempts), t.emitAll("reconnecting", t.backoff.attempts), t.skipReconnect || t.open(function (e) {
              e ? (p("reconnect attempt error"), t.reconnecting = !1, t.reconnect(), t.emitAll("reconnect_error", e.data)) : (p("reconnect success"), t.onreconnect());
            }));
          }, e);
          this.subs.push({
            destroy: function destroy() {
              clearTimeout(n);
            }
          });
        }
      }, n.prototype.onreconnect = function () {
        var t = this.backoff.attempts;
        this.reconnecting = !1, this.backoff.reset(), this.updateSocketIds(), this.emitAll("reconnect", t);
      };
    }, {
      "./on": 4,
      "./socket": 5,
      "./url": 6,
      backo2: 7,
      "component-bind": 8,
      "component-emitter": 9,
      debug: 10,
      "engine.io-client": 11,
      indexof: 40,
      "object-component": 41,
      "socket.io-parser": 44
    }],
    4: [function (t, e) {
      function n(t, e, n) {
        return t.on(e, n), {
          destroy: function destroy() {
            t.removeListener(e, n);
          }
        };
      }

      e.exports = n;
    }, {}],
    5: [function (t, e, n) {
      function r(t, e) {
        this.io = t, this.nsp = e, this.json = this, this.ids = 0, this.acks = {}, this.io.autoConnect && this.open(), this.receiveBuffer = [], this.sendBuffer = [], this.connected = !1, this.disconnected = !0;
      }

      var o = t("socket.io-parser"),
          i = t("component-emitter"),
          s = t("to-array"),
          a = t("./on"),
          c = t("component-bind"),
          p = t("debug")("socket.io-client:socket"),
          u = t("has-binary");
      e.exports = n = r;
      var f = {
        connect: 1,
        connect_error: 1,
        connect_timeout: 1,
        disconnect: 1,
        error: 1,
        reconnect: 1,
        reconnect_attempt: 1,
        reconnect_failed: 1,
        reconnect_error: 1,
        reconnecting: 1
      },
          h = i.prototype.emit;
      i(r.prototype), r.prototype.subEvents = function () {
        if (!this.subs) {
          var t = this.io;
          this.subs = [a(t, "open", c(this, "onopen")), a(t, "packet", c(this, "onpacket")), a(t, "close", c(this, "onclose"))];
        }
      }, r.prototype.open = r.prototype.connect = function () {
        return this.connected ? this : (this.subEvents(), this.io.open(), "open" == this.io.readyState && this.onopen(), this);
      }, r.prototype.send = function () {
        var t = s(arguments);
        return t.unshift("message"), this.emit.apply(this, t), this;
      }, r.prototype.emit = function (t) {
        if (f.hasOwnProperty(t)) return h.apply(this, arguments), this;
        var e = s(arguments),
            n = o.EVENT;
        u(e) && (n = o.BINARY_EVENT);
        var r = {
          type: n,
          data: e
        };
        return "function" == typeof e[e.length - 1] && (p("emitting packet with ack id %d", this.ids), this.acks[this.ids] = e.pop(), r.id = this.ids++), this.connected ? this.packet(r) : this.sendBuffer.push(r), this;
      }, r.prototype.packet = function (t) {
        t.nsp = this.nsp, this.io.packet(t);
      }, r.prototype.onopen = function () {
        p("transport is open - connecting"), "/" != this.nsp && this.packet({
          type: o.CONNECT
        });
      }, r.prototype.onclose = function (t) {
        p("close (%s)", t), this.connected = !1, this.disconnected = !0, delete this.id, this.emit("disconnect", t);
      }, r.prototype.onpacket = function (t) {
        if (t.nsp == this.nsp) switch (t.type) {
          case o.CONNECT:
            this.onconnect();
            break;

          case o.EVENT:
            this.onevent(t);
            break;

          case o.BINARY_EVENT:
            this.onevent(t);
            break;

          case o.ACK:
            this.onack(t);
            break;

          case o.BINARY_ACK:
            this.onack(t);
            break;

          case o.DISCONNECT:
            this.ondisconnect();
            break;

          case o.ERROR:
            this.emit("error", t.data);
        }
      }, r.prototype.onevent = function (t) {
        var e = t.data || [];
        p("emitting event %j", e), null != t.id && (p("attaching ack callback to event"), e.push(this.ack(t.id))), this.connected ? h.apply(this, e) : this.receiveBuffer.push(e);
      }, r.prototype.ack = function (t) {
        var e = this,
            n = !1;
        return function () {
          if (!n) {
            n = !0;
            var r = s(arguments);
            p("sending ack %j", r);
            var i = u(r) ? o.BINARY_ACK : o.ACK;
            e.packet({
              type: i,
              id: t,
              data: r
            });
          }
        };
      }, r.prototype.onack = function (t) {
        p("calling ack %s with %j", t.id, t.data);
        var e = this.acks[t.id];
        e.apply(this, t.data), delete this.acks[t.id];
      }, r.prototype.onconnect = function () {
        this.connected = !0, this.disconnected = !1, this.emit("connect"), this.emitBuffered();
      }, r.prototype.emitBuffered = function () {
        var t;

        for (t = 0; t < this.receiveBuffer.length; t++) {
          h.apply(this, this.receiveBuffer[t]);
        }

        for (this.receiveBuffer = [], t = 0; t < this.sendBuffer.length; t++) {
          this.packet(this.sendBuffer[t]);
        }

        this.sendBuffer = [];
      }, r.prototype.ondisconnect = function () {
        p("server disconnect (%s)", this.nsp), this.destroy(), this.onclose("io server disconnect");
      }, r.prototype.destroy = function () {
        if (this.subs) {
          for (var t = 0; t < this.subs.length; t++) {
            this.subs[t].destroy();
          }

          this.subs = null;
        }

        this.io.destroy(this);
      }, r.prototype.close = r.prototype.disconnect = function () {
        return this.connected && (p("performing disconnect (%s)", this.nsp), this.packet({
          type: o.DISCONNECT
        })), this.destroy(), this.connected && this.onclose("io client disconnect"), this;
      };
    }, {
      "./on": 4,
      "component-bind": 8,
      "component-emitter": 9,
      debug: 10,
      "has-binary": 36,
      "socket.io-parser": 44,
      "to-array": 48
    }],
    6: [function (t, e) {
      (function (n) {
        function r(t, e) {
          var r = t,
              e = e || n.location;
          return null == t && (t = e.protocol + "//" + e.host), "string" == typeof t && ("/" == t.charAt(0) && (t = "/" == t.charAt(1) ? e.protocol + t : e.hostname + t), /^(https?|wss?):\/\//.test(t) || (i("protocol-less url %s", t), t = "undefined" != typeof e ? e.protocol + "//" + t : "https://" + t), i("parse %s", t), r = o(t)), r.port || (/^(http|ws)$/.test(r.protocol) ? r.port = "80" : /^(http|ws)s$/.test(r.protocol) && (r.port = "443")), r.path = r.path || "/", r.id = r.protocol + "://" + r.host + ":" + r.port, r.href = r.protocol + "://" + r.host + (e && e.port == r.port ? "" : ":" + r.port), r;
        }

        var o = t("parseuri"),
            i = t("debug")("socket.io-client:url");
        e.exports = r;
      }).call(this, "undefined" != typeof self ? self : "undefined" != typeof window ? window : {});
    }, {
      debug: 10,
      parseuri: 42
    }],
    7: [function (t, e) {
      function n(t) {
        t = t || {}, this.ms = t.min || 100, this.max = t.max || 1e4, this.factor = t.factor || 2, this.jitter = t.jitter > 0 && t.jitter <= 1 ? t.jitter : 0, this.attempts = 0;
      }

      e.exports = n, n.prototype.duration = function () {
        var t = this.ms * Math.pow(this.factor, this.attempts++);

        if (this.jitter) {
          var e = Math.random(),
              n = Math.floor(e * this.jitter * t);
          t = 0 == (1 & Math.floor(10 * e)) ? t - n : t + n;
        }

        return 0 | Math.min(t, this.max);
      }, n.prototype.reset = function () {
        this.attempts = 0;
      }, n.prototype.setMin = function (t) {
        this.ms = t;
      }, n.prototype.setMax = function (t) {
        this.max = t;
      }, n.prototype.setJitter = function (t) {
        this.jitter = t;
      };
    }, {}],
    8: [function (t, e) {
      var n = [].slice;

      e.exports = function (t, e) {
        if ("string" == typeof e && (e = t[e]), "function" != typeof e) throw new Error("bind() requires a function");
        var r = n.call(arguments, 2);
        return function () {
          return e.apply(t, r.concat(n.call(arguments)));
        };
      };
    }, {}],
    9: [function (t, e) {
      function n(t) {
        return t ? r(t) : void 0;
      }

      function r(t) {
        for (var e in n.prototype) {
          t[e] = n.prototype[e];
        }

        return t;
      }

      e.exports = n, n.prototype.on = n.prototype.addEventListener = function (t, e) {
        return this._callbacks = this._callbacks || {}, (this._callbacks[t] = this._callbacks[t] || []).push(e), this;
      }, n.prototype.once = function (t, e) {
        function n() {
          r.off(t, n), e.apply(this, arguments);
        }

        var r = this;
        return this._callbacks = this._callbacks || {}, n.fn = e, this.on(t, n), this;
      }, n.prototype.off = n.prototype.removeListener = n.prototype.removeAllListeners = n.prototype.removeEventListener = function (t, e) {
        if (this._callbacks = this._callbacks || {}, 0 == arguments.length) return this._callbacks = {}, this;
        var n = this._callbacks[t];
        if (!n) return this;
        if (1 == arguments.length) return delete this._callbacks[t], this;

        for (var r, o = 0; o < n.length; o++) {
          if (r = n[o], r === e || r.fn === e) {
            n.splice(o, 1);
            break;
          }
        }

        return this;
      }, n.prototype.emit = function (t) {
        this._callbacks = this._callbacks || {};
        var e = [].slice.call(arguments, 1),
            n = this._callbacks[t];

        if (n) {
          n = n.slice(0);

          for (var r = 0, o = n.length; o > r; ++r) {
            n[r].apply(this, e);
          }
        }

        return this;
      }, n.prototype.listeners = function (t) {
        return this._callbacks = this._callbacks || {}, this._callbacks[t] || [];
      }, n.prototype.hasListeners = function (t) {
        return !!this.listeners(t).length;
      };
    }, {}],
    10: [function (t, e) {
      function n(t) {
        return n.enabled(t) ? function (e) {
          e = r(e);
          var o = new Date(),
              i = o - (n[t] || o);
          n[t] = o, e = t + " " + e + " +" + n.humanize(i), window.console && console.log && Function.prototype.apply.call(console.log, console, arguments);
        } : function () {};
      }

      function r(t) {
        return t instanceof Error ? t.stack || t.message : t;
      }

      e.exports = n, n.names = [], n.skips = [], n.enable = function (t) {
        try {
          localStorage.debug = t;
        } catch (e) {}

        for (var r = (t || "").split(/[\s,]+/), o = r.length, i = 0; o > i; i++) {
          t = r[i].replace("*", ".*?"), "-" === t[0] ? n.skips.push(new RegExp("^" + t.substr(1) + "$")) : n.names.push(new RegExp("^" + t + "$"));
        }
      }, n.disable = function () {
        n.enable("");
      }, n.humanize = function (t) {
        var e = 1e3,
            n = 6e4,
            r = 60 * n;
        return t >= r ? (t / r).toFixed(1) + "h" : t >= n ? (t / n).toFixed(1) + "m" : t >= e ? (t / e | 0) + "s" : t + "ms";
      }, n.enabled = function (t) {
        for (var e = 0, r = n.skips.length; r > e; e++) {
          if (n.skips[e].test(t)) return !1;
        }

        for (var e = 0, r = n.names.length; r > e; e++) {
          if (n.names[e].test(t)) return !0;
        }

        return !1;
      };

      try {
        window.localStorage && n.enable(localStorage.debug);
      } catch (o) {}
    }, {}],
    11: [function (t, e) {
      e.exports = t("./lib/");
    }, {
      "./lib/": 12
    }],
    12: [function (t, e) {
      e.exports = t("./socket"), e.exports.parser = t("engine.io-parser");
    }, {
      "./socket": 13,
      "engine.io-parser": 25
    }],
    13: [function (t, e) {
      (function (n) {
        function r(t, e) {
          if (!(this instanceof r)) return new r(t, e);

          if (e = e || {}, t && "object" == _typeof(t) && (e = t, t = null), t && (t = u(t), e.host = t.host, e.secure = "https" == t.protocol || "wss" == t.protocol, e.port = t.port, t.query && (e.query = t.query)), this.secure = null != e.secure ? e.secure : n.location && "https:" == location.protocol, e.host) {
            var o = e.host.split(":");
            e.hostname = o.shift(), o.length ? e.port = o.pop() : e.port || (e.port = this.secure ? "443" : "80");
          }

          this.agent = e.agent || !1, this.hostname = e.hostname || (n.location ? location.hostname : "localhost"), this.port = e.port || (n.location && location.port ? location.port : this.secure ? 443 : 80), this.query = e.query || {}, "string" == typeof this.query && (this.query = h.decode(this.query)), this.upgrade = !1 !== e.upgrade, this.path = (e.path || "/engine.io").replace(/\/$/, "") + "/", this.forceJSONP = !!e.forceJSONP, this.jsonp = !1 !== e.jsonp, this.forceBase64 = !!e.forceBase64, this.enablesXDR = !!e.enablesXDR, this.timestampParam = e.timestampParam || "t", this.timestampRequests = e.timestampRequests, this.transports = e.transports || ["polling", "websocket"], this.readyState = "", this.writeBuffer = [], this.callbackBuffer = [], this.policyPort = e.policyPort || 843, this.rememberUpgrade = e.rememberUpgrade || !1, this.binaryType = null, this.onlyBinaryUpgrades = e.onlyBinaryUpgrades, this.pfx = e.pfx || null, this.key = e.key || null, this.passphrase = e.passphrase || null, this.cert = e.cert || null, this.ca = e.ca || null, this.ciphers = e.ciphers || null, this.rejectUnauthorized = e.rejectUnauthorized || null, this.open();
        }

        function o(t) {
          var e = {};

          for (var n in t) {
            t.hasOwnProperty(n) && (e[n] = t[n]);
          }

          return e;
        }

        var i = t("./transports"),
            s = t("component-emitter"),
            a = t("debug")("engine.io-client:socket"),
            c = t("indexof"),
            p = t("engine.io-parser"),
            u = t("parseuri"),
            f = t("parsejson"),
            h = t("parseqs");
        e.exports = r, r.priorWebsocketSuccess = !1, s(r.prototype), r.protocol = p.protocol, r.Socket = r, r.Transport = t("./transport"), r.transports = t("./transports"), r.parser = t("engine.io-parser"), r.prototype.createTransport = function (t) {
          a('creating transport "%s"', t);
          var e = o(this.query);
          e.EIO = p.protocol, e.transport = t, this.id && (e.sid = this.id);
          var n = new i[t]({
            agent: this.agent,
            hostname: this.hostname,
            port: this.port,
            secure: this.secure,
            path: this.path,
            query: e,
            forceJSONP: this.forceJSONP,
            jsonp: this.jsonp,
            forceBase64: this.forceBase64,
            enablesXDR: this.enablesXDR,
            timestampRequests: this.timestampRequests,
            timestampParam: this.timestampParam,
            policyPort: this.policyPort,
            socket: this,
            pfx: this.pfx,
            key: this.key,
            passphrase: this.passphrase,
            cert: this.cert,
            ca: this.ca,
            ciphers: this.ciphers,
            rejectUnauthorized: this.rejectUnauthorized
          });
          return n;
        }, r.prototype.open = function () {
          var t;
          if (this.rememberUpgrade && r.priorWebsocketSuccess && -1 != this.transports.indexOf("websocket")) t = "websocket";else {
            if (0 == this.transports.length) {
              var e = this;
              return void setTimeout(function () {
                e.emit("error", "No transports available");
              }, 0);
            }

            t = this.transports[0];
          }
          this.readyState = "opening";
          var t;

          try {
            t = this.createTransport(t);
          } catch (n) {
            return this.transports.shift(), void this.open();
          }

          t.open(), this.setTransport(t);
        }, r.prototype.setTransport = function (t) {
          a("setting transport %s", t.name);
          var e = this;
          this.transport && (a("clearing existing transport %s", this.transport.name), this.transport.removeAllListeners()), this.transport = t, t.on("drain", function () {
            e.onDrain();
          }).on("packet", function (t) {
            e.onPacket(t);
          }).on("error", function (t) {
            e.onError(t);
          }).on("close", function () {
            e.onClose("transport close");
          });
        }, r.prototype.probe = function (t) {
          function e() {
            if (h.onlyBinaryUpgrades) {
              var e = !this.supportsBinary && h.transport.supportsBinary;
              f = f || e;
            }

            f || (a('probe transport "%s" opened', t), u.send([{
              type: "ping",
              data: "probe"
            }]), u.once("packet", function (e) {
              if (!f) if ("pong" == e.type && "probe" == e.data) {
                if (a('probe transport "%s" pong', t), h.upgrading = !0, h.emit("upgrading", u), !u) return;
                r.priorWebsocketSuccess = "websocket" == u.name, a('pausing current transport "%s"', h.transport.name), h.transport.pause(function () {
                  f || "closed" != h.readyState && (a("changing transport and sending upgrade packet"), p(), h.setTransport(u), u.send([{
                    type: "upgrade"
                  }]), h.emit("upgrade", u), u = null, h.upgrading = !1, h.flush());
                });
              } else {
                a('probe transport "%s" failed', t);
                var n = new Error("probe error");
                n.transport = u.name, h.emit("upgradeError", n);
              }
            }));
          }

          function n() {
            f || (f = !0, p(), u.close(), u = null);
          }

          function o(e) {
            var r = new Error("probe error: " + e);
            r.transport = u.name, n(), a('probe transport "%s" failed because of error: %s', t, e), h.emit("upgradeError", r);
          }

          function i() {
            o("transport closed");
          }

          function s() {
            o("socket closed");
          }

          function c(t) {
            u && t.name != u.name && (a('"%s" works - aborting "%s"', t.name, u.name), n());
          }

          function p() {
            u.removeListener("open", e), u.removeListener("error", o), u.removeListener("close", i), h.removeListener("close", s), h.removeListener("upgrading", c);
          }

          a('probing transport "%s"', t);
          var u = this.createTransport(t, {
            probe: 1
          }),
              f = !1,
              h = this;
          r.priorWebsocketSuccess = !1, u.once("open", e), u.once("error", o), u.once("close", i), this.once("close", s), this.once("upgrading", c), u.open();
        }, r.prototype.onOpen = function () {
          if (a("socket open"), this.readyState = "open", r.priorWebsocketSuccess = "websocket" == this.transport.name, this.emit("open"), this.flush(), "open" == this.readyState && this.upgrade && this.transport.pause) {
            a("starting upgrade probes");

            for (var t = 0, e = this.upgrades.length; e > t; t++) {
              this.probe(this.upgrades[t]);
            }
          }
        }, r.prototype.onPacket = function (t) {
          if ("opening" == this.readyState || "open" == this.readyState) switch (a('socket receive: type "%s", data "%s"', t.type, t.data), this.emit("packet", t), this.emit("heartbeat"), t.type) {
            case "open":
              this.onHandshake(f(t.data));
              break;

            case "pong":
              this.setPing();
              break;

            case "error":
              var e = new Error("server error");
              e.code = t.data, this.emit("error", e);
              break;

            case "message":
              this.emit("data", t.data), this.emit("message", t.data);
          } else a('packet received with socket readyState "%s"', this.readyState);
        }, r.prototype.onHandshake = function (t) {
          this.emit("handshake", t), this.id = t.sid, this.transport.query.sid = t.sid, this.upgrades = this.filterUpgrades(t.upgrades), this.pingInterval = t.pingInterval, this.pingTimeout = t.pingTimeout, this.onOpen(), "closed" != this.readyState && (this.setPing(), this.removeListener("heartbeat", this.onHeartbeat), this.on("heartbeat", this.onHeartbeat));
        }, r.prototype.onHeartbeat = function (t) {
          clearTimeout(this.pingTimeoutTimer);
          var e = this;
          e.pingTimeoutTimer = setTimeout(function () {
            "closed" != e.readyState && e.onClose("ping timeout");
          }, t || e.pingInterval + e.pingTimeout);
        }, r.prototype.setPing = function () {
          var t = this;
          clearTimeout(t.pingIntervalTimer), t.pingIntervalTimer = setTimeout(function () {
            a("writing ping packet - expecting pong within %sms", t.pingTimeout), t.ping(), t.onHeartbeat(t.pingTimeout);
          }, t.pingInterval);
        }, r.prototype.ping = function () {
          this.sendPacket("ping");
        }, r.prototype.onDrain = function () {
          for (var t = 0; t < this.prevBufferLen; t++) {
            this.callbackBuffer[t] && this.callbackBuffer[t]();
          }

          this.writeBuffer.splice(0, this.prevBufferLen), this.callbackBuffer.splice(0, this.prevBufferLen), this.prevBufferLen = 0, 0 == this.writeBuffer.length ? this.emit("drain") : this.flush();
        }, r.prototype.flush = function () {
          "closed" != this.readyState && this.transport.writable && !this.upgrading && this.writeBuffer.length && (a("flushing %d packets in socket", this.writeBuffer.length), this.transport.send(this.writeBuffer), this.prevBufferLen = this.writeBuffer.length, this.emit("flush"));
        }, r.prototype.write = r.prototype.send = function (t, e) {
          return this.sendPacket("message", t, e), this;
        }, r.prototype.sendPacket = function (t, e, n) {
          if ("closing" != this.readyState && "closed" != this.readyState) {
            var r = {
              type: t,
              data: e
            };
            this.emit("packetCreate", r), this.writeBuffer.push(r), this.callbackBuffer.push(n), this.flush();
          }
        }, r.prototype.close = function () {
          function t() {
            r.onClose("forced close"), a("socket closing - telling transport to close"), r.transport.close();
          }

          function e() {
            r.removeListener("upgrade", e), r.removeListener("upgradeError", e), t();
          }

          function n() {
            r.once("upgrade", e), r.once("upgradeError", e);
          }

          if ("opening" == this.readyState || "open" == this.readyState) {
            this.readyState = "closing";
            var r = this;
            this.writeBuffer.length ? this.once("drain", function () {
              this.upgrading ? n() : t();
            }) : this.upgrading ? n() : t();
          }

          return this;
        }, r.prototype.onError = function (t) {
          a("socket error %j", t), r.priorWebsocketSuccess = !1, this.emit("error", t), this.onClose("transport error", t);
        }, r.prototype.onClose = function (t, e) {
          if ("opening" == this.readyState || "open" == this.readyState || "closing" == this.readyState) {
            a('socket close with reason: "%s"', t);
            var n = this;
            clearTimeout(this.pingIntervalTimer), clearTimeout(this.pingTimeoutTimer), setTimeout(function () {
              n.writeBuffer = [], n.callbackBuffer = [], n.prevBufferLen = 0;
            }, 0), this.transport.removeAllListeners("close"), this.transport.close(), this.transport.removeAllListeners(), this.readyState = "closed", this.id = null, this.emit("close", t, e);
          }
        }, r.prototype.filterUpgrades = function (t) {
          for (var e = [], n = 0, r = t.length; r > n; n++) {
            ~c(this.transports, t[n]) && e.push(t[n]);
          }

          return e;
        };
      }).call(this, "undefined" != typeof self ? self : "undefined" != typeof window ? window : {});
    }, {
      "./transport": 14,
      "./transports": 15,
      "component-emitter": 9,
      debug: 22,
      "engine.io-parser": 25,
      indexof: 40,
      parsejson: 32,
      parseqs: 33,
      parseuri: 34
    }],
    14: [function (t, e) {
      function n(t) {
        this.path = t.path, this.hostname = t.hostname, this.port = t.port, this.secure = t.secure, this.query = t.query, this.timestampParam = t.timestampParam, this.timestampRequests = t.timestampRequests, this.readyState = "", this.agent = t.agent || !1, this.socket = t.socket, this.enablesXDR = t.enablesXDR, this.pfx = t.pfx, this.key = t.key, this.passphrase = t.passphrase, this.cert = t.cert, this.ca = t.ca, this.ciphers = t.ciphers, this.rejectUnauthorized = t.rejectUnauthorized;
      }

      var r = t("engine.io-parser"),
          o = t("component-emitter");
      e.exports = n, o(n.prototype), n.timestamps = 0, n.prototype.onError = function (t, e) {
        var n = new Error(t);
        return n.type = "TransportError", n.description = e, this.emit("error", n), this;
      }, n.prototype.open = function () {
        return ("closed" == this.readyState || "" == this.readyState) && (this.readyState = "opening", this.doOpen()), this;
      }, n.prototype.close = function () {
        return ("opening" == this.readyState || "open" == this.readyState) && (this.doClose(), this.onClose()), this;
      }, n.prototype.send = function (t) {
        if ("open" != this.readyState) throw new Error("Transport not open");
        this.write(t);
      }, n.prototype.onOpen = function () {
        this.readyState = "open", this.writable = !0, this.emit("open");
      }, n.prototype.onData = function (t) {
        var e = r.decodePacket(t, this.socket.binaryType);
        this.onPacket(e);
      }, n.prototype.onPacket = function (t) {
        this.emit("packet", t);
      }, n.prototype.onClose = function () {
        this.readyState = "closed", this.emit("close");
      };
    }, {
      "component-emitter": 9,
      "engine.io-parser": 25
    }],
    15: [function (t, e, n) {
      (function (e) {
        function r(t) {
          var n,
              r = !1,
              a = !1,
              c = !1 !== t.jsonp;

          if (e.location) {
            var p = "https:" == location.protocol,
                u = location.port;
            u || (u = p ? 443 : 80), r = t.hostname != location.hostname || u != t.port, a = t.secure != p;
          }

          if (t.xdomain = r, t.xscheme = a, n = new o(t), "open" in n && !t.forceJSONP) return new i(t);
          if (!c) throw new Error("JSONP disabled");
          return new s(t);
        }

        var o = t("xmlhttprequest"),
            i = t("./polling-xhr"),
            s = t("./polling-jsonp"),
            a = t("./websocket");
        n.polling = r, n.websocket = a;
      }).call(this, "undefined" != typeof self ? self : "undefined" != typeof window ? window : {});
    }, {
      "./polling-jsonp": 16,
      "./polling-xhr": 17,
      "./websocket": 19,
      xmlhttprequest: 20
    }],
    16: [function (t, e) {
      (function (n) {
        function r() {}

        function o(t) {
          i.call(this, t), this.query = this.query || {}, a || (n.___eio || (n.___eio = []), a = n.___eio), this.index = a.length;
          var e = this;
          a.push(function (t) {
            e.onData(t);
          }), this.query.j = this.index, n.document && n.addEventListener && n.addEventListener("beforeunload", function () {
            e.script && (e.script.onerror = r);
          }, !1);
        }

        var i = t("./polling"),
            s = t("component-inherit");
        e.exports = o;
        var a,
            c = /\n/g,
            p = /\\n/g;
        s(o, i), o.prototype.supportsBinary = !1, o.prototype.doClose = function () {
          this.script && (this.script.parentNode.removeChild(this.script), this.script = null), this.form && (this.form.parentNode.removeChild(this.form), this.form = null, this.iframe = null), i.prototype.doClose.call(this);
        }, o.prototype.doPoll = function () {
          var t = this,
              e = document.createElement("script");
          this.script && (this.script.parentNode.removeChild(this.script), this.script = null), e.async = !0, e.src = this.uri(), e.onerror = function (e) {
            t.onError("jsonp poll error", e);
          };
          var n = document.getElementsByTagName("script")[0];
          n.parentNode.insertBefore(e, n), this.script = e;
          var r = "undefined" != typeof navigator && /gecko/i.test(navigator.userAgent);
          r && setTimeout(function () {
            var t = document.createElement("iframe");
            document.body.appendChild(t), document.body.removeChild(t);
          }, 100);
        }, o.prototype.doWrite = function (t, e) {
          function n() {
            r(), e();
          }

          function r() {
            if (o.iframe) try {
              o.form.removeChild(o.iframe);
            } catch (t) {
              o.onError("jsonp polling iframe removal error", t);
            }

            try {
              var e = '<iframe src="javascript:0" name="' + o.iframeId + '">';
              i = document.createElement(e);
            } catch (t) {
              i = document.createElement("iframe"), i.name = o.iframeId, i.src = "javascript:0";
            }

            i.id = o.iframeId, o.form.appendChild(i), o.iframe = i;
          }

          var o = this;

          if (!this.form) {
            var i,
                s = document.createElement("form"),
                a = document.createElement("textarea"),
                u = this.iframeId = "eio_iframe_" + this.index;
            s.className = "socketio", s.style.position = "absolute", s.style.top = "-1000px", s.style.left = "-1000px", s.target = u, s.method = "POST", s.setAttribute("accept-charset", "utf-8"), a.name = "d", s.appendChild(a), document.body.appendChild(s), this.form = s, this.area = a;
          }

          this.form.action = this.uri(), r(), t = t.replace(p, "\\\n"), this.area.value = t.replace(c, "\\n");

          try {
            this.form.submit();
          } catch (f) {}

          this.iframe.attachEvent ? this.iframe.onreadystatechange = function () {
            "complete" == o.iframe.readyState && n();
          } : this.iframe.onload = n;
        };
      }).call(this, "undefined" != typeof self ? self : "undefined" != typeof window ? window : {});
    }, {
      "./polling": 18,
      "component-inherit": 21
    }],
    17: [function (t, e) {
      (function (n) {
        function r() {}

        function o(t) {
          if (c.call(this, t), n.location) {
            var e = "https:" == location.protocol,
                r = location.port;
            r || (r = e ? 443 : 80), this.xd = t.hostname != n.location.hostname || r != t.port, this.xs = t.secure != e;
          }
        }

        function i(t) {
          this.method = t.method || "GET", this.uri = t.uri, this.xd = !!t.xd, this.xs = !!t.xs, this.async = !1 !== t.async, this.data = void 0 != t.data ? t.data : null, this.agent = t.agent, this.isBinary = t.isBinary, this.supportsBinary = t.supportsBinary, this.enablesXDR = t.enablesXDR, this.pfx = t.pfx, this.key = t.key, this.passphrase = t.passphrase, this.cert = t.cert, this.ca = t.ca, this.ciphers = t.ciphers, this.rejectUnauthorized = t.rejectUnauthorized, this.create();
        }

        function s() {
          for (var t in i.requests) {
            i.requests.hasOwnProperty(t) && i.requests[t].abort();
          }
        }

        var a = t("xmlhttprequest"),
            c = t("./polling"),
            p = t("component-emitter"),
            u = t("component-inherit"),
            f = t("debug")("engine.io-client:polling-xhr");
        e.exports = o, e.exports.Request = i, u(o, c), o.prototype.supportsBinary = !0, o.prototype.request = function (t) {
          return t = t || {}, t.uri = this.uri(), t.xd = this.xd, t.xs = this.xs, t.agent = this.agent || !1, t.supportsBinary = this.supportsBinary, t.enablesXDR = this.enablesXDR, t.pfx = this.pfx, t.key = this.key, t.passphrase = this.passphrase, t.cert = this.cert, t.ca = this.ca, t.ciphers = this.ciphers, t.rejectUnauthorized = this.rejectUnauthorized, new i(t);
        }, o.prototype.doWrite = function (t, e) {
          var n = "string" != typeof t && void 0 !== t,
              r = this.request({
            method: "POST",
            data: t,
            isBinary: n
          }),
              o = this;
          r.on("success", e), r.on("error", function (t) {
            o.onError("xhr post error", t);
          }), this.sendXhr = r;
        }, o.prototype.doPoll = function () {
          f("xhr poll");
          var t = this.request(),
              e = this;
          t.on("data", function (t) {
            e.onData(t);
          }), t.on("error", function (t) {
            e.onError("xhr poll error", t);
          }), this.pollXhr = t;
        }, p(i.prototype), i.prototype.create = function () {
          var t = {
            agent: this.agent,
            xdomain: this.xd,
            xscheme: this.xs,
            enablesXDR: this.enablesXDR
          };
          t.pfx = this.pfx, t.key = this.key, t.passphrase = this.passphrase, t.cert = this.cert, t.ca = this.ca, t.ciphers = this.ciphers, t.rejectUnauthorized = this.rejectUnauthorized;
          var e = this.xhr = new a(t),
              r = this;

          try {
            if (f("xhr open %s: %s", this.method, this.uri), e.open(this.method, this.uri, this.async), this.supportsBinary && (e.responseType = "arraybuffer"), "POST" == this.method) try {
              this.isBinary ? e.setRequestHeader("Content-type", "application/octet-stream") : e.setRequestHeader("Content-type", "text/plain;charset=UTF-8");
            } catch (o) {}
            "withCredentials" in e && (e.withCredentials = !0), this.hasXDR() ? (e.onload = function () {
              r.onLoad();
            }, e.onerror = function () {
              r.onError(e.responseText);
            }) : e.onreadystatechange = function () {
              4 == e.readyState && (200 == e.status || 1223 == e.status ? r.onLoad() : setTimeout(function () {
                r.onError(e.status);
              }, 0));
            }, f("xhr data %s", this.data), e.send(this.data);
          } catch (o) {
            return void setTimeout(function () {
              r.onError(o);
            }, 0);
          }

          n.document && (this.index = i.requestsCount++, i.requests[this.index] = this);
        }, i.prototype.onSuccess = function () {
          this.emit("success"), this.cleanup();
        }, i.prototype.onData = function (t) {
          this.emit("data", t), this.onSuccess();
        }, i.prototype.onError = function (t) {
          this.emit("error", t), this.cleanup(!0);
        }, i.prototype.cleanup = function (t) {
          if ("undefined" != typeof this.xhr && null !== this.xhr) {
            if (this.hasXDR() ? this.xhr.onload = this.xhr.onerror = r : this.xhr.onreadystatechange = r, t) try {
              this.xhr.abort();
            } catch (e) {}
            n.document && delete i.requests[this.index], this.xhr = null;
          }
        }, i.prototype.onLoad = function () {
          var t;

          try {
            var e;

            try {
              e = this.xhr.getResponseHeader("Content-Type").split(";")[0];
            } catch (n) {}

            t = "application/octet-stream" === e ? this.xhr.response : this.supportsBinary ? "ok" : this.xhr.responseText;
          } catch (n) {
            this.onError(n);
          }

          null != t && this.onData(t);
        }, i.prototype.hasXDR = function () {
          return "undefined" != typeof n.XDomainRequest && !this.xs && this.enablesXDR;
        }, i.prototype.abort = function () {
          this.cleanup();
        }, n.document && (i.requestsCount = 0, i.requests = {}, n.attachEvent ? n.attachEvent("onunload", s) : n.addEventListener && n.addEventListener("beforeunload", s, !1));
      }).call(this, "undefined" != typeof self ? self : "undefined" != typeof window ? window : {});
    }, {
      "./polling": 18,
      "component-emitter": 9,
      "component-inherit": 21,
      debug: 22,
      xmlhttprequest: 20
    }],
    18: [function (t, e) {
      function n(t) {
        var e = t && t.forceBase64;
        (!c || e) && (this.supportsBinary = !1), r.call(this, t);
      }

      var r = t("../transport"),
          o = t("parseqs"),
          i = t("engine.io-parser"),
          s = t("component-inherit"),
          a = t("debug")("engine.io-client:polling");
      e.exports = n;

      var c = function () {
        var e = t("xmlhttprequest"),
            n = new e({
          xdomain: !1
        });
        return null != n.responseType;
      }();

      s(n, r), n.prototype.name = "polling", n.prototype.doOpen = function () {
        this.poll();
      }, n.prototype.pause = function (t) {
        function e() {
          a("paused"), n.readyState = "paused", t();
        }

        var n = this;

        if (this.readyState = "pausing", this.polling || !this.writable) {
          var r = 0;
          this.polling && (a("we are currently polling - waiting to pause"), r++, this.once("pollComplete", function () {
            a("pre-pause polling complete"), --r || e();
          })), this.writable || (a("we are currently writing - waiting to pause"), r++, this.once("drain", function () {
            a("pre-pause writing complete"), --r || e();
          }));
        } else e();
      }, n.prototype.poll = function () {
        a("polling"), this.polling = !0, this.doPoll(), this.emit("poll");
      }, n.prototype.onData = function (t) {
        var e = this;
        a("polling got data %s", t);

        var n = function n(t) {
          return "opening" == e.readyState && e.onOpen(), "close" == t.type ? (e.onClose(), !1) : void e.onPacket(t);
        };

        i.decodePayload(t, this.socket.binaryType, n), "closed" != this.readyState && (this.polling = !1, this.emit("pollComplete"), "open" == this.readyState ? this.poll() : a('ignoring poll - transport state "%s"', this.readyState));
      }, n.prototype.doClose = function () {
        function t() {
          a("writing close packet"), e.write([{
            type: "close"
          }]);
        }

        var e = this;
        "open" == this.readyState ? (a("transport open - closing"), t()) : (a("transport not open - deferring close"), this.once("open", t));
      }, n.prototype.write = function (t) {
        var e = this;
        this.writable = !1;

        var n = function n() {
          e.writable = !0, e.emit("drain");
        },
            e = this;

        i.encodePayload(t, this.supportsBinary, function (t) {
          e.doWrite(t, n);
        });
      }, n.prototype.uri = function () {
        var t = this.query || {},
            e = this.secure ? "https" : "http",
            n = "";
        return !1 !== this.timestampRequests && (t[this.timestampParam] = +new Date() + "-" + r.timestamps++), this.supportsBinary || t.sid || (t.b64 = 1), t = o.encode(t), this.port && ("https" == e && 443 != this.port || "http" == e && 80 != this.port) && (n = ":" + this.port), t.length && (t = "?" + t), e + "://" + this.hostname + n + this.path + t;
      };
    }, {
      "../transport": 14,
      "component-inherit": 21,
      debug: 22,
      "engine.io-parser": 25,
      parseqs: 33,
      xmlhttprequest: 20
    }],
    19: [function (t, e) {
      function n(t) {
        var e = t && t.forceBase64;
        e && (this.supportsBinary = !1), r.call(this, t);
      }

      var r = t("../transport"),
          o = t("engine.io-parser"),
          i = t("parseqs"),
          s = t("component-inherit"),
          a = t("debug")("engine.io-client:websocket"),
          c = t("ws");
      e.exports = n, s(n, r), n.prototype.name = "websocket", n.prototype.supportsBinary = !0, n.prototype.doOpen = function () {
        if (this.check()) {
          var t = this.uri(),
              e = void 0,
              n = {
            agent: this.agent
          };
          n.pfx = this.pfx, n.key = this.key, n.passphrase = this.passphrase, n.cert = this.cert, n.ca = this.ca, n.ciphers = this.ciphers, n.rejectUnauthorized = this.rejectUnauthorized, this.ws = new c(t, e, n), void 0 === this.ws.binaryType && (this.supportsBinary = !1), this.ws.binaryType = "arraybuffer", this.addEventListeners();
        }
      }, n.prototype.addEventListeners = function () {
        var t = this;
        this.ws.onopen = function () {
          t.onOpen();
        }, this.ws.onclose = function () {
          t.onClose();
        }, this.ws.onmessage = function (e) {
          t.onData(e.data);
        }, this.ws.onerror = function (e) {
          t.onError("websocket error", e);
        };
      }, "undefined" != typeof navigator && /iPad|iPhone|iPod/i.test(navigator.userAgent) && (n.prototype.onData = function (t) {
        var e = this;
        setTimeout(function () {
          r.prototype.onData.call(e, t);
        }, 0);
      }), n.prototype.write = function (t) {
        function e() {
          n.writable = !0, n.emit("drain");
        }

        var n = this;
        this.writable = !1;

        for (var r = 0, i = t.length; i > r; r++) {
          o.encodePacket(t[r], this.supportsBinary, function (t) {
            try {
              n.ws.send(t);
            } catch (e) {
              a("websocket closed before onclose event");
            }
          });
        }

        setTimeout(e, 0);
      }, n.prototype.onClose = function () {
        r.prototype.onClose.call(this);
      }, n.prototype.doClose = function () {
        "undefined" != typeof this.ws && this.ws.close();
      }, n.prototype.uri = function () {
        var t = this.query || {},
            e = this.secure ? "wss" : "ws",
            n = "";
        return this.port && ("wss" == e && 443 != this.port || "ws" == e && 80 != this.port) && (n = ":" + this.port), this.timestampRequests && (t[this.timestampParam] = +new Date()), this.supportsBinary || (t.b64 = 1), t = i.encode(t), t.length && (t = "?" + t), e + "://" + this.hostname + n + this.path + t;
      }, n.prototype.check = function () {
        return !(!c || "__initialize" in c && this.name === n.prototype.name);
      };
    }, {
      "../transport": 14,
      "component-inherit": 21,
      debug: 22,
      "engine.io-parser": 25,
      parseqs: 33,
      ws: 35
    }],
    20: [function (t, e) {
      var n = t("has-cors");

      e.exports = function (t) {
        var e = t.xdomain,
            r = t.xscheme,
            o = t.enablesXDR;

        try {
          if ("undefined" != typeof XMLHttpRequest && (!e || n)) return new XMLHttpRequest();
        } catch (i) {}

        try {
          if ("undefined" != typeof XDomainRequest && !r && o) return new XDomainRequest();
        } catch (i) {}

        if (!e) try {
          return new ActiveXObject("Microsoft.XMLHTTP");
        } catch (i) {}
      };
    }, {
      "has-cors": 38
    }],
    21: [function (t, e) {
      e.exports = function (t, e) {
        var n = function n() {};

        n.prototype = e.prototype, t.prototype = new n(), t.prototype.constructor = t;
      };
    }, {}],
    22: [function (t, e, n) {
      function r() {
        return "WebkitAppearance" in document.documentElement.style || window.console && (console.firebug || console.exception && console.table) || navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31;
      }

      function o() {
        var t = arguments,
            e = this.useColors;
        if (t[0] = (e ? "%c" : "") + this.namespace + (e ? " %c" : " ") + t[0] + (e ? "%c " : " ") + "+" + n.humanize(this.diff), !e) return t;
        var r = "color: " + this.color;
        t = [t[0], r, "color: inherit"].concat(Array.prototype.slice.call(t, 1));
        var o = 0,
            i = 0;
        return t[0].replace(/%[a-z%]/g, function (t) {
          "%%" !== t && (o++, "%c" === t && (i = o));
        }), t.splice(i, 0, r), t;
      }

      function i() {
        return "object" == (typeof console === "undefined" ? "undefined" : _typeof(console)) && "function" == typeof console.log && Function.prototype.apply.call(console.log, console, arguments);
      }

      function s(t) {
        try {
          null == t ? localStorage.removeItem("debug") : localStorage.debug = t;
        } catch (e) {}
      }

      function a() {
        var t;

        try {
          t = localStorage.debug;
        } catch (e) {}

        return t;
      }

      n = e.exports = t("./debug"), n.log = i, n.formatArgs = o, n.save = s, n.load = a, n.useColors = r, n.colors = ["lightseagreen", "forestgreen", "goldenrod", "dodgerblue", "darkorchid", "crimson"], n.formatters.j = function (t) {
        return JSON.stringify(t);
      }, n.enable(a());
    }, {
      "./debug": 23
    }],
    23: [function (t, e, n) {
      function r() {
        return n.colors[u++ % n.colors.length];
      }

      function o(t) {
        function e() {}

        function o() {
          var t = o,
              e = +new Date(),
              i = e - (p || e);
          t.diff = i, t.prev = p, t.curr = e, p = e, null == t.useColors && (t.useColors = n.useColors()), null == t.color && t.useColors && (t.color = r());
          var s = Array.prototype.slice.call(arguments);
          s[0] = n.coerce(s[0]), "string" != typeof s[0] && (s = ["%o"].concat(s));
          var a = 0;
          s[0] = s[0].replace(/%([a-z%])/g, function (e, r) {
            if ("%%" === e) return e;
            a++;
            var o = n.formatters[r];

            if ("function" == typeof o) {
              var i = s[a];
              e = o.call(t, i), s.splice(a, 1), a--;
            }

            return e;
          }), "function" == typeof n.formatArgs && (s = n.formatArgs.apply(t, s));
          var c = o.log || n.log || console.log.bind(console);
          c.apply(t, s);
        }

        e.enabled = !1, o.enabled = !0;
        var i = n.enabled(t) ? o : e;
        return i.namespace = t, i;
      }

      function i(t) {
        n.save(t);

        for (var e = (t || "").split(/[\s,]+/), r = e.length, o = 0; r > o; o++) {
          e[o] && (t = e[o].replace(/\*/g, ".*?"), "-" === t[0] ? n.skips.push(new RegExp("^" + t.substr(1) + "$")) : n.names.push(new RegExp("^" + t + "$")));
        }
      }

      function s() {
        n.enable("");
      }

      function a(t) {
        var e, r;

        for (e = 0, r = n.skips.length; r > e; e++) {
          if (n.skips[e].test(t)) return !1;
        }

        for (e = 0, r = n.names.length; r > e; e++) {
          if (n.names[e].test(t)) return !0;
        }

        return !1;
      }

      function c(t) {
        return t instanceof Error ? t.stack || t.message : t;
      }

      n = e.exports = o, n.coerce = c, n.disable = s, n.enable = i, n.enabled = a, n.humanize = t("ms"), n.names = [], n.skips = [], n.formatters = {};
      var p,
          u = 0;
    }, {
      ms: 24
    }],
    24: [function (t, e) {
      function n(t) {
        var e = /^((?:\d+)?\.?\d+) *(ms|seconds?|s|minutes?|m|hours?|h|days?|d|years?|y)?$/i.exec(t);

        if (e) {
          var n = parseFloat(e[1]),
              r = (e[2] || "ms").toLowerCase();

          switch (r) {
            case "years":
            case "year":
            case "y":
              return n * u;

            case "days":
            case "day":
            case "d":
              return n * p;

            case "hours":
            case "hour":
            case "h":
              return n * c;

            case "minutes":
            case "minute":
            case "m":
              return n * a;

            case "seconds":
            case "second":
            case "s":
              return n * s;

            case "ms":
              return n;
          }
        }
      }

      function r(t) {
        return t >= p ? Math.round(t / p) + "d" : t >= c ? Math.round(t / c) + "h" : t >= a ? Math.round(t / a) + "m" : t >= s ? Math.round(t / s) + "s" : t + "ms";
      }

      function o(t) {
        return i(t, p, "day") || i(t, c, "hour") || i(t, a, "minute") || i(t, s, "second") || t + " ms";
      }

      function i(t, e, n) {
        return e > t ? void 0 : 1.5 * e > t ? Math.floor(t / e) + " " + n : Math.ceil(t / e) + " " + n + "s";
      }

      var s = 1e3,
          a = 60 * s,
          c = 60 * a,
          p = 24 * c,
          u = 365.25 * p;

      e.exports = function (t, e) {
        return e = e || {}, "string" == typeof t ? n(t) : e.long ? o(t) : r(t);
      };
    }, {}],
    25: [function (t, e, n) {
      (function (e) {
        function r(t, e) {
          var r = "b" + n.packets[t.type] + t.data.data;
          return e(r);
        }

        function o(t, e, r) {
          if (!e) return n.encodeBase64Packet(t, r);
          var o = t.data,
              i = new Uint8Array(o),
              s = new Uint8Array(1 + o.byteLength);
          s[0] = m[t.type];

          for (var a = 0; a < i.length; a++) {
            s[a + 1] = i[a];
          }

          return r(s.buffer);
        }

        function i(t, e, r) {
          if (!e) return n.encodeBase64Packet(t, r);
          var o = new FileReader();
          return o.onload = function () {
            t.data = o.result, n.encodePacket(t, e, !0, r);
          }, o.readAsArrayBuffer(t.data);
        }

        function s(t, e, r) {
          if (!e) return n.encodeBase64Packet(t, r);
          if (g) return i(t, e, r);
          var o = new Uint8Array(1);
          o[0] = m[t.type];
          var s = new w([o.buffer, t.data]);
          return r(s);
        }

        function a(t, e, n) {
          for (var r = new Array(t.length), o = h(t.length, n), i = function i(t, n, o) {
            e(n, function (e, n) {
              r[t] = n, o(e, r);
            });
          }, s = 0; s < t.length; s++) {
            i(s, t[s], o);
          }
        }

        var c = t("./keys"),
            p = t("has-binary"),
            u = t("arraybuffer.slice"),
            f = t("base64-arraybuffer"),
            h = t("after"),
            l = t("utf8"),
            d = navigator.userAgent.match(/Android/i),
            y = /PhantomJS/i.test(navigator.userAgent),
            g = d || y;
        n.protocol = 3;
        var m = n.packets = {
          open: 0,
          close: 1,
          ping: 2,
          pong: 3,
          message: 4,
          upgrade: 5,
          noop: 6
        },
            v = c(m),
            b = {
          type: "error",
          data: "parser error"
        },
            w = t("blob");
        n.encodePacket = function (t, n, i, a) {
          "function" == typeof n && (a = n, n = !1), "function" == typeof i && (a = i, i = null);
          var c = void 0 === t.data ? void 0 : t.data.buffer || t.data;
          if (e.ArrayBuffer && c instanceof ArrayBuffer) return o(t, n, a);
          if (w && c instanceof e.Blob) return s(t, n, a);
          if (c && c.base64) return r(t, a);
          var p = m[t.type];
          return void 0 !== t.data && (p += i ? l.encode(String(t.data)) : String(t.data)), a("" + p);
        }, n.encodeBase64Packet = function (t, r) {
          var o = "b" + n.packets[t.type];

          if (w && t.data instanceof w) {
            var i = new FileReader();
            return i.onload = function () {
              var t = i.result.split(",")[1];
              r(o + t);
            }, i.readAsDataURL(t.data);
          }

          var s;

          try {
            s = String.fromCharCode.apply(null, new Uint8Array(t.data));
          } catch (a) {
            for (var c = new Uint8Array(t.data), p = new Array(c.length), u = 0; u < c.length; u++) {
              p[u] = c[u];
            }

            s = String.fromCharCode.apply(null, p);
          }

          return o += e.btoa(s), r(o);
        }, n.decodePacket = function (t, e, r) {
          if ("string" == typeof t || void 0 === t) {
            if ("b" == t.charAt(0)) return n.decodeBase64Packet(t.substr(1), e);
            if (r) try {
              t = l.decode(t);
            } catch (o) {
              return b;
            }
            var i = t.charAt(0);
            return Number(i) == i && v[i] ? t.length > 1 ? {
              type: v[i],
              data: t.substring(1)
            } : {
              type: v[i]
            } : b;
          }

          var s = new Uint8Array(t),
              i = s[0],
              a = u(t, 1);
          return w && "blob" === e && (a = new w([a])), {
            type: v[i],
            data: a
          };
        }, n.decodeBase64Packet = function (t, n) {
          var r = v[t.charAt(0)];
          if (!e.ArrayBuffer) return {
            type: r,
            data: {
              base64: !0,
              data: t.substr(1)
            }
          };
          var o = f.decode(t.substr(1));
          return "blob" === n && w && (o = new w([o])), {
            type: r,
            data: o
          };
        }, n.encodePayload = function (t, e, r) {
          function o(t) {
            return t.length + ":" + t;
          }

          function i(t, r) {
            n.encodePacket(t, s ? e : !1, !0, function (t) {
              r(null, o(t));
            });
          }

          "function" == typeof e && (r = e, e = null);
          var s = p(t);
          return e && s ? w && !g ? n.encodePayloadAsBlob(t, r) : n.encodePayloadAsArrayBuffer(t, r) : t.length ? void a(t, i, function (t, e) {
            return r(e.join(""));
          }) : r("0:");
        }, n.decodePayload = function (t, e, r) {
          if ("string" != typeof t) return n.decodePayloadAsBinary(t, e, r);
          "function" == typeof e && (r = e, e = null);
          var o;
          if ("" == t) return r(b, 0, 1);

          for (var i, s, a = "", c = 0, p = t.length; p > c; c++) {
            var u = t.charAt(c);
            if (":" != u) a += u;else {
              if ("" == a || a != (i = Number(a))) return r(b, 0, 1);
              if (s = t.substr(c + 1, i), a != s.length) return r(b, 0, 1);

              if (s.length) {
                if (o = n.decodePacket(s, e, !0), b.type == o.type && b.data == o.data) return r(b, 0, 1);
                var f = r(o, c + i, p);
                if (!1 === f) return;
              }

              c += i, a = "";
            }
          }

          return "" != a ? r(b, 0, 1) : void 0;
        }, n.encodePayloadAsArrayBuffer = function (t, e) {
          function r(t, e) {
            n.encodePacket(t, !0, !0, function (t) {
              return e(null, t);
            });
          }

          return t.length ? void a(t, r, function (t, n) {
            var r = n.reduce(function (t, e) {
              var n;
              return n = "string" == typeof e ? e.length : e.byteLength, t + n.toString().length + n + 2;
            }, 0),
                o = new Uint8Array(r),
                i = 0;
            return n.forEach(function (t) {
              var e = "string" == typeof t,
                  n = t;

              if (e) {
                for (var r = new Uint8Array(t.length), s = 0; s < t.length; s++) {
                  r[s] = t.charCodeAt(s);
                }

                n = r.buffer;
              }

              o[i++] = e ? 0 : 1;

              for (var a = n.byteLength.toString(), s = 0; s < a.length; s++) {
                o[i++] = parseInt(a[s]);
              }

              o[i++] = 255;

              for (var r = new Uint8Array(n), s = 0; s < r.length; s++) {
                o[i++] = r[s];
              }
            }), e(o.buffer);
          }) : e(new ArrayBuffer(0));
        }, n.encodePayloadAsBlob = function (t, e) {
          function r(t, e) {
            n.encodePacket(t, !0, !0, function (t) {
              var n = new Uint8Array(1);

              if (n[0] = 1, "string" == typeof t) {
                for (var r = new Uint8Array(t.length), o = 0; o < t.length; o++) {
                  r[o] = t.charCodeAt(o);
                }

                t = r.buffer, n[0] = 0;
              }

              for (var i = t instanceof ArrayBuffer ? t.byteLength : t.size, s = i.toString(), a = new Uint8Array(s.length + 1), o = 0; o < s.length; o++) {
                a[o] = parseInt(s[o]);
              }

              if (a[s.length] = 255, w) {
                var c = new w([n.buffer, a.buffer, t]);
                e(null, c);
              }
            });
          }

          a(t, r, function (t, n) {
            return e(new w(n));
          });
        }, n.decodePayloadAsBinary = function (t, e, r) {
          "function" == typeof e && (r = e, e = null);

          for (var o = t, i = [], s = !1; o.byteLength > 0;) {
            for (var a = new Uint8Array(o), c = 0 === a[0], p = "", f = 1; 255 != a[f]; f++) {
              if (p.length > 310) {
                s = !0;
                break;
              }

              p += a[f];
            }

            if (s) return r(b, 0, 1);
            o = u(o, 2 + p.length), p = parseInt(p);
            var h = u(o, 0, p);
            if (c) try {
              h = String.fromCharCode.apply(null, new Uint8Array(h));
            } catch (l) {
              var d = new Uint8Array(h);
              h = "";

              for (var f = 0; f < d.length; f++) {
                h += String.fromCharCode(d[f]);
              }
            }
            i.push(h), o = u(o, p);
          }

          var y = i.length;
          i.forEach(function (t, o) {
            r(n.decodePacket(t, e, !0), o, y);
          });
        };
      }).call(this, "undefined" != typeof self ? self : "undefined" != typeof window ? window : {});
    }, {
      "./keys": 26,
      after: 27,
      "arraybuffer.slice": 28,
      "base64-arraybuffer": 29,
      blob: 30,
      "has-binary": 36,
      utf8: 31
    }],
    26: [function (t, e) {
      e.exports = Object.keys || function (t) {
        var e = [],
            n = Object.prototype.hasOwnProperty;

        for (var r in t) {
          n.call(t, r) && e.push(r);
        }

        return e;
      };
    }, {}],
    27: [function (t, e) {
      function n(t, e, n) {
        function o(t, r) {
          if (o.count <= 0) throw new Error("after called too many times");
          --o.count, t ? (i = !0, e(t), e = n) : 0 !== o.count || i || e(null, r);
        }

        var i = !1;
        return n = n || r, o.count = t, 0 === t ? e() : o;
      }

      function r() {}

      e.exports = n;
    }, {}],
    28: [function (t, e) {
      e.exports = function (t, e, n) {
        var r = t.byteLength;
        if (e = e || 0, n = n || r, t.slice) return t.slice(e, n);
        if (0 > e && (e += r), 0 > n && (n += r), n > r && (n = r), e >= r || e >= n || 0 === r) return new ArrayBuffer(0);

        for (var o = new Uint8Array(t), i = new Uint8Array(n - e), s = e, a = 0; n > s; s++, a++) {
          i[a] = o[s];
        }

        return i.buffer;
      };
    }, {}],
    29: [function (t, e, n) {
      !function (t) {

        n.encode = function (e) {
          var n,
              r = new Uint8Array(e),
              o = r.length,
              i = "";

          for (n = 0; o > n; n += 3) {
            i += t[r[n] >> 2], i += t[(3 & r[n]) << 4 | r[n + 1] >> 4], i += t[(15 & r[n + 1]) << 2 | r[n + 2] >> 6], i += t[63 & r[n + 2]];
          }

          return o % 3 === 2 ? i = i.substring(0, i.length - 1) + "=" : o % 3 === 1 && (i = i.substring(0, i.length - 2) + "=="), i;
        }, n.decode = function (e) {
          var n,
              r,
              o,
              i,
              s,
              a = .75 * e.length,
              c = e.length,
              p = 0;
          "=" === e[e.length - 1] && (a--, "=" === e[e.length - 2] && a--);
          var u = new ArrayBuffer(a),
              f = new Uint8Array(u);

          for (n = 0; c > n; n += 4) {
            r = t.indexOf(e[n]), o = t.indexOf(e[n + 1]), i = t.indexOf(e[n + 2]), s = t.indexOf(e[n + 3]), f[p++] = r << 2 | o >> 4, f[p++] = (15 & o) << 4 | i >> 2, f[p++] = (3 & i) << 6 | 63 & s;
          }

          return u;
        };
      }("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/");
    }, {}],
    30: [function (t, e) {
      (function (t) {
        function n(t) {
          for (var e = 0; e < t.length; e++) {
            var n = t[e];

            if (n.buffer instanceof ArrayBuffer) {
              var r = n.buffer;

              if (n.byteLength !== r.byteLength) {
                var o = new Uint8Array(n.byteLength);
                o.set(new Uint8Array(r, n.byteOffset, n.byteLength)), r = o.buffer;
              }

              t[e] = r;
            }
          }
        }

        function r(t, e) {
          e = e || {};
          var r = new i();
          n(t);

          for (var o = 0; o < t.length; o++) {
            r.append(t[o]);
          }

          return e.type ? r.getBlob(e.type) : r.getBlob();
        }

        function o(t, e) {
          return n(t), new Blob(t, e || {});
        }

        var i = t.BlobBuilder || t.WebKitBlobBuilder || t.MSBlobBuilder || t.MozBlobBuilder,
            s = function () {
          try {
            var t = new Blob(["hi"]);
            return 2 === t.size;
          } catch (e) {
            return !1;
          }
        }(),
            a = s && function () {
          try {
            var t = new Blob([new Uint8Array([1, 2])]);
            return 2 === t.size;
          } catch (e) {
            return !1;
          }
        }(),
            c = i && i.prototype.append && i.prototype.getBlob;

        e.exports = function () {
          return s ? a ? t.Blob : o : c ? r : void 0;
        }();
      }).call(this, "undefined" != typeof self ? self : "undefined" != typeof window ? window : {});
    }, {}],
    31: [function (e, n, r) {
      (function (e) {
        !function (o) {
          function i(t) {
            for (var e, n, r = [], o = 0, i = t.length; i > o;) {
              e = t.charCodeAt(o++), e >= 55296 && 56319 >= e && i > o ? (n = t.charCodeAt(o++), 56320 == (64512 & n) ? r.push(((1023 & e) << 10) + (1023 & n) + 65536) : (r.push(e), o--)) : r.push(e);
            }

            return r;
          }

          function s(t) {
            for (var e, n = t.length, r = -1, o = ""; ++r < n;) {
              e = t[r], e > 65535 && (e -= 65536, o += w(e >>> 10 & 1023 | 55296), e = 56320 | 1023 & e), o += w(e);
            }

            return o;
          }

          function a(t) {
            if (t >= 55296 && 57343 >= t) throw Error("Lone surrogate U+" + t.toString(16).toUpperCase() + " is not a scalar value");
          }

          function c(t, e) {
            return w(t >> e & 63 | 128);
          }

          function p(t) {
            if (0 == (4294967168 & t)) return w(t);
            var e = "";
            return 0 == (4294965248 & t) ? e = w(t >> 6 & 31 | 192) : 0 == (4294901760 & t) ? (a(t), e = w(t >> 12 & 15 | 224), e += c(t, 6)) : 0 == (4292870144 & t) && (e = w(t >> 18 & 7 | 240), e += c(t, 12), e += c(t, 6)), e += w(63 & t | 128);
          }

          function u(t) {
            for (var e, n = i(t), r = n.length, o = -1, s = ""; ++o < r;) {
              e = n[o], s += p(e);
            }

            return s;
          }

          function f() {
            if (b >= v) throw Error("Invalid byte index");
            var t = 255 & m[b];
            if (b++, 128 == (192 & t)) return 63 & t;
            throw Error("Invalid continuation byte");
          }

          function h() {
            var t, e, n, r, o;
            if (b > v) throw Error("Invalid byte index");
            if (b == v) return !1;
            if (t = 255 & m[b], b++, 0 == (128 & t)) return t;

            if (192 == (224 & t)) {
              var e = f();
              if (o = (31 & t) << 6 | e, o >= 128) return o;
              throw Error("Invalid continuation byte");
            }

            if (224 == (240 & t)) {
              if (e = f(), n = f(), o = (15 & t) << 12 | e << 6 | n, o >= 2048) return a(o), o;
              throw Error("Invalid continuation byte");
            }

            if (240 == (248 & t) && (e = f(), n = f(), r = f(), o = (15 & t) << 18 | e << 12 | n << 6 | r, o >= 65536 && 1114111 >= o)) return o;
            throw Error("Invalid UTF-8 detected");
          }

          function l(t) {
            m = i(t), v = m.length, b = 0;

            for (var e, n = []; (e = h()) !== !1;) {
              n.push(e);
            }

            return s(n);
          }

          var d = "object" == _typeof(r) && r,
              y = "object" == _typeof(n) && n && n.exports == d && n,
              g = "object" == _typeof(e) && e;
          (g.global === g || g.window === g) && (o = g);
          var m,
              v,
              b,
              w = String.fromCharCode,
              k = {
            version: "2.0.0",
            encode: u,
            decode: l
          };
          if (d && !d.nodeType) {
            if (y) y.exports = k;else {
              var x = {},
                  A = x.hasOwnProperty;

              for (var B in k) {
                A.call(k, B) && (d[B] = k[B]);
              }
            }
          } else o.utf8 = k;
        }(this);
      }).call(this, "undefined" != typeof self ? self : "undefined" != typeof window ? window : {});
    }, {}],
    32: [function (t, e) {
      (function (t) {
        var n = /^[\],:{}\s]*$/,
            r = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,
            o = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
            i = /(?:^|:|,)(?:\s*\[)+/g,
            s = /^\s+/,
            a = /\s+$/;

        e.exports = function (e) {
          return "string" == typeof e && e ? (e = e.replace(s, "").replace(a, ""), t.JSON && JSON.parse ? JSON.parse(e) : n.test(e.replace(r, "@").replace(o, "]").replace(i, "")) ? new Function("return " + e)() : void 0) : null;
        };
      }).call(this, "undefined" != typeof self ? self : "undefined" != typeof window ? window : {});
    }, {}],
    33: [function (t, e, n) {
      n.encode = function (t) {
        var e = "";

        for (var n in t) {
          t.hasOwnProperty(n) && (e.length && (e += "&"), e += encodeURIComponent(n) + "=" + encodeURIComponent(t[n]));
        }

        return e;
      }, n.decode = function (t) {
        for (var e = {}, n = t.split("&"), r = 0, o = n.length; o > r; r++) {
          var i = n[r].split("=");
          e[decodeURIComponent(i[0])] = decodeURIComponent(i[1]);
        }

        return e;
      };
    }, {}],
    34: [function (t, e) {
      var n = /^(?:(?![^:@]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/,
          r = ["source", "protocol", "authority", "userInfo", "user", "password", "host", "port", "relative", "path", "directory", "file", "query", "anchor"];

      e.exports = function (t) {
        var e = t,
            o = t.indexOf("["),
            i = t.indexOf("]");
        -1 != o && -1 != i && (t = t.substring(0, o) + t.substring(o, i).replace(/:/g, ";") + t.substring(i, t.length));

        for (var s = n.exec(t || ""), a = {}, c = 14; c--;) {
          a[r[c]] = s[c] || "";
        }

        return -1 != o && -1 != i && (a.source = e, a.host = a.host.substring(1, a.host.length - 1).replace(/;/g, ":"), a.authority = a.authority.replace("[", "").replace("]", "").replace(/;/g, ":"), a.ipv6uri = !0), a;
      };
    }, {}],
    35: [function (t, e) {
      function n(t, e) {
        var n;
        return n = e ? new o(t, e) : new o(t);
      }

      var r = function () {
        return self;
      }(),
          o = r.WebSocket || r.MozWebSocket;

      e.exports = o ? n : null, o && (n.prototype = o.prototype);
    }, {}],
    36: [function (t, e) {
      (function (n) {
        function r(t) {
          function e(t) {
            if (!t) return !1;
            if (n.Buffer && n.Buffer.isBuffer(t) || n.ArrayBuffer && t instanceof ArrayBuffer || n.Blob && t instanceof Blob || n.File && t instanceof File) return !0;

            if (o(t)) {
              for (var r = 0; r < t.length; r++) {
                if (e(t[r])) return !0;
              }
            } else if (t && "object" == _typeof(t)) {
              t.toJSON && (t = t.toJSON());

              for (var i in t) {
                if (Object.prototype.hasOwnProperty.call(t, i) && e(t[i])) return !0;
              }
            }

            return !1;
          }

          return e(t);
        }

        var o = t("isarray");
        e.exports = r;
      }).call(this, "undefined" != typeof self ? self : "undefined" != typeof window ? window : {});
    }, {
      isarray: 37
    }],
    37: [function (t, e) {
      e.exports = Array.isArray || function (t) {
        return "[object Array]" == Object.prototype.toString.call(t);
      };
    }, {}],
    38: [function (t, e) {
      var n = t("global");

      try {
        e.exports = "XMLHttpRequest" in n && "withCredentials" in new n.XMLHttpRequest();
      } catch (r) {
        e.exports = !1;
      }
    }, {
      global: 39
    }],
    39: [function (t, e) {
      e.exports = function () {
        return this;
      }();
    }, {}],
    40: [function (t, e) {
      var n = [].indexOf;

      e.exports = function (t, e) {
        if (n) return t.indexOf(e);

        for (var r = 0; r < t.length; ++r) {
          if (t[r] === e) return r;
        }

        return -1;
      };
    }, {}],
    41: [function (t, e, n) {
      var r = Object.prototype.hasOwnProperty;
      n.keys = Object.keys || function (t) {
        var e = [];

        for (var n in t) {
          r.call(t, n) && e.push(n);
        }

        return e;
      }, n.values = function (t) {
        var e = [];

        for (var n in t) {
          r.call(t, n) && e.push(t[n]);
        }

        return e;
      }, n.merge = function (t, e) {
        for (var n in e) {
          r.call(e, n) && (t[n] = e[n]);
        }

        return t;
      }, n.length = function (t) {
        return n.keys(t).length;
      }, n.isEmpty = function (t) {
        return 0 == n.length(t);
      };
    }, {}],
    42: [function (t, e) {
      var n = /^(?:(?![^:@]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/,
          r = ["source", "protocol", "authority", "userInfo", "user", "password", "host", "port", "relative", "path", "directory", "file", "query", "anchor"];

      e.exports = function (t) {
        for (var e = n.exec(t || ""), o = {}, i = 14; i--;) {
          o[r[i]] = e[i] || "";
        }

        return o;
      };
    }, {}],
    43: [function (t, e, n) {
      (function (e) {
        var r = t("isarray"),
            o = t("./is-buffer");
        n.deconstructPacket = function (t) {
          function e(t) {
            if (!t) return t;

            if (o(t)) {
              var i = {
                _placeholder: !0,
                num: n.length
              };
              return n.push(t), i;
            }

            if (r(t)) {
              for (var s = new Array(t.length), a = 0; a < t.length; a++) {
                s[a] = e(t[a]);
              }

              return s;
            }

            if ("object" == _typeof(t) && !(t instanceof Date)) {
              var s = {};

              for (var c in t) {
                s[c] = e(t[c]);
              }

              return s;
            }

            return t;
          }

          var n = [],
              i = t.data,
              s = t;
          return s.data = e(i), s.attachments = n.length, {
            packet: s,
            buffers: n
          };
        }, n.reconstructPacket = function (t, e) {
          function n(t) {
            if (t && t._placeholder) {
              var o = e[t.num];
              return o;
            }

            if (r(t)) {
              for (var i = 0; i < t.length; i++) {
                t[i] = n(t[i]);
              }

              return t;
            }

            if (t && "object" == _typeof(t)) {
              for (var s in t) {
                t[s] = n(t[s]);
              }

              return t;
            }

            return t;
          }

          return t.data = n(t.data), t.attachments = void 0, t;
        }, n.removeBlobs = function (t, n) {
          function i(t, c, p) {
            if (!t) return t;

            if (e.Blob && t instanceof Blob || e.File && t instanceof File) {
              s++;
              var u = new FileReader();
              u.onload = function () {
                p ? p[c] = this.result : a = this.result, --s || n(a);
              }, u.readAsArrayBuffer(t);
            } else if (r(t)) for (var f = 0; f < t.length; f++) {
              i(t[f], f, t);
            } else if (t && "object" == _typeof(t) && !o(t)) for (var h in t) {
              i(t[h], h, t);
            }
          }

          var s = 0,
              a = t;
          i(a), s || n(a);
        };
      }).call(this, "undefined" != typeof self ? self : "undefined" != typeof window ? window : {});
    }, {
      "./is-buffer": 45,
      isarray: 46
    }],
    44: [function (t, e, n) {
      function r() {}

      function o(t) {
        var e = "",
            r = !1;
        return e += t.type, (n.BINARY_EVENT == t.type || n.BINARY_ACK == t.type) && (e += t.attachments, e += "-"), t.nsp && "/" != t.nsp && (r = !0, e += t.nsp), null != t.id && (r && (e += ",", r = !1), e += t.id), null != t.data && (r && (e += ","), e += f.stringify(t.data)), u("encoded %j as %s", t, e), e;
      }

      function i(t, e) {
        function n(t) {
          var n = l.deconstructPacket(t),
              r = o(n.packet),
              i = n.buffers;
          i.unshift(r), e(i);
        }

        l.removeBlobs(t, n);
      }

      function s() {
        this.reconstructor = null;
      }

      function a(t) {
        var e = {},
            r = 0;
        if (e.type = Number(t.charAt(0)), null == n.types[e.type]) return p();

        if (n.BINARY_EVENT == e.type || n.BINARY_ACK == e.type) {
          for (var o = ""; "-" != t.charAt(++r) && (o += t.charAt(r), r != t.length);) {
          }

          if (o != Number(o) || "-" != t.charAt(r)) throw new Error("Illegal attachments");
          e.attachments = Number(o);
        }

        if ("/" == t.charAt(r + 1)) for (e.nsp = ""; ++r;) {
          var i = t.charAt(r);
          if ("," == i) break;
          if (e.nsp += i, r == t.length) break;
        } else e.nsp = "/";
        var s = t.charAt(r + 1);

        if ("" !== s && Number(s) == s) {
          for (e.id = ""; ++r;) {
            var i = t.charAt(r);

            if (null == i || Number(i) != i) {
              --r;
              break;
            }

            if (e.id += t.charAt(r), r == t.length) break;
          }

          e.id = Number(e.id);
        }

        if (t.charAt(++r)) try {
          e.data = f.parse(t.substr(r));
        } catch (a) {
          return p();
        }
        return u("decoded %s as %j", t, e), e;
      }

      function c(t) {
        this.reconPack = t, this.buffers = [];
      }

      function p() {
        return {
          type: n.ERROR,
          data: "parser error"
        };
      }

      var u = t("debug")("socket.io-parser"),
          f = t("json3"),
          h = (t("isarray"), t("component-emitter")),
          l = t("./binary"),
          d = t("./is-buffer");
      n.protocol = 4, n.types = ["CONNECT", "DISCONNECT", "EVENT", "BINARY_EVENT", "ACK", "BINARY_ACK", "ERROR"], n.CONNECT = 0, n.DISCONNECT = 1, n.EVENT = 2, n.ACK = 3, n.ERROR = 4, n.BINARY_EVENT = 5, n.BINARY_ACK = 6, n.Encoder = r, n.Decoder = s, r.prototype.encode = function (t, e) {
        if (u("encoding packet %j", t), n.BINARY_EVENT == t.type || n.BINARY_ACK == t.type) i(t, e);else {
          var r = o(t);
          e([r]);
        }
      }, h(s.prototype), s.prototype.add = function (t) {
        var e;
        if ("string" == typeof t) e = a(t), n.BINARY_EVENT == e.type || n.BINARY_ACK == e.type ? (this.reconstructor = new c(e), 0 === this.reconstructor.reconPack.attachments && this.emit("decoded", e)) : this.emit("decoded", e);else {
          if (!d(t) && !t.base64) throw new Error("Unknown type: " + t);
          if (!this.reconstructor) throw new Error("got binary data when not reconstructing a packet");
          e = this.reconstructor.takeBinaryData(t), e && (this.reconstructor = null, this.emit("decoded", e));
        }
      }, s.prototype.destroy = function () {
        this.reconstructor && this.reconstructor.finishedReconstruction();
      }, c.prototype.takeBinaryData = function (t) {
        if (this.buffers.push(t), this.buffers.length == this.reconPack.attachments) {
          var e = l.reconstructPacket(this.reconPack, this.buffers);
          return this.finishedReconstruction(), e;
        }

        return null;
      }, c.prototype.finishedReconstruction = function () {
        this.reconPack = null, this.buffers = [];
      };
    }, {
      "./binary": 43,
      "./is-buffer": 45,
      "component-emitter": 9,
      debug: 10,
      isarray: 46,
      json3: 47
    }],
    45: [function (t, e) {
      (function (t) {
        function n(e) {
          return t.Buffer && t.Buffer.isBuffer(e) || t.ArrayBuffer && e instanceof ArrayBuffer;
        }

        e.exports = n;
      }).call(this, "undefined" != typeof self ? self : "undefined" != typeof window ? window : {});
    }, {}],
    46: [function (t, e) {
      e.exports = t(37);
    }, {}],
    47: [function (e, n, r) {
      !function (e) {
        function n(t) {
          if (n[t] !== s) return n[t];
          var e;
          if ("bug-string-char-index" == t) e = "a" != "a"[0];else if ("json" == t) e = n("json-stringify") && n("json-parse");else {
            var r,
                o = "{\"a\":[1,true,false,null,\"\\u0000\\b\\n\\f\\r\\t\"]}";

            if ("json-stringify" == t) {
              var i = u.stringify,
                  c = "function" == typeof i && f;

              if (c) {
                (r = function r() {
                  return 1;
                }).toJSON = r;

                try {
                  c = "0" === i(0) && "0" === i(new Number()) && '""' == i(new String()) && i(a) === s && i(s) === s && i() === s && "1" === i(r) && "[1]" == i([r]) && "[null]" == i([s]) && "null" == i(null) && "[null,null,null]" == i([s, a, null]) && i({
                    a: [r, !0, !1, null, "\x00\b\n\f\r	"]
                  }) == o && "1" === i(null, r) && "[\n 1,\n 2\n]" == i([1, 2], null, 1) && '"-271821-04-20T00:00:00.000Z"' == i(new Date(-864e13)) && '"+275760-09-13T00:00:00.000Z"' == i(new Date(864e13)) && '"-000001-01-01T00:00:00.000Z"' == i(new Date(-621987552e5)) && '"1969-12-31T23:59:59.999Z"' == i(new Date(-1));
                } catch (p) {
                  c = !1;
                }
              }

              e = c;
            }

            if ("json-parse" == t) {
              var h = u.parse;
              if ("function" == typeof h) try {
                if (0 === h("0") && !h(!1)) {
                  r = h(o);
                  var l = 5 == r.a.length && 1 === r.a[0];

                  if (l) {
                    try {
                      l = !h('"	"');
                    } catch (p) {}

                    if (l) try {
                      l = 1 !== h("01");
                    } catch (p) {}
                    if (l) try {
                      l = 1 !== h("1.");
                    } catch (p) {}
                  }
                }
              } catch (p) {
                l = !1;
              }
              e = l;
            }
          }
          return n[t] = !!e;
        }

        var _o,
            _i,
            s,
            a = {}.toString,
            p = "object" == (typeof JSON === "undefined" ? "undefined" : _typeof(JSON)) && JSON,
            u = "object" == _typeof(r) && r && !r.nodeType && r;

        u && p ? (u.stringify = p.stringify, u.parse = p.parse) : u = e.JSON = p || {};
        var f = new Date(-0xc782b5b800cec);

        try {
          f = -109252 == f.getUTCFullYear() && 0 === f.getUTCMonth() && 1 === f.getUTCDate() && 10 == f.getUTCHours() && 37 == f.getUTCMinutes() && 6 == f.getUTCSeconds() && 708 == f.getUTCMilliseconds();
        } catch (h) {}

        if (!n("json")) {
          var l = "[object Function]",
              d = "[object Date]",
              y = "[object Number]",
              g = "[object String]",
              m = "[object Array]",
              v = "[object Boolean]",
              b = n("bug-string-char-index");
          if (!f) var w = Math.floor,
              k = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334],
              x = function x(t, e) {
            return k[e] + 365 * (t - 1970) + w((t - 1969 + (e = +(e > 1))) / 4) - w((t - 1901 + e) / 100) + w((t - 1601 + e) / 400);
          };
          (_o = {}.hasOwnProperty) || (_o = function o(t) {
            var e,
                n = {};
            return (n.__proto__ = null, n.__proto__ = {
              toString: 1
            }, n).toString != a ? _o = function o(t) {
              var e = this.__proto__,
                  n = (t in (this.__proto__ = null, this));
              return this.__proto__ = e, n;
            } : (e = n.constructor, _o = function o(t) {
              var n = (this.constructor || e).prototype;
              return t in this && !(t in n && this[t] === n[t]);
            }), n = null, _o.call(this, t);
          });

          var A = {
            "boolean": 1,
            number: 1,
            string: 1,
            undefined: 1
          },
              B = function B(t, e) {
            var n = _typeof(t[e]);

            return "object" == n ? !!t[e] : !A[n];
          };

          if (_i = function i(t, e) {
            var n,
                r,
                s,
                c = 0;
            (n = function n() {
              this.valueOf = 0;
            }).prototype.valueOf = 0, r = new n();

            for (s in r) {
              _o.call(r, s) && c++;
            }

            return n = r = null, c ? _i = 2 == c ? function (t, e) {
              var n,
                  r = {},
                  i = a.call(t) == l;

              for (n in t) {
                i && "prototype" == n || _o.call(r, n) || !(r[n] = 1) || !_o.call(t, n) || e(n);
              }
            } : function (t, e) {
              var n,
                  r,
                  i = a.call(t) == l;

              for (n in t) {
                i && "prototype" == n || !_o.call(t, n) || (r = "constructor" === n) || e(n);
              }

              (r || _o.call(t, n = "constructor")) && e(n);
            } : (r = ["valueOf", "toString", "toLocaleString", "propertyIsEnumerable", "isPrototypeOf", "hasOwnProperty", "constructor"], _i = function i(t, e) {
              var n,
                  i,
                  s = a.call(t) == l,
                  c = !s && "function" != typeof t.constructor && B(t, "hasOwnProperty") ? t.hasOwnProperty : _o;

              for (n in t) {
                s && "prototype" == n || !c.call(t, n) || e(n);
              }

              for (i = r.length; n = r[--i]; c.call(t, n) && e(n)) {
              }
            }), _i(t, e);
          }, !n("json-stringify")) {
            var C = {
              92: "\\\\",
              34: '\\"',
              8: "\\b",
              12: "\\f",
              10: "\\n",
              13: "\\r",
              9: "\\t"
            },
                S = "000000",
                E = function E(t, e) {
              return (S + (e || 0)).slice(-t);
            },
                T = "\\u00",
                j = function j(t) {
              var e,
                  n = '"',
                  r = 0,
                  o = t.length,
                  i = o > 10 && b;

              for (i && (e = t.split("")); o > r; r++) {
                var s = t.charCodeAt(r);

                switch (s) {
                  case 8:
                  case 9:
                  case 10:
                  case 12:
                  case 13:
                  case 34:
                  case 92:
                    n += C[s];
                    break;

                  default:
                    if (32 > s) {
                      n += T + E(2, s.toString(16));
                      break;
                    }

                    n += i ? e[r] : b ? t.charAt(r) : t[r];
                }
              }

              return n + '"';
            },
                _ = function _(t, e, n, r, c, p, u) {
              var f, h, l, b, k, A, B, C, S, T, P, R, N, O, U, q;

              try {
                f = e[t];
              } catch (D) {}

              if ("object" == _typeof(f) && f) if (h = a.call(f), h != d || _o.call(f, "toJSON")) "function" == typeof f.toJSON && (h != y && h != g && h != m || _o.call(f, "toJSON")) && (f = f.toJSON(t));else if (f > -1 / 0 && 1 / 0 > f) {
                if (x) {
                  for (k = w(f / 864e5), l = w(k / 365.2425) + 1970 - 1; x(l + 1, 0) <= k; l++) {
                  }

                  for (b = w((k - x(l, 0)) / 30.42); x(l, b + 1) <= k; b++) {
                  }

                  k = 1 + k - x(l, b), A = (f % 864e5 + 864e5) % 864e5, B = w(A / 36e5) % 24, C = w(A / 6e4) % 60, S = w(A / 1e3) % 60, T = A % 1e3;
                } else l = f.getUTCFullYear(), b = f.getUTCMonth(), k = f.getUTCDate(), B = f.getUTCHours(), C = f.getUTCMinutes(), S = f.getUTCSeconds(), T = f.getUTCMilliseconds();

                f = (0 >= l || l >= 1e4 ? (0 > l ? "-" : "+") + E(6, 0 > l ? -l : l) : E(4, l)) + "-" + E(2, b + 1) + "-" + E(2, k) + "T" + E(2, B) + ":" + E(2, C) + ":" + E(2, S) + "." + E(3, T) + "Z";
              } else f = null;
              if (n && (f = n.call(e, t, f)), null === f) return "null";
              if (h = a.call(f), h == v) return "" + f;
              if (h == y) return f > -1 / 0 && 1 / 0 > f ? "" + f : "null";
              if (h == g) return j("" + f);

              if ("object" == _typeof(f)) {
                for (O = u.length; O--;) {
                  if (u[O] === f) throw TypeError();
                }

                if (u.push(f), P = [], U = p, p += c, h == m) {
                  for (N = 0, O = f.length; O > N; N++) {
                    R = _(N, f, n, r, c, p, u), P.push(R === s ? "null" : R);
                  }

                  q = P.length ? c ? "[\n" + p + P.join(",\n" + p) + "\n" + U + "]" : "[" + P.join(",") + "]" : "[]";
                } else _i(r || f, function (t) {
                  var e = _(t, f, n, r, c, p, u);

                  e !== s && P.push(j(t) + ":" + (c ? " " : "") + e);
                }), q = P.length ? c ? "{\n" + p + P.join(",\n" + p) + "\n" + U + "}" : "{" + P.join(",") + "}" : "{}";

                return u.pop(), q;
              }
            };

            u.stringify = function (t, e, n) {
              var r, o, i, s;
              if ("function" == typeof e || "object" == _typeof(e) && e) if ((s = a.call(e)) == l) o = e;else if (s == m) {
                i = {};

                for (var c, p = 0, u = e.length; u > p; c = e[p++], s = a.call(c), (s == g || s == y) && (i[c] = 1)) {
                }
              }
              if (n) if ((s = a.call(n)) == y) {
                if ((n -= n % 1) > 0) for (r = "", n > 10 && (n = 10); r.length < n; r += " ") {
                }
              } else s == g && (r = n.length <= 10 ? n : n.slice(0, 10));
              return _("", (c = {}, c[""] = t, c), o, i, r, "", []);
            };
          }

          if (!n("json-parse")) {
            var P,
                R,
                N = String.fromCharCode,
                O = {
              92: "\\",
              34: '"',
              47: "/",
              98: "\b",
              116: "	",
              110: "\n",
              102: "\f",
              114: "\r"
            },
                U = function U() {
              throw P = R = null, SyntaxError();
            },
                q = function q() {
              for (var t, e, n, r, o, i = R, s = i.length; s > P;) {
                switch (o = i.charCodeAt(P)) {
                  case 9:
                  case 10:
                  case 13:
                  case 32:
                    P++;
                    break;

                  case 123:
                  case 125:
                  case 91:
                  case 93:
                  case 58:
                  case 44:
                    return t = b ? i.charAt(P) : i[P], P++, t;

                  case 34:
                    for (t = "@", P++; s > P;) {
                      if (o = i.charCodeAt(P), 32 > o) U();else if (92 == o) switch (o = i.charCodeAt(++P)) {
                        case 92:
                        case 34:
                        case 47:
                        case 98:
                        case 116:
                        case 110:
                        case 102:
                        case 114:
                          t += O[o], P++;
                          break;

                        case 117:
                          for (e = ++P, n = P + 4; n > P; P++) {
                            o = i.charCodeAt(P), o >= 48 && 57 >= o || o >= 97 && 102 >= o || o >= 65 && 70 >= o || U();
                          }

                          t += N("0x" + i.slice(e, P));
                          break;

                        default:
                          U();
                      } else {
                        if (34 == o) break;

                        for (o = i.charCodeAt(P), e = P; o >= 32 && 92 != o && 34 != o;) {
                          o = i.charCodeAt(++P);
                        }

                        t += i.slice(e, P);
                      }
                    }

                    if (34 == i.charCodeAt(P)) return P++, t;
                    U();

                  default:
                    if (e = P, 45 == o && (r = !0, o = i.charCodeAt(++P)), o >= 48 && 57 >= o) {
                      for (48 == o && (o = i.charCodeAt(P + 1), o >= 48 && 57 >= o) && U(), r = !1; s > P && (o = i.charCodeAt(P), o >= 48 && 57 >= o); P++) {
                      }

                      if (46 == i.charCodeAt(P)) {
                        for (n = ++P; s > n && (o = i.charCodeAt(n), o >= 48 && 57 >= o); n++) {
                        }

                        n == P && U(), P = n;
                      }

                      if (o = i.charCodeAt(P), 101 == o || 69 == o) {
                        for (o = i.charCodeAt(++P), (43 == o || 45 == o) && P++, n = P; s > n && (o = i.charCodeAt(n), o >= 48 && 57 >= o); n++) {
                        }

                        n == P && U(), P = n;
                      }

                      return +i.slice(e, P);
                    }

                    if (r && U(), "true" == i.slice(P, P + 4)) return P += 4, !0;
                    if ("false" == i.slice(P, P + 5)) return P += 5, !1;
                    if ("null" == i.slice(P, P + 4)) return P += 4, null;
                    U();
                }
              }

              return "$";
            },
                D = function D(t) {
              var e, n;

              if ("$" == t && U(), "string" == typeof t) {
                if ("@" == (b ? t.charAt(0) : t[0])) return t.slice(1);

                if ("[" == t) {
                  for (e = []; t = q(), "]" != t; n || (n = !0)) {
                    n && ("," == t ? (t = q(), "]" == t && U()) : U()), "," == t && U(), e.push(D(t));
                  }

                  return e;
                }

                if ("{" == t) {
                  for (e = {}; t = q(), "}" != t; n || (n = !0)) {
                    n && ("," == t ? (t = q(), "}" == t && U()) : U()), ("," == t || "string" != typeof t || "@" != (b ? t.charAt(0) : t[0]) || ":" != q()) && U(), e[t.slice(1)] = D(q());
                  }

                  return e;
                }

                U();
              }

              return t;
            },
                I = function I(t, e, n) {
              var r = L(t, e, n);
              r === s ? delete t[e] : t[e] = r;
            },
                L = function L(t, e, n) {
              var r,
                  o = t[e];
              if ("object" == _typeof(o) && o) if (a.call(o) == m) for (r = o.length; r--;) {
                I(o, r, n);
              } else _i(o, function (t) {
                I(o, t, n);
              });
              return n.call(t, e, o);
            };

            u.parse = function (t, e) {
              var n, r;
              return P = 0, R = "" + t, n = D(q()), "$" != q() && U(), P = R = null, e && a.call(e) == l ? L((r = {}, r[""] = n, r), "", e) : n;
            };
          }
        }
      }(this);
    }, {}],
    48: [function (t, e) {
      function n(t, e) {
        var n = [];
        e = e || 0;

        for (var r = e || 0; r < t.length; r++) {
          n[r - e] = t[r];
        }

        return n;
      }

      e.exports = n;
    }, {}]
  }, {}, [1])(1);
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

var getSocketIOFunction = function getSocketIOFunction(url) {
  var socketLibrary = {
    s1_3_7: s1_3_7.call(self)
  };
  var parsedArray = url.split("v=");
  var version = "s".concat(parsedArray[parsedArray.length - 1]).replaceAll(".", "_");

  if (!socketLibrary[version]) {
    throw new Error("Cannot find socket version ".concat(version));
  }

  return socketLibrary[version];
};

async function loadExternalScript(url, environment) {
  var useHelperVersion = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

  if (useHelperVersion) {
    self.io = undefined;
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

var INFO = 'INFO';
var ERROR = 'ERROR';

var defaultOptions = {
  url: "https://monitorapi.voicenter.co.il/monitorAPI/getMonitorUrls",
  environment: environments.BROWSER,
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
  maxReconnectAttempts: 5,
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
  serverType: null,
  // can be 1 or 2. 2 is used for chrome extension,
  useLogger: false,
  loggerServer: 'http://127.0.0.1:3000/',
  loggerConfig: {
    logToConsole: true,
    overloadGlobalConsole: false,
    namespace: "events-sdk",
    socketEmitInterval: 10000
  },
  loggerConnectOptions: {
    reconnection: true,
    reconnectionDelay: 5000,
    reconnectionAttempts: 10,
    perMessageDeflate: false,
    upgrade: false,
    transports: ['websocket'],
    debug: false
  }
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

    if (this.options.useLogger) {
      this.initLogger();
    }

    this.servers = [];
    this.server = null;
    this.socket = null;
    this.connected = false;
    this.connectionEstablished = false;
    this.doConnectOnDisconnect = true;
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
      this.log(INFO, eventTypes.CONNECT, this.reconnectOptions);
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
      this.log(ERROR, eventTypes.CONNECT_ERROR, data);
    }
  }, {
    key: "_onError",
    value: function _onError(err) {
      this.log(ERROR, eventTypes.ERROR, err);
    }
  }, {
    key: "_onReconnectFailed",
    value: function _onReconnectFailed() {
      this._retryConnection('next', true);

      this.log(ERROR, eventTypes.RECONNECT_FAILED, this.reconnectOptions);
    }
  }, {
    key: "_onConnectTimeout",
    value: function _onConnectTimeout() {
      this._retryConnection('next', true);

      this.log(ERROR, eventTypes.CONNECT_TIMEOUT, this.reconnectOptions);
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
      this.log(INFO, eventTypes.RECONNECT_ATTEMPT, this.reconnectOptions);
    }
  }, {
    key: "_onDisconnect",
    value: function _onDisconnect(reason) {
      this.connected = false;
      this.log(INFO, eventTypes.DISCONNECT, reason);

      if (this.doConnectOnDisconnect) {
        this._connect('next', true);
      }
    }
  }, {
    key: "_onKeepAlive",
    value: function _onKeepAlive(data) {
      if (_typeof(data) === 'object' && data.errorCode !== 0) {
        this._initSocketConnection();

        return;
      }

      if (data && this.connected) {
        this.log(INFO, eventTypes.KEEP_ALIVE_RESPONSE);
        this._lastEventTimestamp = new Date().getTime();
      } else {
        this._initSocketConnection();
      }
    }
  }, {
    key: "_onLoginResponse",
    value: async function _onLoginResponse(data) {
      if (data.Client) {
        await loadExternalScript(data.Client, this.options.environment, true);
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
      this.doConnectOnDisconnect = true;
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
    key: "log",
    value: function log(type) {
      for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      if (this.Logger) {
        if (type === INFO) {
          var _this$Logger;

          (_this$Logger = this.Logger).log.apply(_this$Logger, args);
        } else if (type === ERROR) {
          var _this$Logger2;

          (_this$Logger2 = this.Logger).error.apply(_this$Logger2, args);
        }
      } else {
        if (type === INFO) {
          var _console;

          (_console = console).log.apply(_console, args);
        } else if (type === ERROR) {
          var _console2;

          (_console2 = console).error.apply(_console2, args);
        }
      }
    }
  }, {
    key: "_initSocketConnection",
    value: function _initSocketConnection() {
      try {
        var domain = this.server.Domain;
        var protocol = this.options.protocol;
        var url = "".concat(protocol, "://").concat(domain);
        this.log(INFO, 'Connecting to..', url);
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
      } catch (e) {
        this.log(ERROR, e);
      }
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
    key: "clearKeepAliveInterval",
    value: function clearKeepAliveInterval() {
      if (this.keepAliveInterval) {
        clearInterval(this.keepAliveInterval);
      }
    }
  }, {
    key: "_initKeepAlive",
    value: function _initKeepAlive() {
      var _this3 = this;

      this.clearKeepAliveInterval();

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
      this.log(INFO, "Failover -> Trying to find another server");

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

      this.log(INFO, "Failover -> Found new server. Connecting to it...", this.server);
      return null;
    }
  }, {
    key: "_findMaxPriorityServer",
    value: function _findMaxPriorityServer() {
      this.log(INFO, "Fallback -> Trying to find previous server");
      var maxPriorityServer = getServerWithHighestPriority(this.servers);

      if (!this.server) {
        this.server = maxPriorityServer;
        return this.server;
      }

      if (this.server && maxPriorityServer.Domain !== this.server.Domain) {
        this.server = maxPriorityServer;
        this.log(INFO, "Fallback -> Trying to find previous server");
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

      if (this.options.environment === environments.CHROME_EXTENSION && chrome) {
        chrome.storage.session.clear();
      } else if (this.options.environment === environments.BROWSER && window) {
        window.sessionStorage.clear();
      }
    }
    /**
     * Disconnects the socket instance from the servers
     */

  }, {
    key: "disconnect",
    value: function disconnect() {
      this.doConnectOnDisconnect = false;
      this._listenersMap = new Map();
      this.closeAllConnections();

      if (this.Logger) {
        this.Logger.disconnectSocket();
      }
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

      this.log(INFO, "EMIT -> ".concat(eventName), data);
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
    value: async function _getTabsSession() {
      if (this.options.environment === environments.CHROME_EXTENSION && chrome) {
        var sessions = await chrome.storage.session.get(null);

        if (!Object.keys(sessions).length) {
          // Ask other tabs for session storage
          await chrome.storage.local.set({
            'getSessionStorage': Date.now()
          });
        }

        chrome.storage.onChanged.addListener(async function (changes, namespace) {
          var key = Object.keys(changes)[0];
          var result = await chrome.storage.session.get(null);

          if (key === 'getSessionStorage') {
            // Some tab asked for the sessionStorage -> send it
            await chrome.storage.local.set({
              'sessionStorage': JSON.stringify(result)
            });
            await chrome.storage.local.remove(["sessionStorage"]);
          } else if (key === 'sessionStorage' && !Object.keys(result).length) {
            // sessionStorage is empty -> fill it
            var newValue;

            if (!changes[key] || !changes[key].newValue) {
              newValue = '{}';
            } else {
              newValue = changes[key].newValue;
            }

            var data = JSON.parse(newValue);

            for (var sKey in data) {
              if (data.hasOwnProperty(sKey)) {
                await chrome.storage.session.set(_defineProperty({}, sKey, data[sKey]));
              }
            }
          }
        });
      } else if (this.options.environment === environments.BROWSER && window) {
        window.addEventListener('storage', function (event) {
          if (!window.sessionStorage.length) {
            // Ask other tabs for session storage
            localStorage.setItem('getSessionStorage', Date.now());
          }

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
          }
        });
      }

      return new Promise(function (resolve) {
        return setTimeout(resolve, 200);
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
          var loginSession;

          if (_this5.options.environment === environments.BROWSER && window) {
            loginSession = window.sessionStorage.getItem(key);

            if (loginSession) {
              loginSession = JSON.parse(loginSession);

              _this5.log(INFO, 'got data from session', loginSession);

              await _this5._onLoginResponse(loginSession);
              return resolve(loginSession);
            }
          } else if (_this5.options.environment === environments.CHROME_EXTENSION && chrome) {
            var result = await chrome.storage.session.get(null);
            if (result) loginSession = result[key];

            if (loginSession) {
              loginSession = JSON.parse(loginSession);

              _this5.log(INFO, 'got data from session', loginSession);

              await _this5._onLoginResponse(loginSession);
              return resolve(loginSession);
            }
          }
        } catch (err) {
          _this5.log(ERROR, "Error on getting session", err);
        }

        try {
          var url = getExternalLoginUrl(_this5.options.loginUrl, type);
          var res = await externalLogin(url, payload);
          await _this5._onLoginResponse(res);

          if (_this5.options.environment === environments.BROWSER) {
            window.sessionStorage.setItem(key, JSON.stringify(res));
            resolve(res);
          } else if (_this5.options.environment === environments.CHROME_EXTENSION) {
            await chrome.storage.session.set(_defineProperty({}, key, JSON.stringify(res)));
            resolve(res);
          }
        } catch (err) {
          _this5.servers = _this5.argumentOptions.servers || defaultServers;
          reject(err);
        }
      });
    }
  }]);

  return EventsSDK;
}();

EventsSDK.prototype['initLogger'] = function () {
  var loggerSocket = s1_3_7.call(self)(this.options.loggerServer, this.options.loggerConnectOptions);
  this.Logger = new AsyncStorageLogger(Object.assign({
    socketConnection: loggerSocket
  }, this.options.loggerConfig));
};

export default EventsSDK;
