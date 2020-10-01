# Voicenter Events SDK
![Image of Voicenter SDK](https://voicentercdn-voicenterltd.netdna-ssl.com/cdn/images/external/SDK_red.png)<br/>
Voicenter Events SDK aims to manage API and socket communication with Voicenter APIs and backends.
You can use the SDK to send and receive real-time data from and to voicenter servers.


### Getting Started

The Events SDK should be used to communicate with Voicenter servers in order to receive real-time data via sockets. Underneath, the events SDK uses socket.io to send and receive events.

## Table of contents

1. [Instalation](#instalation)
2. [Usage](#usage)
3. [Public methods](#use-the-public-methods-to-send-and-receive-events)
4. [Pass vuex store](#pass-vuex-store)
5. [Other Methods](#other-methods)
    1. [Set token](#set-token)
    2. [Resync](#resync)
    3. [Set monitor url](#set-monitor-url)
    4. [Login with user](#login-with-user)
    5. [Login with account](#login-with-account)
    6. [Login with code](#login-with-code)
    7. [Disconnect](#disconnect)
6. [Initializing new instance](#initializing-new-instance)
7. [Required params](#required-params)
8. [Initing an instance](#initing-an-instance)
9. [Events you can subscribe to](#events-you-can-subscribe-to)
10. [HTML Example](#html-example)

## Instalation
1. Direct Download / CDN:<br/>
https://unpkg.com/voicenter-events-sdk/dist/voicenter-events-sdk<br/><br/><br/>
[unpkg.com](https://unpkg.com/) provides NPM-based CDN links. The above link will always point to the latest release on NPM. You can also use a specific version/tag via URLs like https://unpkg.com/voicenter-events-sdk@0.8.0/dist/voicenter-events-sdk.js <br/>

    Include voicenter-events-sdk after Vue and it will install itself automatically:
    ```html
    <script src="https://unpkg.com/voicenter-events-sdk/dist/voicenter-events-sdk.umd.js"></script>
    ```
2. NPM:
    ```sh
    $ npm install voicenter-events-sdk
    ```    
3. Yarn:
    ```sh
    $ yarn add voicenter-events-sdk
    ```    
     ```js
    import VoicenterEventsSDK from 'voicenter-events-sdk'
    ```  
    You don't need to do this when using global script tags.    
    
 
## Usage 
You can initialize and use it to send and receive events to and from our servers.
- Initialize the constructor with a monitorCode
```js
    import EventsSDK from 'voicenter-events-sdk'
    let sdk = new EventsSDK({
        token: this.monitorCode,
        // other options here
    });
```
- Alternatively when loaded directly via CDN
```js
    let sdk = new window.VoicenterEventsSDK({
        token: this.monitorCode,
        // other options here
    });
```
- Call the init method to initialize the server connections
```js
   sdk.init().then(() => {}) //sdk is initialized after promise is fulfilled
```
This step is important as we have an algorithm that retrieves multiple servers and has a failover mechanism behind it. Skipping this step, will throw error(s) in the subsequent steps.

## Use the public methods to send and receive events 
- Subscribe to all events
```js
   sdk.on('*', data => {
      // handle data here. Data format -> {name: 'event name', data: {}}
    });
```
- Subscribe to specific events
```js
   sdk.on('ExtensionEvent', data => {
      // handle ExtensionEvent here
    });
```
- Emit events
```js
   sdk.emit('event name', { key: 'value' });
```

## Pass vuex store
Passing a vuex store will automatically register a vuex module and save extensions in it. This is useful if you use vuex and don't want to handle all the extension events yourself but rather use the sdk vuex module. [Open Vue Devtools](https://chrome.google.com/webstore/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd?hl=en) and see the `sdkExtensions` vuex module and its state/getters.

#### Options
The SDK constructor accepts multiple options when initializing which can be used to configure/tweak the SDK behaviour.

| Option | Type | Default | Description |
|-----------|---------------|---------------|---------------|
| token | String | Null | Monitor code token to use for login |
| user | String | Can be used to login with "user" or "account" login type |  |
| password | String | Used for login with "user" or "account" login type. Must be used together with user property |  |
| code | String | Code to be used for login with "code" type. Should be used with "organizationCode" code |  |
| organizationCode | String | Organization code to be used for login with "code" type. Should be used with "organizationCode" code |  |
| debug | Boolean | false | When set to true, it will print debug information to console |
| reconnectionDelay | Number | 10000 | First reconnection delay in milliseconds. Defaults to 10 seconds and increases with each retry (retryCount * reconnectionDelay) |
| timeout | Number | 10000 | Login timeout. Will throw an error if no event is sent back based on the emitted login event |
| protocol | String | https | Protocol to use when connecting via sockets with the server |
| keepAliveTimeout | Number | 60000 | Timeout after which a keep alive event is sent |
| idleInterval | Number | 60000 * 5 | Interval after which resync event is sent |
| transports | Array | ['websocket'] | Available transports. It's desired to leave this setting as it is. |
| upgrade | Boolean | false | Available transports. It's desired to leave this setting as it is. |
| serverType | Number | Null | Optional parameter to be passed to API call that retrieves available servers. Can be 1 or 2. 2 should be used for chrome extension. |
| url | string | https://monitorapi.voicenter.co.il/monitorAPI/getMonitorUrls | Url from which to get monitor urls. |
| servers | Array | contains 5 default servers | Contains a list of real-time servers with priorities and versions. Please check src/config.js file to see the exact format. |
| serverFetchStrategy | string | Determines the strategy how monitor servers are initiated. Can be remote (server urls are retrieved from a remote url) or static where server urls are specified directly through config. In case remote call fails, it will fallback to the default list of servers or the ones passed through config. | |
| store | object | Vuex store to use in order to register an extensions module. This should simplify the end usage of the SDK | |
| extensionsModuleName | string | Vuex store extension module name. Defaults to `sdkExtensions` | |
| queuesModuleName | string | Vuex store queue module name. Defaults to `sdkQueues` | |

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
##### `Set token`
Sets new token to be used. This also triggers a disconnect and reconnect with new token.
```js
  sdk.setToken('some new token here')
```

##### `Resync`
Emits resync event to resync data.
```js
  sdk.resync()
```

##### `Set monitor url`
Sets new monitor url. This will trigger an http call to get the socket servers based on the monitor url. Please not that providing an invalid url, will try to revert to the old values. In case that fails, you will have to init the SDK again.
```js
  sdk.setMonitorUrl(newMonitorUrl)
```

##### `Login with user`
Log in based on user credentials.
```js
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

##### `Login with account`
Log in based on user account credentials.
```js
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

##### `Login with code`
Log in based on code and organization code.
```js
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

##### `Disconnect`
Forcefully disconnects from the socket. This should be handled by the sdk most of the times.
```js
    sdk.disconnect()
```




















 
 
 
 
 
## Initializing new instance
```js
const sdk = new EventsSDK({
   ...options
});
```


## Required params
As a required params of an options is loginType property (token/user/account) and authorization data:
- `User loginType example:`
  ```js
    const sdk = new EventsSDK({
       loginType: 'user',
       email: email@email.com',
       password: 'password',
    });
  ```
- `Token loginType example:`
  ```js
    const sdk = new EventsSDK({
       loginType: 'token',
       useLoginApi: true,
       token: 'token',
    });
  ```
- `Account loginType example:`
  ```js
   const sdk = new EventsSDK({
       loginType: 'account',
       username: 'username',
       password: 'password',
    });
  ```  
## Initing an instance
```js
sdk.init().then(function () {
   //...
})
```
After the instance is init the events subscription can be implemented
- `Subscription:`
  ```js
   sdk.on('<EVENT_NAME>', function (response) {
       // response
    })
  ```  
- `Or subscribe to all events:`
  ```js
   sdk.on('*', function (response) {
       // response
    })
  ```  

## Events you can subscribe to 
- `loginStatus`
- `login`
- `loginUser`
- `loginUser`
- `loginUserCode`
- `loginAccount` 
- `loginResponse` 
- `QueueEvent`
- `QueuesUpdated`
- `QueuesUpdated`
- `DialersUpdated`
- `ExtensionEvent`
- `ExtensionsUpdated`
- `AllExtensionsStatus`
- `connect_error`
- `connect_timeout`
- `disconnect`
- `pong`
- `reconnect`
- `reconnect_attempt`
- `resync`
- `reconnecting`
- `reconnect_error`
- `reconnect_failed`
- `keepalive`
- `keepaliveResponse`
- `closeme`
- `error`

## HTML Example 

In case you have the socket-io client library available in window object EventsSDK library will work in front of that. If not - EventsSDK will include script tag with socket client relevant to ones that is used on server.
```html
<html>
<head></head>
<body>
Status: <span id="status-txt">Disconnected</span>
<br/>
<br/>

<div id="response-body"></div>
</body>
</html>

<!-- Events SDK -->
<script src="https://voicentercdn-voicenterltd.netdna-ssl.com/cdn/events-sdk/voicenter-events-sdk.umd.js"></script>
<script>
   let sdk = new EventsSDK({
       loginType: 'user',
       email: 'Vovatest@voicenter.com',
       password: '11602082819',
   });

   sdk.init().then(function () {
       // Success login event
       sdk.on('loginSuccess', function (response) {
           document.getElementById("status-txt").innerHTML = "Connected";
       })

       // Extension event
       sdk.on('ExtensionEvent', function (response) {
           console.log(response);

           const cur = document.getElementById("response-body");
           cur.innerHTML = cur.innerHTML + response.data.reason + "<br />";
       })

       // After logging in, receive all extensions statuses
       sdk.on('AllExtensionsStatus', function (response) {
           console.log(response);
       })
   });
</script>
```