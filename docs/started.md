# Getting Started

> We will be using [ES2015](https://github.com/lukehoban/es6features) in the code samples in the guide.


The Events sdk should be used to communicate with Voicenter servers in order to receive real time data via sockets.
Underneath, the events sdk uses socket.io to send and receive events.

## Usage

Assuming you've imported the sdk either via webpack or browser script

Via webpack
```javascript
import EventsSDK from 'voicenter-events-sdk'
```

Via script tag
```html
<script src="https://unpkg.com/voicenter-events-sdk/dist/voicenter-events-sdk.js"></script>
```

You can initialize it and use it to send and receive events to and from our servers.

1. Initialize the constructor with a monitorCode

```javascript
import EventsSDK from 'voicenter-events-sdk'
let sdk = new EventsSDK({
    token: this.monitorCode,
    // other options here
});
```

Alternatively when loaded directly via CDN

```javascript
let sdk = new window.VoicenterEventsSDK({
    token: this.monitorCode,
    // other options here
});
```
2. Call the `init` method to initialize the server connections

```javascript
sdk.init().then(() => {}) //sdk is initialized after promise is fulfilled
```
This step is important as we have an algorithm that retrieves multiple servers and has a failover mechanism behind it.
Skipping this step, will throw error(s) in the subsequent steps   

3. Use the public methods to send and receive events

## Subscribe to all events

```javascript
sdk.on('*', data => {
  // handle data here. Data format -> {name: 'event name', data: {}}
});
```

## Subscribe to specific events

```javascript
sdk.on('ExtensionEvent', data => {
  // handle ExtensionEvent here
});
```

## Emit events

```javascript
sdk.emit('event name', { key: 'value' });
```
 
## Pass vuex store
Passing a vuex store will automatically register a vuex module and save extensions in it.
This is useful if you use vuex and don't want to handle all the extension events yourself but rather use the sdk vuex module.
Open [Vue Devtools](https://chrome.google.com/webstore/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd?hl=en) and see the `sdkExtensions`
vuex module and its state/getters.

## Options

The SDK constructor accepts multiple options when initializing which can be used to configure/tweak the sdk behavior.

| Option | Type  | Default | Description   |
|:---|---|---|---|
| **token**  | String  | null |  Monitor code token to use for login  |
| **user**  | string  | Can be used to login with "user" or "account" login type |
| **password**  | string  | Used for login with "user" or "account" login type. Must be used together with user property |
| **code**  | string  | Code to be used for login with "code" type. Should be used with "organizationCode" code |
| **organizationCode**  | string  | Organization code to be used for login with "code" type. Should be used with "organizationCode" code |
| **debug**  | Boolean  | false |  When set to true, it will print debug information to console  |
| **reconnectionDelay**  | Number  | 10000 |  First reconnection delay in milliseconds. Defaults to 10 seconds and increases with each retry (retryCount * reconnectionDelay)  |
| **timeout**  | Number  | 10000 |  Login timeout. Will throw an error if no event is sent back based on the emitted login event  |
| **protocol**  | String  | https |  Protocol to use when connecting via sockets with the server  |
| **keepAliveTimeout**  | Number  | 60000 |  Timeout after which a keep alive event is sent  |
| **idleInterval**  | Number  | 60000 * 5 |  Interval after which resync event is sent  |
| **transports**  | Array  | ['websocket'] |  Available transports. It's desired to leave this setting as it is. |
| **upgrade**  | Boolean  | false |  Available transports. It's desired to leave this setting as it is. |
| **serverType**  | Number  | null |  Optional parameter to be passed to api call that retrieves available servers. Can be 1 or 2. 2 should be used for chrome extension |
| **url**  | string  | https://monitorapi.voicenter.co.il/monitorAPI/getMonitorUrls |  Url from which to get monitor urls |
| **servers**  | Array  | contains 5 default servers | Contains a list of real time servers with priorities and versions. Please check `src/config.js` file to see the exact format |
| **serverFetchStrategy**  | string  | determines the strategy how monitor servers are initiated. Can be **remote** (server urls are retrieved from a remote url) or **static** where server urls are specified directly through config. In case remote call fails, it will fallback to the default list of servers or the ones passed through config |
| **store**  | object  | Vuex store to use in order to register an extensions module. This should simplify the end usage of the sdk |
| **extensionsModuleName**  | string  | Vuex store extension module name. Defaults to `sdkExtensions` |
| **queuesModuleName**  | string  | Vuex store queue module name. Defaults to `sdkQueues` |
| **useLogger** | boolean | false | Determines if the SDK will use logger. |
| **loggerSocketConnection** | socketIo | `null` | Socket connection which will be used by logger. |
| **loggerServer** | string | `http://127.0.0.1:3000/` | Server url which logger uses to send logs to. |
| **loggerConfig** | object | `{ logToConsole: true, overloadGlobalConsole: false, namespace: "events-sdk",socketEmitInterval: 10000}` | Logger options. |
| **loggerConnectOptions** | object | `{ reconnection: true, reconnectionDelay: 5000, reconnectionAttempts: 10, perMessageDeflate: false, upgrade: false, transports: ['websocket'], debug: false}` | Logger's socket connect options. |

Servers array format

```js
const servers = [{
  'URLID': 59,
  'Priority': 5,
  'Version': 2,
  'Domain': 'monitor1.voicenter.co'
}]
```

## Other Methods

#### Set token
Sets new token to be used. This also triggers a disconnect and reconnect with new token

```javascript
sdk.setToken('some new token here')
```

#### Resync 
Emits resync event to resync data

```javascript
sdk.resync()
```

#### Set monitor url 
Sets new monitor url. This will trigger an http call to get the socket servers based on the monitor url.
Please not that providing an invalid url, will try to revert to the old values.
In case that fails, you will have to init the sdk again.

```javascript
sdk.setMonitorUrl(newMonitorUrl)
```

#### Login with user
Log in based on user credentials

```javascript
async function initSdk() {
    let sdk = new EventsSDK({
        user: 'my user',
        password: 'my password',
        // other options here
    });
    await sdk.init()
    await sdk.login('user')
}
```

#### Login with account
Log in based on user account credentials

```javascript
async function initSdk() {
    let sdk = new EventsSDK({
        user: 'my user',
        password: 'my password',
        // other options here
    });
    await sdk.init()
    await sdk.login('account')
}
```

#### Login with code
Log in based on code and organization code

```javascript
async function initSdk() {
    let sdk = new EventsSDK({
        code: 'my code',
        organizationCode: 'my organization code',
        // other options here
    });
    await sdk.init()
    await sdk.login('code')
}
```

#### Disconnect
Forcefully disconnects from the socket. This should be handled by the sdk most of the times.

```javascript
sdk.disconnect()
```
 
## Logger
To use logger pass **useLogger** option as `true` when SDK initialization. Then pass logger server with options:

```javascript
import EventsSDK from 'voicenter-events-sdk'
let sdk = new EventsSDK({
    token: this.monitorCode,
    useLogger: true,
    loggerServer: 'http://127.0.0.1:3000/',
    loggerConfig: {
        logToConsole: true,
        overloadGlobalConsole: false,
        namespace: "events-sdk",
        socketEmitInterval: 10000,
    }
});
```

Sometimes it is useful to pass existing socket connection for logger. To do that use **loggerSocketConnection** property:
```javascript
import EventsSDK from 'voicenter-events-sdk'

const socket = io(url, options)

let sdk = new EventsSDK({
    token: this.monitorCode,
    useLogger: true,
    loggerSocketConnection: socket
});
```