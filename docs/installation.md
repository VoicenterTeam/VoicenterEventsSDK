# Installation

## Direct Download / CDN

https://unpkg.com/voicenter-events-sdk/dist/voicenter-events-sdk 

[unpkg.com](https://unpkg.com) provides NPM-based CDN links. The above link will always point to the latest release on NPM. You can also use a specific version/tag via URLs like https://unpkg.com/voicenter-events-sdk@{{ $version }}/dist/voicenter-events-sdk.js
 
Include voicenter-events-sdk after Vue and it will install itself automatically:

```html
<script src="https://unpkg.com/voicenter-events-sdk/dist/voicenter-events-sdk.js"></script>
```

## NPM

```sh
$ npm install voicenter-events-sdk
```

## Yarn

```sh
$ yarn add voicenter-events-sdk
```

```javascript
import VoicenterEventsSDK from 'voicenter-events-sdk'
```

You don't need to do this when using global script tags.

## Dev Build

You will have to clone directly from GitHub and build `voicenter-events-sdk` yourself if
you want to use the latest dev build.

```sh
$ git clone https://github.com//voicenter-events-sdk.git node_modules/voicenter-events-sdk
$ cd node_modules/voicenter-events-sdk
$ npm install
$ npm run build
```

