!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t():"function"==typeof define&&define.amd?define(t):(e=e||self).VoicenterEventsSDK=t()}(this,(function(){"use strict";function _typeof(e){return(_typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function _defineProperties(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}function _createClass(e,t,n){return t&&_defineProperties(e.prototype,t),n&&_defineProperties(e,n),Object.defineProperty(e,"prototype",{writable:!1}),e}function _defineProperty(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function _toConsumableArray(e){return _arrayWithoutHoles(e)||_iterableToArray(e)||_unsupportedIterableToArray(e)||_nonIterableSpread()}function _arrayWithoutHoles(e){if(Array.isArray(e))return _arrayLikeToArray(e)}function _iterableToArray(e){if("undefined"!=typeof Symbol&&null!=e[Symbol.iterator]||null!=e["@@iterator"])return Array.from(e)}function _unsupportedIterableToArray(e,t){if(e){if("string"==typeof e)return _arrayLikeToArray(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);return"Object"===n&&e.constructor&&(n=e.constructor.name),"Map"===n||"Set"===n?Array.from(e):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?_arrayLikeToArray(e,t):void 0}}function _arrayLikeToArray(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,o=new Array(t);n<t;n++)o[n]=e[n];return o}function _nonIterableSpread(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var eventTypes={LOGIN_STATUS:"loginStatus",LOGIN:"login",LOGIN_USER:"loginUser",LOGIN_CODE:"loginUserCode",LOGIN_ACCOUNT:"loginAccount",LOGIN_RESPONSE:"loginResponse",QUEUE_EVENT:"QueueEvent",QUEUES_UPDATED:"QueuesUpdated",DIALERS_UPDATED:"DialersUpdated",EXTENSION_EVENT:"ExtensionEvent",EXTENSION_UPDATED:"ExtensionsUpdated",ALL_EXTENSION_STATUS:"AllExtensionsStatus",CONNECT:"connect",CONNECT_ERROR:"connect_error",CONNECT_TIMEOUT:"connect_timeout",DISCONNECT:"disconnect",PONG:"pong",RECONNECT:"reconnect",RECONNECT_ATTEMPT:"reconnect_attempt",RESYNC:"resync",RECONNECTING:"reconnecting",RECONNECT_ERROR:"reconnect_error",RECONNECT_FAILED:"reconnect_failed",KEEP_ALIVE:"keepalive",KEEP_ALIVE_RESPONSE:"keepaliveResponse",CLOSE:"closeme",ERROR:"error",ALL_DIALERS_STATUS:"AllDialersStatus",DIALER_EVENT:"DialerEvent"},defaultServers=[{URLID:59,Priority:5,Version:2,Domain:"monitor1.voicenter.co"},{URLID:3,Priority:4,Version:2,Domain:"monitor3.voicenter.co.il"},{URLID:4,Priority:3,Version:2,Domain:"monitor4.voicenter.co.il"},{URLID:11,Priority:2,Version:2,Domain:"monitor11.voicenter.co"},{URLID:5,Priority:0,Version:2,Domain:"monitor5.voicenter.co.il"}],Logger=function(){function e(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};_classCallCheck(this,e),this.debug=t.debug}return _createClass(e,[{key:"_log",value:function(e,t){var n=t?"".concat(e,", %c Data -> ").concat(JSON.stringify(t)):"".concat(e),o=(new Date).toUTCString();console.log("%c ".concat(o,": %c ").concat(n),"color: #276749;","color: #4299e1;","color: #2c3e50;")}},{key:"_error",value:function(e,t){var n=t?"".concat(e,", Data -> ").concat(JSON.stringify(t)):"".concat(e),o=(new Date).toUTCString();console.error("".concat(o,": ").concat(n))}},{key:"log",value:function(e,t){this.debug&&(e&&!t?this._log(e):this._log(e,t))}},{key:"error",value:function(e,t){this.debug&&(e&&!t?this._error(e):this._error(e,t))}}]),e}();function isObject(e){var t=typeof e;return null!=e&&("object"==t||"function"==t)}var isObject_1=isObject,commonjsGlobal="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{};function createCommonjsModule(e,t){return e(t={exports:{}},t.exports),t.exports}var freeGlobal="object"==typeof commonjsGlobal&&commonjsGlobal&&commonjsGlobal.Object===Object&&commonjsGlobal,_freeGlobal=freeGlobal,freeSelf="object"==typeof self&&self&&self.Object===Object&&self,root=_freeGlobal||freeSelf||Function("return this")(),_root=root,now=function(){return _root.Date.now()},now_1=now,reWhitespace=/\s/;function trimmedEndIndex(e){for(var t=e.length;t--&&reWhitespace.test(e.charAt(t)););return t}var _trimmedEndIndex=trimmedEndIndex,reTrimStart=/^\s+/;function baseTrim(e){return e?e.slice(0,_trimmedEndIndex(e)+1).replace(reTrimStart,""):e}var _baseTrim=baseTrim,Symbol$1=_root.Symbol,_Symbol=Symbol$1,objectProto=Object.prototype,hasOwnProperty=objectProto.hasOwnProperty,nativeObjectToString=objectProto.toString,symToStringTag=_Symbol?_Symbol.toStringTag:void 0;function getRawTag(e){var t=hasOwnProperty.call(e,symToStringTag),n=e[symToStringTag];try{e[symToStringTag]=void 0;var o=!0}catch(e){}var i=nativeObjectToString.call(e);return o&&(t?e[symToStringTag]=n:delete e[symToStringTag]),i}var _getRawTag=getRawTag,objectProto$1=Object.prototype,nativeObjectToString$1=objectProto$1.toString;function objectToString(e){return nativeObjectToString$1.call(e)}var _objectToString=objectToString,nullTag="[object Null]",undefinedTag="[object Undefined]",symToStringTag$1=_Symbol?_Symbol.toStringTag:void 0;function baseGetTag(e){return null==e?void 0===e?undefinedTag:nullTag:symToStringTag$1&&symToStringTag$1 in Object(e)?_getRawTag(e):_objectToString(e)}var _baseGetTag=baseGetTag;function isObjectLike(e){return null!=e&&"object"==typeof e}var isObjectLike_1=isObjectLike,symbolTag="[object Symbol]";function isSymbol(e){return"symbol"==typeof e||isObjectLike_1(e)&&_baseGetTag(e)==symbolTag}var isSymbol_1=isSymbol,NAN=NaN,reIsBadHex=/^[-+]0x[0-9a-f]+$/i,reIsBinary=/^0b[01]+$/i,reIsOctal=/^0o[0-7]+$/i,freeParseInt=parseInt;function toNumber(e){if("number"==typeof e)return e;if(isSymbol_1(e))return NAN;if(isObject_1(e)){var t="function"==typeof e.valueOf?e.valueOf():e;e=isObject_1(t)?t+"":t}if("string"!=typeof e)return 0===e?e:+e;e=_baseTrim(e);var n=reIsBinary.test(e);return n||reIsOctal.test(e)?freeParseInt(e.slice(2),n?2:8):reIsBadHex.test(e)?NAN:+e}var toNumber_1=toNumber,FUNC_ERROR_TEXT="Expected a function",nativeMax=Math.max,nativeMin=Math.min;function debounce(e,t,n){var o,i,r,s,a,c,l=0,u=!1,h=!1,f=!0;if("function"!=typeof e)throw new TypeError(FUNC_ERROR_TEXT);function p(t){var n=o,r=i;return o=i=void 0,l=t,s=e.apply(r,n)}function E(e){return l=e,a=setTimeout(_,t),u?p(e):s}function y(e){var n=e-c;return void 0===c||n>=t||n<0||h&&e-l>=r}function _(){var e=now_1();if(y(e))return v(e);a=setTimeout(_,function(e){var n=t-(e-c);return h?nativeMin(n,r-(e-l)):n}(e))}function v(e){return a=void 0,f&&o?p(e):(o=i=void 0,s)}function d(){var e=now_1(),n=y(e);if(o=arguments,i=this,c=e,n){if(void 0===a)return E(c);if(h)return clearTimeout(a),a=setTimeout(_,t),p(c)}return void 0===a&&(a=setTimeout(_,t)),s}return t=toNumber_1(t)||0,isObject_1(n)&&(u=!!n.leading,r=(h="maxWait"in n)?nativeMax(toNumber_1(n.maxWait)||0,t):r,f="trailing"in n?!!n.trailing:f),d.cancel=function(){void 0!==a&&clearTimeout(a),l=0,o=c=i=a=void 0},d.flush=function(){return void 0===a?s:v(now_1())},d}var debounce_1=debounce,sdkEventReasons={NEWCALL:"NEWCALL",ANSWER:"ANSWER",HANGUP:"HANGUP"},offlineEvents=[eventTypes.CONNECT_ERROR,eventTypes.CONNECT_TIMEOUT,eventTypes.DISCONNECT,eventTypes.RECONNECT_ATTEMPT,eventTypes.RECONNECTING,eventTypes.RECONNECT_ERROR,eventTypes.RECONNECT_FAILED,sdkEventReasons.CLOSE];function isSocketOffline(e){var t=e.name;return offlineEvents.includes(t)}function onNewEvent(e){var t=e.eventData,n=e.store,o=e.extensionsModuleName,i=e.queuesModuleName,r=e.dialersModuleName,s=t.name,a=t.data;switch(n.commit("".concat(o,"/SET_IS_SOCKET_OFFLINE"),isSocketOffline(t)),s){case eventTypes.ALL_EXTENSION_STATUS:n.dispatch("".concat(o,"/setExtensions"),a.extensions);break;case eventTypes.EXTENSION_EVENT:var c=a.data;c.lastEvent={reason:a.reason,ivrid:a.ivruniqueid};var l=n.state[o].extensions.findIndex((function(e){return e.userID===c.userID}));-1!==l&&n.dispatch("".concat(o,"/updateExtension"),{index:l,extension:c});break;case eventTypes.LOGIN_STATUS:n.commit("".concat(o,"/SET_SERVER_TIME"),a),n.dispatch("".concat(i,"/setQueues"),a.queues);break;case eventTypes.QUEUE_EVENT:var u=a.data,h=(n.state[i].all||[]).findIndex((function(e){return e.QueueID===u.QueueID}));-1!==h&&n.dispatch("".concat(i,"/updateQueue"),{index:h,queue:u});break;case eventTypes.ALL_DIALERS_STATUS:n.dispatch("".concat(r,"/setDialers"),a.dialers);break;case eventTypes.DIALER_EVENT:var f=[];f.push(a.data),console.log(f,"dialers"),n.dispatch("".concat(r,"/updateDialers"),f)}}var callStatuses={CALLING:100,HOLD:101},_mutations,ISRAEL_TIMEZONE_OFFSET=108e5,MINUTE=6e4,LOGOUT_STATUS=2,HOLD_STATUS="hold",types={SET_EXTENSIONS:"SET_EXTENSIONS",UPDATE_EXTENSIONS:"UPDATE_EXTENSIONS",SET_SERVER_TIME:"SET_SERVER_TIME",SET_IS_SOCKET_OFFLINE:"SET_IS_SOCKET_OFFLINE"},state={extensions:[],serverTime:null,serverDelta:0,serverOffset:0,isSocketOffline:!1,offlineSocketTimestamp:null},mutations=(_mutations={},_defineProperty(_mutations,types.SET_EXTENSIONS,(function(e,t){e.extensions=t})),_defineProperty(_mutations,types.UPDATE_EXTENSIONS,(function(e,t){var n=t.index,o=t.extension;e.extensions.splice(n,1,o)})),_defineProperty(_mutations,types.SET_SERVER_TIME,(function(e,t){e.serverOffset=60*t.servertimeoffset*1e3||ISRAEL_TIMEZONE_OFFSET,e.serverTime=1e3*t.servertime-e.serverOffset,e.serverDelta=(new Date).getTime()-e.serverTime})),_defineProperty(_mutations,types.SET_IS_SOCKET_OFFLINE,(function(e,t){e.isSocketOffline=t,e.offlineSocketTimestamp=t?(new Date).getTime():null})),_mutations),actions={setExtensions:async function(e,t){(0,e.commit)(types.SET_EXTENSIONS,t)},updateExtension:async function(e,t){(0,e.commit)(types.UPDATE_EXTENSIONS,t)}};function isCallOnHold(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=e.callstatus||"";return t=t.toLowerCase(),e.answered&&t===HOLD_STATUS}var getters={isSocketOffline:function(e){if(!e.offlineSocketTimestamp||isNaN(e.offlineSocketTimestamp))return!1;var t=(new Date).getTime();return e.isSocketOffline&&t-e.offlineSocketTimestamp>MINUTE},extensionsWithCalls:function(e){return function(t){var n=[];return e.extensions.forEach((function(e){e.calls.length>0&&(e.calls.filter(isCallOnHold).length?e.representativeStatus=callStatuses.HOLD:e.representativeStatus=callStatuses.CALLING),n.push(e)})),t?n.filter((function(e){return e.representativeStatus!==LOGOUT_STATUS})):n}},extensionCountByStatus:function(e,t){return function(e){return t.extensionsWithCalls.filter((function(t){return t.representativeStatus===e})).length||0}}},extensionsModule={namespaced:!0,state:state,mutations:mutations,actions:actions,getters:getters},_mutations$1,types$1={SET_QUEUES:"SET_QUEUES",UPDATE_QUEUES:"UPDATE_QUEUES"},state$1={all:[]},mutations$1=(_mutations$1={},_defineProperty(_mutations$1,types$1.SET_QUEUES,(function(e,t){e.all=t})),_defineProperty(_mutations$1,types$1.UPDATE_QUEUES,(function(e,t){var n=t.index,o=t.queue;e.all.splice(n,1,o)})),_mutations$1),actions$1={setQueues:async function(e,t){(0,e.commit)(types$1.SET_QUEUES,t)},updateQueue:async function(e,t){(0,e.commit)(types$1.UPDATE_QUEUES,t)}},getters$1={queueWithActiveCalls:function(e){return e.all.filter((function(e){return e.Calls.length}))},allQueueCalls:function(e,t){var n=[];return t.queueWithActiveCalls.forEach((function(e){var t=e.Calls||[];n.push.apply(n,_toConsumableArray(t))})),n},filterQueuesByIds:function(e){return function(t){return t&&Array.isArray(t)?e.all.filter((function(e){return t.includes(e.QueueID)})):e.all}}},queuesModule={namespaced:!0,state:state$1,mutations:mutations$1,actions:actions$1,getters:getters$1},_mutations$2,types$2={SET_DIALERS:"SET_DIALERS",UPDATE_DIALERS:"UPDATE_DIALERS"},state$2={all:[]},mutations$2=(_mutations$2={},_defineProperty(_mutations$2,types$2.SET_DIALERS,(function(e,t){e.all=t})),_defineProperty(_mutations$2,types$2.UPDATE_DIALERS,(function(e,t){e.all=t})),_mutations$2),actions$2={setDialers:async function(e,t){(0,e.commit)(types$2.SET_DIALERS,t)},updateDialers:async function(e,t){(0,e.commit)(types$2.UPDATE_DIALERS,t)}},getters$2={getAllDialers:function(e){return e.all},getAllDialersWithTypeIVR:function(e){return e.all.filter((function(e){return"IVR"===e.type}))},getAllDialersWithTypeAUTOMATIC:function(e){return e.all.filter((function(e){return"Automatic"===e.type}))}},dialersModule={namespaced:!0,state:state$2,mutations:mutations$2,actions:actions$2,getters:getters$2};function getServerWithHighestPriority(e){var t=null,n=Number.MAX_SAFE_INTEGER;return e.forEach((function(e){e.Priority<n&&(n=e.Priority,t=e)})),t}function isValidDate(e){return!isNaN(e.getTime())}async function externalLogin(e,t){var n=t.email,o=t.password,i=t.token,r=t.username,s=null;s=i?JSON.stringify({token:i}):r?JSON.stringify({username:r,password:o}):JSON.stringify({email:n,pin:o});var a=await fetch(e,{method:"POST",headers:{"Content-Type":"application/json"},body:s}),c=await a.json();if(c.error)throw new Error(c.error);return c.Data.Socket}function getExternalLoginUrl(e,t){return"user"===t?"".concat(e,"/User"):"token"===t?"".concat(e,"/Token"):"account"===t?"".concat(e,"/Account"):e}async function refreshToken(e,t){return(await fetch(e,{method:"GET",headers:{"Content-Type":"application/json",Authorization:"Bearer ".concat(t)}})).json()}function loadExternalScript(e){return new Promise((function(t){var n=document.createElement("script");n.src=e,n.onload=function(){t()},n.onerror=function(){reject()},document.body.append(n)}))}var md5=createCommonjsModule((function(module){
/**
   * [js-md5]{@link https://github.com/emn178/js-md5}
   *
   * @namespace md5
   * @version 0.7.3
   * @author Chen, Yi-Cyuan [emn178@gmail.com]
   * @copyright Chen, Yi-Cyuan 2014-2017
   * @license MIT
   */
!function(){var ERROR="input is invalid type",WINDOW="object"==typeof window,root=WINDOW?window:{};root.JS_MD5_NO_WINDOW&&(WINDOW=!1);var WEB_WORKER=!WINDOW&&"object"==typeof self,NODE_JS=!root.JS_MD5_NO_NODE_JS&&"object"==typeof process&&process.versions&&process.versions.node;NODE_JS?root=commonjsGlobal:WEB_WORKER&&(root=self);var COMMON_JS=!root.JS_MD5_NO_COMMON_JS&&module.exports,ARRAY_BUFFER=!root.JS_MD5_NO_ARRAY_BUFFER&&"undefined"!=typeof ArrayBuffer,HEX_CHARS="0123456789abcdef".split(""),EXTRA=[128,32768,8388608,-2147483648],SHIFT=[0,8,16,24],OUTPUT_TYPES=["hex","array","digest","buffer","arrayBuffer","base64"],BASE64_ENCODE_CHAR="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".split(""),blocks=[],buffer8;if(ARRAY_BUFFER){var buffer=new ArrayBuffer(68);buffer8=new Uint8Array(buffer),blocks=new Uint32Array(buffer)}!root.JS_MD5_NO_NODE_JS&&Array.isArray||(Array.isArray=function(e){return"[object Array]"===Object.prototype.toString.call(e)}),!ARRAY_BUFFER||!root.JS_MD5_NO_ARRAY_BUFFER_IS_VIEW&&ArrayBuffer.isView||(ArrayBuffer.isView=function(e){return"object"==typeof e&&e.buffer&&e.buffer.constructor===ArrayBuffer});var createOutputMethod=function(e){return function(t){return new Md5(!0).update(t)[e]()}},createMethod=function(){var e=createOutputMethod("hex");NODE_JS&&(e=nodeWrap(e)),e.create=function(){return new Md5},e.update=function(t){return e.create().update(t)};for(var t=0;t<OUTPUT_TYPES.length;++t){var n=OUTPUT_TYPES[t];e[n]=createOutputMethod(n)}return e},nodeWrap=function(method){var crypto=eval("require('crypto')"),Buffer=eval("require('buffer').Buffer"),nodeMethod=function(e){if("string"==typeof e)return crypto.createHash("md5").update(e,"utf8").digest("hex");if(null==e)throw ERROR;return e.constructor===ArrayBuffer&&(e=new Uint8Array(e)),Array.isArray(e)||ArrayBuffer.isView(e)||e.constructor===Buffer?crypto.createHash("md5").update(new Buffer(e)).digest("hex"):method(e)};return nodeMethod};function Md5(e){if(e)blocks[0]=blocks[16]=blocks[1]=blocks[2]=blocks[3]=blocks[4]=blocks[5]=blocks[6]=blocks[7]=blocks[8]=blocks[9]=blocks[10]=blocks[11]=blocks[12]=blocks[13]=blocks[14]=blocks[15]=0,this.blocks=blocks,this.buffer8=buffer8;else if(ARRAY_BUFFER){var t=new ArrayBuffer(68);this.buffer8=new Uint8Array(t),this.blocks=new Uint32Array(t)}else this.blocks=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];this.h0=this.h1=this.h2=this.h3=this.start=this.bytes=this.hBytes=0,this.finalized=this.hashed=!1,this.first=!0}Md5.prototype.update=function(e){if(!this.finalized){var t,n=typeof e;if("string"!==n){if("object"!==n)throw ERROR;if(null===e)throw ERROR;if(ARRAY_BUFFER&&e.constructor===ArrayBuffer)e=new Uint8Array(e);else if(!(Array.isArray(e)||ARRAY_BUFFER&&ArrayBuffer.isView(e)))throw ERROR;t=!0}for(var o,i,r=0,s=e.length,a=this.blocks,c=this.buffer8;r<s;){if(this.hashed&&(this.hashed=!1,a[0]=a[16],a[16]=a[1]=a[2]=a[3]=a[4]=a[5]=a[6]=a[7]=a[8]=a[9]=a[10]=a[11]=a[12]=a[13]=a[14]=a[15]=0),t)if(ARRAY_BUFFER)for(i=this.start;r<s&&i<64;++r)c[i++]=e[r];else for(i=this.start;r<s&&i<64;++r)a[i>>2]|=e[r]<<SHIFT[3&i++];else if(ARRAY_BUFFER)for(i=this.start;r<s&&i<64;++r)(o=e.charCodeAt(r))<128?c[i++]=o:o<2048?(c[i++]=192|o>>6,c[i++]=128|63&o):o<55296||o>=57344?(c[i++]=224|o>>12,c[i++]=128|o>>6&63,c[i++]=128|63&o):(o=65536+((1023&o)<<10|1023&e.charCodeAt(++r)),c[i++]=240|o>>18,c[i++]=128|o>>12&63,c[i++]=128|o>>6&63,c[i++]=128|63&o);else for(i=this.start;r<s&&i<64;++r)(o=e.charCodeAt(r))<128?a[i>>2]|=o<<SHIFT[3&i++]:o<2048?(a[i>>2]|=(192|o>>6)<<SHIFT[3&i++],a[i>>2]|=(128|63&o)<<SHIFT[3&i++]):o<55296||o>=57344?(a[i>>2]|=(224|o>>12)<<SHIFT[3&i++],a[i>>2]|=(128|o>>6&63)<<SHIFT[3&i++],a[i>>2]|=(128|63&o)<<SHIFT[3&i++]):(o=65536+((1023&o)<<10|1023&e.charCodeAt(++r)),a[i>>2]|=(240|o>>18)<<SHIFT[3&i++],a[i>>2]|=(128|o>>12&63)<<SHIFT[3&i++],a[i>>2]|=(128|o>>6&63)<<SHIFT[3&i++],a[i>>2]|=(128|63&o)<<SHIFT[3&i++]);this.lastByteIndex=i,this.bytes+=i-this.start,i>=64?(this.start=i-64,this.hash(),this.hashed=!0):this.start=i}return this.bytes>4294967295&&(this.hBytes+=this.bytes/4294967296<<0,this.bytes=this.bytes%4294967296),this}},Md5.prototype.finalize=function(){if(!this.finalized){this.finalized=!0;var e=this.blocks,t=this.lastByteIndex;e[t>>2]|=EXTRA[3&t],t>=56&&(this.hashed||this.hash(),e[0]=e[16],e[16]=e[1]=e[2]=e[3]=e[4]=e[5]=e[6]=e[7]=e[8]=e[9]=e[10]=e[11]=e[12]=e[13]=e[14]=e[15]=0),e[14]=this.bytes<<3,e[15]=this.hBytes<<3|this.bytes>>>29,this.hash()}},Md5.prototype.hash=function(){var e,t,n,o,i,r,s=this.blocks;this.first?t=((t=((e=((e=s[0]-680876937)<<7|e>>>25)-271733879<<0)^(n=((n=(-271733879^(o=((o=(-1732584194^2004318071&e)+s[1]-117830708)<<12|o>>>20)+e<<0)&(-271733879^e))+s[2]-1126478375)<<17|n>>>15)+o<<0)&(o^e))+s[3]-1316259209)<<22|t>>>10)+n<<0:(e=this.h0,t=this.h1,n=this.h2,t=((t+=((e=((e+=((o=this.h3)^t&(n^o))+s[0]-680876936)<<7|e>>>25)+t<<0)^(n=((n+=(t^(o=((o+=(n^e&(t^n))+s[1]-389564586)<<12|o>>>20)+e<<0)&(e^t))+s[2]+606105819)<<17|n>>>15)+o<<0)&(o^e))+s[3]-1044525330)<<22|t>>>10)+n<<0),t=((t+=((e=((e+=(o^t&(n^o))+s[4]-176418897)<<7|e>>>25)+t<<0)^(n=((n+=(t^(o=((o+=(n^e&(t^n))+s[5]+1200080426)<<12|o>>>20)+e<<0)&(e^t))+s[6]-1473231341)<<17|n>>>15)+o<<0)&(o^e))+s[7]-45705983)<<22|t>>>10)+n<<0,t=((t+=((e=((e+=(o^t&(n^o))+s[8]+1770035416)<<7|e>>>25)+t<<0)^(n=((n+=(t^(o=((o+=(n^e&(t^n))+s[9]-1958414417)<<12|o>>>20)+e<<0)&(e^t))+s[10]-42063)<<17|n>>>15)+o<<0)&(o^e))+s[11]-1990404162)<<22|t>>>10)+n<<0,t=((t+=((e=((e+=(o^t&(n^o))+s[12]+1804603682)<<7|e>>>25)+t<<0)^(n=((n+=(t^(o=((o+=(n^e&(t^n))+s[13]-40341101)<<12|o>>>20)+e<<0)&(e^t))+s[14]-1502002290)<<17|n>>>15)+o<<0)&(o^e))+s[15]+1236535329)<<22|t>>>10)+n<<0,t=((t+=((o=((o+=(t^n&((e=((e+=(n^o&(t^n))+s[1]-165796510)<<5|e>>>27)+t<<0)^t))+s[6]-1069501632)<<9|o>>>23)+e<<0)^e&((n=((n+=(e^t&(o^e))+s[11]+643717713)<<14|n>>>18)+o<<0)^o))+s[0]-373897302)<<20|t>>>12)+n<<0,t=((t+=((o=((o+=(t^n&((e=((e+=(n^o&(t^n))+s[5]-701558691)<<5|e>>>27)+t<<0)^t))+s[10]+38016083)<<9|o>>>23)+e<<0)^e&((n=((n+=(e^t&(o^e))+s[15]-660478335)<<14|n>>>18)+o<<0)^o))+s[4]-405537848)<<20|t>>>12)+n<<0,t=((t+=((o=((o+=(t^n&((e=((e+=(n^o&(t^n))+s[9]+568446438)<<5|e>>>27)+t<<0)^t))+s[14]-1019803690)<<9|o>>>23)+e<<0)^e&((n=((n+=(e^t&(o^e))+s[3]-187363961)<<14|n>>>18)+o<<0)^o))+s[8]+1163531501)<<20|t>>>12)+n<<0,t=((t+=((o=((o+=(t^n&((e=((e+=(n^o&(t^n))+s[13]-1444681467)<<5|e>>>27)+t<<0)^t))+s[2]-51403784)<<9|o>>>23)+e<<0)^e&((n=((n+=(e^t&(o^e))+s[7]+1735328473)<<14|n>>>18)+o<<0)^o))+s[12]-1926607734)<<20|t>>>12)+n<<0,t=((t+=((r=(o=((o+=((i=t^n)^(e=((e+=(i^o)+s[5]-378558)<<4|e>>>28)+t<<0))+s[8]-2022574463)<<11|o>>>21)+e<<0)^e)^(n=((n+=(r^t)+s[11]+1839030562)<<16|n>>>16)+o<<0))+s[14]-35309556)<<23|t>>>9)+n<<0,t=((t+=((r=(o=((o+=((i=t^n)^(e=((e+=(i^o)+s[1]-1530992060)<<4|e>>>28)+t<<0))+s[4]+1272893353)<<11|o>>>21)+e<<0)^e)^(n=((n+=(r^t)+s[7]-155497632)<<16|n>>>16)+o<<0))+s[10]-1094730640)<<23|t>>>9)+n<<0,t=((t+=((r=(o=((o+=((i=t^n)^(e=((e+=(i^o)+s[13]+681279174)<<4|e>>>28)+t<<0))+s[0]-358537222)<<11|o>>>21)+e<<0)^e)^(n=((n+=(r^t)+s[3]-722521979)<<16|n>>>16)+o<<0))+s[6]+76029189)<<23|t>>>9)+n<<0,t=((t+=((r=(o=((o+=((i=t^n)^(e=((e+=(i^o)+s[9]-640364487)<<4|e>>>28)+t<<0))+s[12]-421815835)<<11|o>>>21)+e<<0)^e)^(n=((n+=(r^t)+s[15]+530742520)<<16|n>>>16)+o<<0))+s[2]-995338651)<<23|t>>>9)+n<<0,t=((t+=((o=((o+=(t^((e=((e+=(n^(t|~o))+s[0]-198630844)<<6|e>>>26)+t<<0)|~n))+s[7]+1126891415)<<10|o>>>22)+e<<0)^((n=((n+=(e^(o|~t))+s[14]-1416354905)<<15|n>>>17)+o<<0)|~e))+s[5]-57434055)<<21|t>>>11)+n<<0,t=((t+=((o=((o+=(t^((e=((e+=(n^(t|~o))+s[12]+1700485571)<<6|e>>>26)+t<<0)|~n))+s[3]-1894986606)<<10|o>>>22)+e<<0)^((n=((n+=(e^(o|~t))+s[10]-1051523)<<15|n>>>17)+o<<0)|~e))+s[1]-2054922799)<<21|t>>>11)+n<<0,t=((t+=((o=((o+=(t^((e=((e+=(n^(t|~o))+s[8]+1873313359)<<6|e>>>26)+t<<0)|~n))+s[15]-30611744)<<10|o>>>22)+e<<0)^((n=((n+=(e^(o|~t))+s[6]-1560198380)<<15|n>>>17)+o<<0)|~e))+s[13]+1309151649)<<21|t>>>11)+n<<0,t=((t+=((o=((o+=(t^((e=((e+=(n^(t|~o))+s[4]-145523070)<<6|e>>>26)+t<<0)|~n))+s[11]-1120210379)<<10|o>>>22)+e<<0)^((n=((n+=(e^(o|~t))+s[2]+718787259)<<15|n>>>17)+o<<0)|~e))+s[9]-343485551)<<21|t>>>11)+n<<0,this.first?(this.h0=e+1732584193<<0,this.h1=t-271733879<<0,this.h2=n-1732584194<<0,this.h3=o+271733878<<0,this.first=!1):(this.h0=this.h0+e<<0,this.h1=this.h1+t<<0,this.h2=this.h2+n<<0,this.h3=this.h3+o<<0)},Md5.prototype.hex=function(){this.finalize();var e=this.h0,t=this.h1,n=this.h2,o=this.h3;return HEX_CHARS[e>>4&15]+HEX_CHARS[15&e]+HEX_CHARS[e>>12&15]+HEX_CHARS[e>>8&15]+HEX_CHARS[e>>20&15]+HEX_CHARS[e>>16&15]+HEX_CHARS[e>>28&15]+HEX_CHARS[e>>24&15]+HEX_CHARS[t>>4&15]+HEX_CHARS[15&t]+HEX_CHARS[t>>12&15]+HEX_CHARS[t>>8&15]+HEX_CHARS[t>>20&15]+HEX_CHARS[t>>16&15]+HEX_CHARS[t>>28&15]+HEX_CHARS[t>>24&15]+HEX_CHARS[n>>4&15]+HEX_CHARS[15&n]+HEX_CHARS[n>>12&15]+HEX_CHARS[n>>8&15]+HEX_CHARS[n>>20&15]+HEX_CHARS[n>>16&15]+HEX_CHARS[n>>28&15]+HEX_CHARS[n>>24&15]+HEX_CHARS[o>>4&15]+HEX_CHARS[15&o]+HEX_CHARS[o>>12&15]+HEX_CHARS[o>>8&15]+HEX_CHARS[o>>20&15]+HEX_CHARS[o>>16&15]+HEX_CHARS[o>>28&15]+HEX_CHARS[o>>24&15]},Md5.prototype.toString=Md5.prototype.hex,Md5.prototype.digest=function(){this.finalize();var e=this.h0,t=this.h1,n=this.h2,o=this.h3;return[255&e,e>>8&255,e>>16&255,e>>24&255,255&t,t>>8&255,t>>16&255,t>>24&255,255&n,n>>8&255,n>>16&255,n>>24&255,255&o,o>>8&255,o>>16&255,o>>24&255]},Md5.prototype.array=Md5.prototype.digest,Md5.prototype.arrayBuffer=function(){this.finalize();var e=new ArrayBuffer(16),t=new Uint32Array(e);return t[0]=this.h0,t[1]=this.h1,t[2]=this.h2,t[3]=this.h3,e},Md5.prototype.buffer=Md5.prototype.arrayBuffer,Md5.prototype.base64=function(){for(var e,t,n,o="",i=this.array(),r=0;r<15;)e=i[r++],t=i[r++],n=i[r++],o+=BASE64_ENCODE_CHAR[e>>>2]+BASE64_ENCODE_CHAR[63&(e<<4|t>>>4)]+BASE64_ENCODE_CHAR[63&(t<<2|n>>>6)]+BASE64_ENCODE_CHAR[63&n];return e=i[r],o+=BASE64_ENCODE_CHAR[e>>>2]+BASE64_ENCODE_CHAR[e<<4&63]+"=="};var exports=createMethod();COMMON_JS?module.exports=exports:root.md5=exports}()})),defaultOptions={url:"https://monitorapi.voicenter.co.il/monitorAPI/getMonitorUrls",fallbackServer:{Domain:"monitor5.voicenter.co.il",Priority:0},loginUrl:"https://loginapi.voicenter.co.il/monitorAPI/Login",refreshTokenUrl:"https://loginapi.voicenter.co.il/monitorAPI/RefreshIdentityToken",servers:defaultServers,token:null,loginType:"token",forceNew:!0,reconnectionDelay:1e4,reconnectionDelayMax:1e4,maxReconnectAttempts:2,timeout:1e4,keepAliveTimeout:6e4,idleInterval:3e5,protocol:"https",transports:["websocket"],upgrade:!1,store:null,extensionsModuleName:"sdkExtensions",queuesModuleName:"sdkQueues",dialersModuleName:"sdkDialers",serverFetchStrategy:"remote",serverType:null},allConnections=[],listenersMap=new Map,EventsSDK=function(){function e(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};if(_classCallCheck(this,e),this.options=Object.assign({},defaultOptions,t),this.argumentOptions=Object.assign({},t),!this.options.loginType)throw new Error("A login type should be provided");this.Logger=new Logger(this.options),this.servers=[],this.server=null,this.socket=null,this.connected=!1,this.connectionEstablished=!1,this._lastEventTimestamp=(new Date).getTime(),this._initReconnectOptions(),this._listenersMap=listenersMap,this._retryConnection=debounce_1(this._connect.bind(this),this.reconnectOptions.reconnectionDelay,{leading:!0,trailing:!1}),this._lastLoginTimestamp=null,this._handleLocalEvents=!1,this._registerExtensionsModule(),this._registerQueueModule(),this._registerDialerModule()}return _createClass(e,[{key:"getLastEventTimestamp",value:function(){return this._lastEventTimestamp}},{key:"_reSync",value:function(){this.emit(eventTypes.RESYNC,{cache:!1})}},{key:"_registerExtensionsModule",value:function(){var e=this.options.extensionsModuleName||"sdkExtensions";this._validateStoreModule(e)&&(this.options.store.registerModule(e,extensionsModule),this._handleLocalEvents=!0)}},{key:"_registerQueueModule",value:function(){var e=this.options.queuesModuleName||"sdkQueues";this._validateStoreModule(e)&&(this.options.store.registerModule(e,queuesModule),this._handleLocalEvents=!0)}},{key:"_registerDialerModule",value:function(){var e=this.options.dialersModuleName||"sdkDialers";this._validateStoreModule(e)&&(this.options.store.registerModule(e,dialersModule),this._handleLocalEvents=!0)}},{key:"_validateStoreModule",value:function(e){var t=this.options.store;return!!t&&(t.state[e]&&t.unregisterModule(e),!0)}},{key:"_initReconnectOptions",value:function(){this.reconnectOptions={retryCount:1,maxReconnectAttempts:this.options.maxReconnectAttempts,reconnectionDelay:this.options.reconnectionDelay,minReconnectionDelay:this.options.reconnectionDelay,maxReconnectionDelay:3e5}}},{key:"_onConnect",value:function(){this._initReconnectDelays(),this.connected=!0,this.Logger.log(eventTypes.CONNECT,this.reconnectOptions)}},{key:"_initReconnectDelays",value:function(){this.reconnectOptions.retryCount=1;var e=this.reconnectOptions.minReconnectionDelay;this.reconnectOptions.reconnectionDelay=e,this.socket.io.reconnectionDelay(e),this.socket.io.reconnectionDelayMax(e)}},{key:"_onConnectError",value:function(e){this._retryConnection("next",!0),this.connected=!1,this.Logger.log(eventTypes.CONNECT_ERROR,e)}},{key:"_onError",value:function(e){this.Logger.log(eventTypes.ERROR,e)}},{key:"_onReconnectFailed",value:function(){this._retryConnection("next",!0),this.Logger.log(eventTypes.RECONNECT_FAILED,this.reconnectOptions)}},{key:"_onConnectTimeout",value:function(){this._retryConnection("next",!0),this.Logger.log(eventTypes.CONNECT_TIMEOUT,this.reconnectOptions)}},{key:"_onReconnectAttempt",value:function(){if(this.connected=!1,this.reconnectOptions.retryCount>=this.reconnectOptions.maxReconnectAttempts)this._retryConnection("next",!0);else{if(this.reconnectOptions.reconnectionDelay<this.reconnectOptions.maxReconnectionDelay){var e=this.reconnectOptions.minReconnectionDelay*this.reconnectOptions.retryCount;this.reconnectOptions.reconnectionDelay=e,this.socket.io.reconnectionDelay(e),this.socket.io.reconnectionDelayMax(e)}this.reconnectOptions.retryCount++,this.Logger.log(eventTypes.RECONNECT_ATTEMPT,this.reconnectOptions)}}},{key:"_onDisconnect",value:function(e){this.connected=!1,this.Logger.log(eventTypes.DISCONNECT,e),this._connect("next",!0)}},{key:"_onKeepAlive",value:function(e){("object"!==_typeof(e)||0===e.errorCode)&&e&&this.connected?(this.Logger.log(eventTypes.KEEP_ALIVE_RESPONSE),this._lastEventTimestamp=(new Date).getTime()):this._initSocketConnection()}},{key:"_onLoginResponse",value:async function(e){e.Client&&await loadExternalScript("https://loginapi.voicenter.co.il/monitorAPI/GetSocketClient?v=2.4.0"),e.URL&&(this.server={Priority:0,Domain:e.URL.replace("https://","")}),e.URLList&&Array.isArray(e.URLList)&&(this.servers=e.URLList.map((function(e,t){return{Priority:t,Domain:e.replace("https://","")}}))),e.Token&&(this.options.token=e.Token,this.token=e.Token,await this._connect("default",!0)),e.TokenExpiry&&(this.options.tokenExpiry=e.TokenExpiry),e.RefreshToken&&(this.options.refreshToken=e.RefreshToken,this._handleTokenExpiry())}},{key:"_handleTokenExpiry",value:function(){var e=this,t=new Date(this.options.tokenExpiry);if(isValidDate(t)){var n=t.getTime()-(new Date).getTime()-5e3;setTimeout((async function(){var t=null,n=await refreshToken(e.options.refreshTokenUrl,e.options.refreshToken);if(n.Data)return t=n.Data.Socket,await e._onLoginResponse(t);throw new Error("Error on refreshToken")}),n)}}},{key:"_parsePacket",value:function(e){return e.data?{name:e.data[0],data:e.data[1]}:{}}},{key:"_connect",value:async function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"default",t=arguments.length>1&&void 0!==arguments[1]&&arguments[1],n=null;if("default"===e)n=this._findCurrentServer();else if("next"===e)n=this._findNextAvailableServer();else{if("prev"!==e)throw new Error("Incorrect 'server' parameter passed to connect function ".concat(e,". Should be 'default' or 'next'"));n=this._findMaxPriorityServer()}n||(this.server=this._findCurrentServer()),this._initSocketConnection(),this._initSocketEvents(),this._initKeepAlive(),this._initReconnectDelays(),t||await this.login(this.options.loginType)}},{key:"_checkInit",value:function(){if(!this.connectionEstablished)throw new Error('Make sure you call "sdk.init()" before doing other operations.')}},{key:"_initSocketConnection",value:function(){var e=this.server.Domain,t=this.options.protocol,n="".concat(t,"://").concat(e);this.Logger.log("Connecting to..",n),this.closeAllConnections();var o={reconnection:!1,perMessageDeflate:!1,upgrade:!1,transports:["websocket"],debug:!1};this.token&&(o.query={token:this.token}),this.socket=window.io(n,o),allConnections.push(this.socket),this.connectionEstablished=!0}},{key:"_initSocketEvents",value:function(){var e=this;this.socket.on(eventTypes.RECONNECT_ATTEMPT,(function(t){return e._onReconnectAttempt(t)})).on(eventTypes.RECONNECT_FAILED,(function(t){return e._onReconnectFailed(t)})).on(eventTypes.CONNECT,(function(t){return e._onConnect(t)})).on(eventTypes.CONNECT_TIMEOUT,(function(t){return e._onConnectTimeout(t)})).on(eventTypes.CONNECT_ERROR,(function(t){return e._onConnectError(t)})).on(eventTypes.RECONNECT_ERROR,(function(t){return e._onReconnectAttempt(t)})).on(eventTypes.ERROR,(function(t){return e._onError(t)})).on(eventTypes.DISCONNECT,(function(t){return e._onDisconnect(t)})),this.socket.onpacket=this._onEvent.bind(this),this.socket.onevent=this._onEvent.bind(this)}},{key:"_initKeepAlive",value:function(){var e=this;this.keepAliveInterval&&clearInterval(this.keepAliveInterval),this.idleInterval&&clearInterval(this.idleInterval),this.keepAliveInterval=setInterval((async function(){var t=(new Date).getTime(),n=2*e.options.keepAliveTimeout;t>e.getLastEventTimestamp()+n?await e._connect("next",!0):e.socket?t>e.getLastEventTimestamp()+e.options.keepAliveTimeout&&e.emit(eventTypes.KEEP_ALIVE,e.options.token):e._initSocketConnection()}),this.options.keepAliveTimeout)}},{key:"_findCurrentServer",value:function(){var e=null;return this.servers.length&&(e=this.servers[0]),this.server=e,this.server||(this.server=this.options.fallbackServer),this.server}},{key:"_findNextAvailableServer",value:function(){var e=this.server.Priority;if(this.Logger.log("Failover -> Trying to find another server"),e===this.servers.length-1)return this._findMaxPriorityServer();var t=e+1,n=this.servers.find((function(e){return e.Priority===t}));return n||(n=this._findMaxPriorityServer())?this.server.Domain!==n.Domain?(this.server=n,this.server):(this.Logger.log("Failover -> Found new server. Connecting to it...",this.server),null):void 0}},{key:"_findMaxPriorityServer",value:function(){this.Logger.log("Fallback -> Trying to find previous server","_findMaxPriorityServer");var e=getServerWithHighestPriority(this.servers);return this.server?this.server&&e.Domain!==this.server.Domain?(this.server=e,this.Logger.log("Fallback -> Trying to find previous server",this.server),this.server):null:(this.server=e,this.server)}},{key:"_getServers",value:async function(){"static"===this.options.serverFetchStrategy&&this.argumentOptions.servers&&Array.isArray(this.argumentOptions.servers)&&this.argumentOptions.servers.length>1&&(this.servers=this.argumentOptions.servers)}},{key:"_onEvent",value:function(e){var t,n=this;if(e.data){var o=this._parsePacket(e);this.Logger.log("New event -> ".concat(o.name),o),this._lastEventTimestamp=(new Date).getTime(),this._listenersMap.forEach((function(e,t){("*"===t||o.name===t)&&e(o)}));var i=(_defineProperty(t={},eventTypes.KEEP_ALIVE_RESPONSE,this._onKeepAlive),_defineProperty(t,eventTypes.LOGIN_RESPONSE,this._onLoginResponse),_defineProperty(t,eventTypes.EXTENSION_UPDATED,this._reSync),_defineProperty(t,eventTypes.QUEUES_UPDATED,this._reSync),_defineProperty(t,eventTypes.DIALERS_UPDATED,this._reSync),_defineProperty(t,eventTypes.LOGIN_STATUS,(function(){n.connected||n._onConnect()})),t)[o.name];i&&"function"==typeof i&&i.call(this,o.data),this._handleLocalEvents&&onNewEvent(Object.assign({eventData:o},this.options))}}},{key:"init",value:async function(){return this.connectionEstablished||(this.socket&&this.emit(eventTypes.CLOSE),await this._getToken(),await this._getTabsSession(),await this.login(this.options.loginType),await this._getServers()),!0}},{key:"setToken",value:async function(e){this.options.token=e,this.disconnect(),await this.init()}},{key:"closeAllConnections",value:function(){allConnections.forEach((function(e){e.close(),e.disconnect()})),allConnections=[],this.socket&&(this.socket.disconnect(),this.socket.close(),this.socket=null)}},{key:"disconnect",value:function(){this._listenersMap=new Map,this.closeAllConnections()}},{key:"on",value:function(e,t){this._listenersMap.set(e,t),this._checkInit()}},{key:"emit",value:function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};this._checkInit(),this.Logger.log("EMIT -> ".concat(e),t),this.socket.emit(e,t)}},{key:"reSync",value:function(){var e=!(arguments.length>0&&void 0!==arguments[0])||arguments[0];this.emit(eventTypes.RESYNC,{cache:e})}},{key:"setMonitorUrl",value:async function(e){var t=this.options.url,n=this.options.serverFetchStrategy;try{if(!e)return;this.options.url=e,this.options.serverFetchStrategy="remote",await this.init()}catch(e){this._onError(e),this.options.url=t,this.options.serverFetchStrategy=n,await this.init()}}},{key:"_getToken",value:function(){var e=this.options.loginType;if(this.token=this.options.token,"token"===e&&!this.token)throw new Error("Token login type expects the token option to be provided")}},{key:"_getTabsSession",value:function(){return window.sessionStorage.length||localStorage.setItem("getSessionStorage",Date.now()),window.addEventListener("storage",(function(e){if("getSessionStorage"==e.key)localStorage.setItem("sessionStorage",JSON.stringify(window.sessionStorage)),localStorage.removeItem("sessionStorage");else if("sessionStorage"==e.key&&!sessionStorage.length){var t=JSON.parse(e.newValue);for(var n in t)window.sessionStorage.setItem(n,t[n])}})),new Promise((function(e){return setTimeout(e,200)}))}},{key:"login",value:function(){var e=this,t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"token",n={token:this.options.token,email:this.options.email,username:this.options.username,password:this.options.password},o=md5(JSON.stringify(n)),i=1e3;return this._lastLoginTimestamp+i>(new Date).getTime()?Promise.resolve():(this._lastLoginTimestamp=(new Date).getTime(),new Promise((async function(i,r){try{var s=window.sessionStorage.getItem(o);if(s)return s=JSON.parse(s),e.Logger.log("got data from session",s),await e._onLoginResponse(s),i(s)}catch(t){e.Logger.log("Error on getting session",t)}try{var a=getExternalLoginUrl(e.options.loginUrl,t),c=await externalLogin(a,n);await e._onLoginResponse(c),window.sessionStorage.setItem(o,JSON.stringify(c)),i(c)}catch(t){e.servers=e.argumentOptions.servers||defaultServers,r(t)}})))}}]),e}();return"undefined"!=typeof window&&(window.EventsSDK=EventsSDK),EventsSDK}));
//# sourceMappingURL=voicenter-events-sdk.umd.js.map
