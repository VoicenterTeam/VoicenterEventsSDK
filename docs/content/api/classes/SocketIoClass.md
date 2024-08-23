## Constructors

### new SocketIoClass()

```ts
new SocketIoClass(eventsSdkClass: EventsSdkClass): SocketIoClass
```

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `eventsSdkClass` | [`EventsSdkClass`](EventsSdkClass.md) |

#### Returns

[`SocketIoClass`](SocketIoClass.md)

#### Defined in

voicenter-events-sdk.d.ts:1097

## Properties

| Property | Type | Defined in |
| ------ | ------ | ------ |
| `doReconnect` | `boolean` | voicenter-events-sdk.d.ts:1101 |
| `io` | `undefined` \| [`SocketTyped`](../type-aliases/SocketTyped.md) | voicenter-events-sdk.d.ts:1098 |
| `ioFunction` | `undefined` \| [`TypedSocketIo`](../type-aliases/TypedSocketIo.md) | voicenter-events-sdk.d.ts:1099 |
| `lastEventTimestamp` | `number` | voicenter-events-sdk.d.ts:1100 |

## Methods

### clearKeepAliveInterval()

```ts
clearKeepAliveInterval(): void
```

#### Returns

`void`

#### Defined in

voicenter-events-sdk.d.ts:1107

***

### closeAllConnections()

```ts
closeAllConnections(): void
```

#### Returns

`void`

#### Defined in

voicenter-events-sdk.d.ts:1109

***

### getSocketIoFunction()

```ts
getSocketIoFunction(Client: string): void
```

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `Client` | `string` |

#### Returns

`void`

#### Defined in

voicenter-events-sdk.d.ts:1105

***

### initKeepAlive()

```ts
initKeepAlive(): void
```

#### Returns

`void`

#### Defined in

voicenter-events-sdk.d.ts:1108

***

### initSocketConnection()

```ts
initSocketConnection(): void
```

#### Returns

`void`

#### Defined in

voicenter-events-sdk.d.ts:1106

***

### initSocketEvents()

```ts
initSocketEvents(): void
```

#### Returns

`void`

#### Defined in

voicenter-events-sdk.d.ts:1110
