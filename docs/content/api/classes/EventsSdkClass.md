## Constructors

### new EventsSdkClass()

```ts
new EventsSdkClass(options: EventsSdkOptionsClient): EventsSdkClass
```

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `options` | [`EventsSdkOptionsClient`](../type-aliases/EventsSdkOptionsClient.md) |

#### Returns

[`EventsSdkClass`](EventsSdkClass.md)

#### Defined in

voicenter-events-sdk.d.ts:342

## Properties

| Property | Modifier | Type | Defined in |
| ------ | ------ | ------ | ------ |
| `URL` | `public` | `undefined` \| `string` | voicenter-events-sdk.d.ts:334 |
| `URLList` | `public` | `string`[] | voicenter-events-sdk.d.ts:332 |
| `authClass` | `public` | [`AuthClass`](AuthClass.md) | voicenter-events-sdk.d.ts:338 |
| `eventEmitterClass` | `public` | [`EventEmitterClass`](EventEmitterClass.md) | voicenter-events-sdk.d.ts:341 |
| `getCircularReplacer` | `public` | () => (`key`: `string`, `value`: `object`) => `undefined` \| `object` | voicenter-events-sdk.d.ts:352 |
| `loggerClass` | `public` | [`LoggerClass`](LoggerClass.md) | voicenter-events-sdk.d.ts:340 |
| `options` | `readonly` | `Required`\<`Pick`\<[`EventsSdkOptionsOldStack`](../type-aliases/EventsSdkOptionsOldStack.md) \| [`EventsSdkOptionsNewStack`](../type-aliases/EventsSdkOptionsNewStack.md), \| `"isNewStack"` \| `"loginUrl"` \| `"refreshTokenUrl"` \| `"forceNew"` \| `"protocol"` \| `"timeout"` \| `"loggerConfig"` \| `"keepAliveTimeout"` \| `"reconnectionDelay"` \| `"loggerServer"` \| `"useLogger"`\>\> & \{ `email`: `string`; `getSettingsUrl`: `string`; `loggerConnectOptions`: [`LoggerConnectOptions`](../interfaces/LoggerConnectOptions.md); `loggerSocketConnection`: `Socket`\<`DefaultEventsMap`, `DefaultEventsMap`\>; `password`: `string`; `storageLoggerInstance`: `StorageLogger`\<`unknown`\>; `token`: `string`; \} & [`EventsSdkOptionsBase`](../interfaces/EventsSdkOptionsBase.md) | voicenter-events-sdk.d.ts:330 |
| `server` | `public` | `undefined` \| [`Server`](../interfaces/Server.md) | voicenter-events-sdk.d.ts:333 |
| `servers` | `public` | [`Server`](../interfaces/Server.md)[] | voicenter-events-sdk.d.ts:331 |
| `socket` | `public` | `undefined` \| [`SocketTyped`](../type-aliases/SocketTyped.md) | voicenter-events-sdk.d.ts:335 |
| `socketIoClass` | `public` | [`SocketIoClass`](SocketIoClass.md) | voicenter-events-sdk.d.ts:339 |

## Methods

### clearKeepAliveInterval()

```ts
clearKeepAliveInterval(): void
```

#### Returns

`void`

#### Defined in

voicenter-events-sdk.d.ts:348

***

### connect()

```ts
connect(serverParameter: ServerParameter): void
```

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `serverParameter` | [`ServerParameter`](../enumerations/ServerParameter.md) |

#### Returns

`void`

#### Defined in

voicenter-events-sdk.d.ts:346

***

### disconnect()

```ts
disconnect(): void
```

#### Returns

`void`

#### Defined in

voicenter-events-sdk.d.ts:347

***

### emit()

```ts
emit<T>(event: T, ...args: Parameters<ServerEmitEventCallbackRegistry[T]>): void
```

#### Type Parameters

| Type Parameter |
| ------ |
| `T` *extends* keyof [`ServerEmitEventDataMap`](../interfaces/ServerEmitEventDataMap.md) |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `event` | `T` |
| ...`args` | `Parameters`\<[`ServerEmitEventCallbackRegistry`](../type-aliases/ServerEmitEventCallbackRegistry.md)\[`T`\]\> |

#### Returns

`void`

#### Defined in

voicenter-events-sdk.d.ts:345

***

### getCurrentMonitorServer()

```ts
getCurrentMonitorServer(): undefined | Server
```

#### Returns

`undefined` \| [`Server`](../interfaces/Server.md)

#### Defined in

voicenter-events-sdk.d.ts:353

***

### init()

```ts
init(): Promise<boolean>
```

#### Returns

`Promise`\<`boolean`\>

#### Defined in

voicenter-events-sdk.d.ts:351

***

### on()

#### on(event, callback)

```ts
on<T>(event: T, callback: EventSpecificCallback<T>): void
```

##### Type Parameters

| Type Parameter |
| ------ |
| `T` *extends* keyof [`EventDataMap`](../interfaces/EventDataMap.md) |

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `event` | `T` |
| `callback` | [`EventSpecificCallback`](../type-aliases/EventSpecificCallback.md)\<`T`\> |

##### Returns

`void`

##### Defined in

voicenter-events-sdk.d.ts:343

#### on(event, callback)

```ts
on(event: "*", callback: (data: GenericEventWrapper) => void): void
```

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `event` | `"*"` |
| `callback` | (`data`: [`GenericEventWrapper`](../type-aliases/GenericEventWrapper.md)) => `void` |

##### Returns

`void`

##### Defined in

voicenter-events-sdk.d.ts:344
