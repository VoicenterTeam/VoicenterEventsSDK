# Demo

### Code for event handling

Note that the sdk requires `socket-io` installed. You can install it via npm or as a script tag.

#### Via npm
`npm install socket.io-client@1.3.6`

#### Direct script include
`<script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.3.6/socket.io.min.js"></script>`

```javascript
import VoicenterEventsSDK from 'voicenter-events-sdk';

let sdk = new VoicenterEventsSDK({
     token: this.monitorCode
});
sdk.init()
   .then(() => sdk.login())
   .then(() => {
     sdk.on('*', data => {
       // handle new events here
     });
   })
   .catch(err => {
     // handle login error here
   })
```

<ClientOnly>
 <Demo></Demo>
</ClientOnly>
