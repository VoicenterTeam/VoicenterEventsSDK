## Constructors

### new EventEmitterClass()

```ts
new EventEmitterClass(eventsSdkClass: EventsSdkClass): EventEmitterClass
```

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `eventsSdkClass` | [`EventsSdkClass`](EventsSdkClass.md) |

#### Returns

[`EventEmitterClass`](EventEmitterClass.md)

#### Defined in

voicenter-events-sdk.d.ts:298

## Methods

### emit()

```ts
emit<T>(event: T, data: EventTypeData<T>): void
```

#### Type Parameters

| Type Parameter |
| ------ |
| `T` *extends* keyof [`EventDataMap`](../interfaces/EventDataMap.md) |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `event` | `T` |
| `data` | [`EventTypeData`](../type-aliases/EventTypeData.md)\<`T`\> |

#### Returns

`void`

#### Defined in

voicenter-events-sdk.d.ts:302

***

### off()

#### off(event, callback)

```ts
off<T>(event: T, callback: EventSpecificCallback<T>): void
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

voicenter-events-sdk.d.ts:300

#### off(event, callback)

```ts
off(event: "*", callback: (data: GenericEventWrapper) => void): void
```

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `event` | `"*"` |
| `callback` | (`data`: [`GenericEventWrapper`](../type-aliases/GenericEventWrapper.md)) => `void` |

##### Returns

`void`

##### Defined in

voicenter-events-sdk.d.ts:301

***

### on()

```ts
on(event: unknown, callback: unknown): void
```

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `event` | `unknown` |
| `callback` | `unknown` |

#### Returns

`void`

#### Defined in

voicenter-events-sdk.d.ts:299
