# Voicenter Events SDK
![Image of Voicenter SDK](https://voicentercdn-voicenterltd.netdna-ssl.com/cdn/images/external/SDK_red.png)<br/>
Voicenter Events SDK manages the login and the real-time socket connection to Voicenter's monitor servers.
Use it to receive live extension, queue, dialer and voicebot events, and to send requests back to the server.

## Table of contents

1. [Installation](#installation)
2. [Quick start](#quick-start)
3. [Login types](#login-types)
4. [Options](#options)
5. [Methods](#methods)
6. [Events you can subscribe to](#events-you-can-subscribe-to)
7. [Events you can send](#events-you-can-send)
8. [Connection and reconnection](#connection-and-reconnection)
9. [Timestamps](#timestamps)
10. [TypeScript](#typescript)
11. [HTML example](#html-example)

## Installation

```sh
npm install @voicenter-team/events-sdk @voicenter-team/socketio-storage-logger
```
or
```sh
yarn add @voicenter-team/events-sdk @voicenter-team/socketio-storage-logger
```

`@voicenter-team/socketio-storage-logger` is a peer dependency and must be installed alongside the SDK.

## Quick start

```js [file.js]
import EventsSdk, { LoginType, EventsEnum } from '@voicenter-team/events-sdk'

const sdk = new EventsSdk({
    loginType: LoginType.TOKEN,
    token: 'your-monitor-token'
})

// Subscribe before or after init - listeners are kept on the instance
sdk.on(EventsEnum.EXTENSION_EVENT, ({ name, data }) => {
    console.log(name, data.reason, data.data)
})

// Logs in, picks a monitor server and opens the socket connection
await sdk.init()
```

`init()` must be called once per instance. It logs in, chooses the monitor server with the highest priority and connects to it. If it can't log in, or no monitor servers are available, the promise rejects.

## Login types

The `loginType` option is required. Use the `LoginType` enum:

| `LoginType` | Value | Required options | Notes |
|---|---|---|---|
| `LoginType.TOKEN` | `'Token'` | `token` | Monitor code / token login |
| `LoginType.USER` | `'User'` | `email`, `password` | The SDK refreshes the token automatically before it expires |
| `LoginType.JWT` | `'Jwt'` | `token`, `isNewStack: true`, `getSettingsUrl` | `token` is an access token used directly to fetch the settings |
| `LoginType.SETTINGS` | `'Settings'` | `getSettings`, `isNewStack: true` | Your app supplies the settings itself |

### Old stack and new stack

The SDK works with two Voicenter backends, selected with `isNewStack`:

- **Old stack** (`isNewStack: false`, the default): the SDK posts to `loginUrl` (`/Token` or `/User`), and the response contains the socket servers.
- **New stack** (`isNewStack: true`): the SDK logs in at `loginUrl`, then loads the settings (monitor servers and identity code) from `getSettingsUrl`. You must pass `getSettingsUrl`, and usually `loginUrl` and `refreshTokenUrl` for your environment, since the defaults point to the old stack.

### Token
```js [file.js]
const sdk = new EventsSdk({
    loginType: LoginType.TOKEN,
    token: 'your-monitor-token'
})
```

### User
```js [file.js]
const sdk = new EventsSdk({
    loginType: LoginType.USER,
    email: 'user@example.com',
    password: 'password'
})
```

### JWT (new stack)
```js [file.js]
const sdk = new EventsSdk({
    loginType: LoginType.JWT,
    isNewStack: true,
    token: accessToken,
    getSettingsUrl: 'https://<settings-api>/...'
})
```

### Settings (new stack)
Your app reads the settings itself, for example through its own API, and the SDK connects with them. `getSettings` is called on every login instead of a request of the SDK's own, and the settings it returns are never stored in session storage.

```js [file.js]
const sdk = new EventsSdk({
    loginType: LoginType.SETTINGS,
    isNewStack: true,
    getSettings: () => readSettingsFromMyApi() // must resolve to { IdentityCode, MonitorList, ... }
})
```

The returned object has the `Settings` shape: `IdentityCode`, `IdentityCodeExpiry`, `PersonID`, `PersonType`, `ExtensionMonitorID` and `MonitorList` (an array of servers, see [`servers`](#options)).

### Session caching
For every login type except `Settings`, the login result is cached in `sessionStorage` (or `chrome.storage.session` inside a Chrome extension), keyed by a hash of the options. A new instance with the same options in the same tab reuses it instead of logging in again.

## Options

| Option | Type | Default | Description |
|---|---|---|---|
| `loginType` | `LoginType` | — | **Required.** See [Login types](#login-types) |
| `token` | `string` | — | Token for `Token` and `Jwt` login |
| `email` | `string` | — | Email for `User` login |
| `password` | `string` | — | Password for `User` login |
| `getSettings` | `() => Promise<Settings>` | — | Settings provider for `Settings` login |
| `isNewStack` | `boolean` | `false` | Use the new-stack login flow |
| `loginUrl` | `string` | `https://loginapi.voicenter.co.il/monitorAPI/Login` | Login endpoint |
| `refreshTokenUrl` | `string` | `https://loginapi.voicenter.co.il/monitorAPI/RefreshIdentityToken` | Token refresh endpoint (used for `User` login) |
| `getSettingsUrl` | `string` | — | Settings endpoint. Required for the new stack, except with `Settings` login |
| `servers` | `Server[]` | — | Use these monitor servers instead of the ones returned by the login. Format: `{ URLID, Priority, Version, Domain }` |
| `protocol` | `string` | `'https'` | Protocol used to connect to the monitor server |
| `timeout` | `number` | `10000` | Socket connection timeout, in ms |
| `keepAliveTimeout` | `number` | `60000` | If no event arrives within this time (ms), a `keepalive` is sent. It is also how long the SDK waits for the answer before reconnecting |
| `reconnectionDelay` | `number` | `5` | First reconnection delay, **in seconds**. It doubles on each failed attempt, up to `reconnectionDelayMax` |
| `reconnectionDelayMax` | `number` | `30` | Maximum reconnection delay, **in seconds** |
| `forceNew` | `boolean` | `true` | Create a new socket.io manager for each connection |
| `useLogger` | `boolean` | `true` | Send SDK logs to Voicenter's log server |
| `loggerServer` | `string` | `https://socketlog.voicenter.co` | Log server URL |
| `loggerConfig` | `LoggerOptions` | `{ logToConsole: true, overloadGlobalConsole: false, system: 'events-sdk', socketEmitInterval: 10000 }` | Options for `@voicenter-team/socketio-storage-logger` |
| `loggerConnectOptions` | `LoggerConnectOptions` | `{ reconnection: false, transports: ['websocket'], ... }` | Socket options for the log server connection |
| `loggerSocketConnection` | `Socket` | — | Reuse an existing socket.io connection for logging |
| `storageLoggerInstance` | `StorageLogger` | — | Reuse an existing logger instance. The SDK only writes to it and never starts or stops it, so its socket stays under your control |
| `debugOption` | `DebugOption` | — | Also log received events: `'bootstrap'`, `'debugExtensions'`, `'debugQueue'`, `'debugDialer'` or `'full'` |

## Methods

| Method | Description |
|---|---|
| `init(): Promise<true>` | Logs in and connects. Call once after creating the instance |
| `on(event, callback)` | Subscribes to an event, or to all events with `'*'`. The callback receives `{ name, data }` |
| `emit(event, payload)` | Sends an event to the monitor server. See [Events you can send](#events-you-can-send) |
| `disconnect(): Promise<void>` | Closes the connection, stops automatic reconnection and stops the logger (not one passed as `storageLoggerInstance`) |
| `connect(serverParameter)` | Reconnects manually: `ServerParameter.MAIN` (highest-priority server) or `ServerParameter.NEXT` (the next server). `init()` already does this, so you only need it after `disconnect()` |
| `forceReconnect({ relogin }?): Promise<void>` | Drops the current connection and connects to the main server right away, e.g. when the device wakes from sleep. With `relogin: true` it logs in again first to get a fresh token; if that login fails, it keeps retrying with the current token and rejects |
| `isConnected(): boolean` | Whether the socket is connected to the monitor server |
| `getCurrentMonitorServer(): Server \| undefined` | The monitor server currently in use |
| `clearKeepAliveInterval()` | Stops the keep-alive timer |

To remove a listener, use `sdk.eventEmitterClass.off(event, callback)` with the same callback you passed to `on`.

```js [file.js]
// One event
sdk.on(EventsEnum.QUEUE_EVENT, ({ data }) => {
    console.log(data.reason, data.data)
})

// All events
sdk.on('*', ({ name, data }) => {
    console.log(name, data)
})

// Stop
await sdk.disconnect()
```

## Events you can subscribe to

Use the `EventsEnum` names (or their string values):

| `EventsEnum` | Event name | Description |
|---|---|---|
| `LOGIN_SUCCESS` | `loginSuccess` | Socket login succeeded |
| `LOGIN_STATUS` | `loginStatus` | Login status with the initial snapshot |
| `ALL_EXTENSION_STATUS` | `AllExtensionsStatus` | Status of all monitored extensions |
| `EXTENSION_EVENT` | `ExtensionEvent` | A change on one extension (call started, answered, hangup, ...) |
| `EXTENSIONS_UPDATED` | `ExtensionsUpdated` | The list of monitored extensions changed |
| `ALL_DIALER_STATUS` | `AllDialersStatus` | Status of all dialers |
| `DIALER_EVENT` | `DialerEvent` | A change on one dialer |
| `ALL_USERS_STATUS` | `AllUsersStatus` | Status of all users |
| `QUEUE_EVENT` | `QueueEvent` | A change on a queue |
| `ALL_VOICEBOTS_STATUS` | `AllVoicebotsStatus` | Status of all voicebots |
| `VOICEBOT_EVENT` | `VoicebotEvent` | A change on a voicebot call |
| `VOICEBOT_SUBSCRIBED_TO_CALL` | `subscribedToCall` | Subscription to a voicebot call succeeded |
| `VOICEBOT_SUBSCRIBE_TO_CALL_FAILED` | `subscribeToCallFailed` | Subscription to a voicebot call failed |
| `VOICEBOT_INITIAL_CALL_HISTORY` | `initialCallHistory` | History of a voicebot call, sent after subscribing |
| `VOICEBOT_UNSUBSCRIBED_FROM_CALL` | `unsubscribedFromCall` | Unsubscribed from a voicebot call |
| `KEEP_ALIVE_RESPONSE` | `keepaliveResponse` | Server response to a keep-alive |
| `ONLINE_STATUS_EVENT` | `onlineStatusEvent` | SDK connection status (see below) |

Subscribe only to the names above or `'*'`; other names are not supported.

## Events you can send

| `ServerListenerEventsEnum` | Event name | Payload |
|---|---|---|
| `UPDATE_MONITORED_EXTENSIONS` | `updateMonitoredExtensions` | `{ extensionsString: string }` |
| `SUBSCRIBE_VOICEBOT_CALL_UPDATES` | `subscribeVoicebotCallUpdates` | `{ voicebotID: number, IvrUniqueID: string }` |
| `UNSUBSCRIBE_VOICEBOT_CALL_UPDATES` | `unsubscribeVoicebotCallUpdates` | `{ voicebotID: number, IvrUniqueID: string }` |
| `KEEP_ALIVE` | `keepalive` | token (`string`). Sent automatically by the SDK |

```js [file.js]
import { ServerListenerEventsEnum } from '@voicenter-team/events-sdk'

sdk.emit(ServerListenerEventsEnum.SUBSCRIBE_VOICEBOT_CALL_UPDATES, {
    voicebotID: 123,
    IvrUniqueID: 'ivr-unique-id'
})
```

## Connection and reconnection

The SDK reconnects by itself, so you normally don't need to manage the connection:

- **Failover:** it connects to the server with the highest `Priority`. If the connection drops or fails, it tries the next server.
- **Backoff:** reconnection starts after `reconnectionDelay` seconds and doubles on each failed attempt, up to `reconnectionDelayMax` seconds (30 by default).
- **Network changes:** in browsers and web workers, going offline closes the connection and schedules a retry, and coming back online reconnects right away.
- **Keep-alive:** if no event arrives within `keepAliveTimeout`, a `keepalive` is sent. An error response triggers a reconnect. Once the server has answered a keep-alive on the current connection, a keep-alive with no answer (and no other event) within `keepAliveTimeout` also triggers a reconnect, which catches connections that died silently, e.g. during OS sleep.
- **Token refresh:** with `User` login, the token is refreshed 5 seconds before it expires and the connection is reopened.
- **Manual reconnect:** call `forceReconnect()` when you know the connection may be stale, e.g. when the device wakes up. Pass `{ relogin: true }` to get a fresh token as well.

Follow the state with `onlineStatusEvent`. Its `connectionStatus` is a `ConnectionStatusEnum` value: `'connected'`, `'tryingToConnect'` or `'disconnected'`.

```js [file.js]
import { EventsEnum, ConnectionStatusEnum } from '@voicenter-team/events-sdk'

sdk.on(EventsEnum.ONLINE_STATUS_EVENT, ({ data }) => {
    if (data.connectionStatus === ConnectionStatusEnum.CONNECTED) {
        // connected
    }
})
```

## Timestamps

Server timestamps are in server time. For convenience, the SDK adds two fields next to each timestamp it maps:

- `<field>_UTC`: the timestamp converted to UTC, in ms
- `<field>_UTC_CLIENT`: the same moment adjusted to the client's clock, in ms. Use it to compute durations with `Date.now()`

For example `callStarted` gets `callStarted_UTC` and `callStarted_UTC_CLIENT`. This applies to extension calls (`ExtensionEvent`, `AllExtensionsStatus`), queue calls (`QueueEvent`, `loginStatus`) and voicebot calls (`AllVoicebotsStatus`, `VoicebotEvent`, `initialCallHistory`).

## TypeScript

The package ships its own types. Besides the enums above, it exports the event payload types, for example:

```ts [file.ts]
import type {
    ExtensionEventSDK,
    QueueEventSDK,
    AllExtensionStatusEventSDK,
    VoiceBotEventSDK,
    EventsSdkOptionsClient,
    Settings
} from '@voicenter-team/events-sdk'
```

`sdk.on(EventsEnum.X, callback)` is typed, so `data` in the callback has the right type for each event. The full list of types is in the API reference of the documentation.

## HTML example

The UMD build exposes the global `VoicenterEventsSDK`, with the SDK class as `default` and the enums as named properties. The storage logger is not bundled; load it first, it exposes the global `StorageLogger`.

```html [index.html]
<html>
<head></head>
<body>
Status: <span id="status-txt">Disconnected</span>
<br/>
<br/>
<div id="response-body"></div>

<script src="https://cdn.jsdelivr.net/npm/@voicenter-team/socketio-storage-logger/dist/storage-logger.umd.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@voicenter-team/events-sdk/dist/voicenter-events-sdk.umd.js"></script>
<script>
    const { default: EventsSdk, LoginType, EventsEnum } = VoicenterEventsSDK

    const sdk = new EventsSdk({
        loginType: LoginType.USER,
        email: 'user@example.com',
        password: 'password'
    })

    sdk.on(EventsEnum.ONLINE_STATUS_EVENT, function ({ data }) {
        document.getElementById('status-txt').innerHTML = data.connectionStatus
    })

    sdk.on(EventsEnum.EXTENSION_EVENT, function ({ data }) {
        const cur = document.getElementById('response-body')
        cur.innerHTML = cur.innerHTML + data.reason + '<br />'
    })

    sdk.on(EventsEnum.ALL_EXTENSION_STATUS, function ({ data }) {
        console.log(data.extensions)
    })

    sdk.init()
</script>
</body>
</html>
```
