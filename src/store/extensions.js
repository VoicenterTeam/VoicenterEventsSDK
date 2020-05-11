import { callStatuses } from '../utils/statusTypes';

const ISRAEL_TIMEZONE_OFFSET = 180 * 60 * 1000;
const MINUTE = 60 * 1000
const LOGOUT_STATUS = 2;
const LOGIN_STATUS = 1;
const HOLD_STATUS = 'hold'

const types = {
    SET_EXTENSIONS: 'SET_EXTENSIONS',
    UPDATE_EXTENSIONS: 'UPDATE_EXTENSIONS',
    SET_SERVER_TIME: 'SET_SERVER_TIME',
    SET_IS_SOCKET_OFFLINE: 'SET_IS_SOCKET_OFFLINE',
};
const state = {
    extensions: [],
    serverTime: null,
    serverDelta: 0,
    serverOffset: 0,
    isSocketOffline: false,
    offlineSocketTimestamp: null
};

const mutations = {
    [types.SET_EXTENSIONS]: (state, value) => {
        state.extensions = value
    },
    [types.UPDATE_EXTENSIONS]: (state, {index, extension}) => {
        state.extensions.splice(index, 1, extension)
    },
    [types.SET_SERVER_TIME]: (state, value) => {
        state.serverOffset = value.servertimeoffset * 60 * 1000 || ISRAEL_TIMEZONE_OFFSET
        state.serverTime = value.servertime * 1000 - state.serverOffset
        state.serverDelta = new Date().getTime() - state.serverTime
    },
    [types.SET_IS_SOCKET_OFFLINE]: (state, value) => {
        state.isSocketOffline = value
        if (value) {
            state.offlineSocketTimestamp = new Date().getTime()
        } else {
            state.offlineSocketTimestamp = null
        }
    }
};

const actions = {
    async setExtensions({commit}, value) {
        commit(types.SET_EXTENSIONS, value)
    },
    async updateExtension({commit}, value) {
        commit(types.UPDATE_EXTENSIONS, value)
    },
};

function isCallOnHold(call = {}) {
  let status = call.callstatus || ''
  status = status.toLowerCase()
  return call.answered && status === HOLD_STATUS
}

const getters = {
  isSocketOffline: state => {
    if (!state.offlineSocketTimestamp || isNaN(state.offlineSocketTimestamp)) {
      return false
    }
    const now = new Date().getTime()
    // show after 1 minute of disconnect
    return state.isSocketOffline && now - state.offlineSocketTimestamp > MINUTE
  },
  extensionsWithCalls: state => hideLoggedOutUsers => {
    let groupedExtensions = [];

    state.extensions.forEach((extension) => {

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
      return groupedExtensions.filter(e => e.representativeStatus !== LOGOUT_STATUS);
    }
    return groupedExtensions;
  },
  extensionCountByStatus: (state, getters) => status => {
    return getters.extensionsWithCalls.filter(el => el.representativeStatus === status).length || 0
  }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters,
};
