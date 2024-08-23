## Constructors

### new AuthClass()

```ts
new AuthClass(eventsSdkClass: EventsSdkClass): AuthClass
```

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `eventsSdkClass` | [`EventsSdkClass`](EventsSdkClass.md) |

#### Returns

[`AuthClass`](AuthClass.md)

#### Defined in

voicenter-events-sdk.d.ts:83

## Properties

| Property | Type | Defined in |
| ------ | ------ | ------ |
| `lastLoginTimestamp` | `undefined` \| `number` | voicenter-events-sdk.d.ts:85 |
| `token` | `undefined` \| `string` | voicenter-events-sdk.d.ts:86 |

## Methods

### handleTokenExpiry()

```ts
handleTokenExpiry(): void
```

#### Returns

`void`

#### Defined in

voicenter-events-sdk.d.ts:95

***

### login()

```ts
login(): Promise<undefined | Partial<LoginSessionData>>
```

#### Returns

`Promise`\<`undefined` \| `Partial`\<[`LoginSessionData`](../interfaces/LoginSessionData.md)\>\>

#### Defined in

voicenter-events-sdk.d.ts:90

***

### onLoginResponse()

```ts
onLoginResponse(loginSessionData: Partial<LoginSessionData>): void
```

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `loginSessionData` | `Partial`\<[`LoginSessionData`](../interfaces/LoginSessionData.md)\> |

#### Returns

`void`

#### Defined in

voicenter-events-sdk.d.ts:94

***

### updateLastLoginTimestamp()

```ts
updateLastLoginTimestamp(): void
```

#### Returns

`void`

#### Defined in

voicenter-events-sdk.d.ts:91
