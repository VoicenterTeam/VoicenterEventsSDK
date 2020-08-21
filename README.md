# Voicenter Events SDK
![Image of Yaktocat](https://voicentercdn-voicenterltd.netdna-ssl.com/cdn/images/external/SDK_red.png)<br />
Voicenter Events SDK aims to manage api and socket communication with Voicenter APIs and backends.
You can use the SDK to send and receive real time data from and to voicenter servers.


## Getting Started

The Events SDK is bundled as a standalone Javascript pacakge. The instructions below will help you install and run it locally or contribute to it.

#### `1.Including SDK` 
```js
import EventsSDK from 'voicenter-events-sdk'
```
#### `2.Initializing new instance` 
```js
const sdk = new EventsSDK({
   ...options
});
```


### `3.Required params`
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
#### `4.Initing an instance` 
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

## Events you can subscribe to:
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

<!-- Socket IO library -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.3.6/socket.io.min.js"></script>
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
