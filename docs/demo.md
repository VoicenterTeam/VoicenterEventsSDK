# Demo

### Code for event handling

```javascript
import EventsSdk from 'voicenter-events-sdk';


let sdk = new EventsSdk({
     token: this.monitorCode,
     debug: true
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
