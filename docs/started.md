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

## Options

The SDK constructor accepts multiple options when initializing which can be used to configure/tweak the sdk behavior.

| Option | Type  | Default | Description   |
|:---|---|---|---|
| **token**  | String  | null |  Monitor code token to use for login  |
| **debug**  | Boolean  | false |  When set to true, it will print debug information to console  |
| **reconnectionDelay**  | Number  | 10000 |  First reconnection delay in milliseconds. Defaults to 10 seconds and increases with each retry (retryCount * reconnectionDelay)  |
| **timeout**  | Number  | 10000 |  Login timeout. Will throw an error if no event is sent back based on the emitted login event  |
| **protocol**  | String  | https |  Protocol to use when connecting via sockets with the server  |
| **keepAliveTimeout**  | Number  | 60000 |  Timeout after which a keep alive event is sent  |
| **transports**  | Array  | ['websocket'] |  Available transports. It's desired to leave this setting as it is. |
| **upgrade**  | Boolean  | false |  Available transports. It's desired to leave this setting as it is. |
| **serverType**  | Number  | null |  Optional parameter to be passed to api call that retrieves available servers. Can be 1 or 2. 2 should be used for chrome extension |
| **url**  | string  | https://monitorapi.voicenter.co.il/monitorAPI/getMonitorUrls |  Url from which to get monitor urls |
| **servers**  | Array  | contains 5 default servers | Contains a list of real time servers with priorities and versions. Please check `src/config.js` file to see the exact format |

Servers array format

```js
const servers = [{
  'URLID': 59,
  'Priority': 5,
  'Version': 2,
  'Domain': 'monitor1.voicenter.co'
}]
```
