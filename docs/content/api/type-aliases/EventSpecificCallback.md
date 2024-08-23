```ts
type EventSpecificCallback<T>: (data: WrappedSocketEvent<T>) => void;
```

This is a generic type for callback functions used in event handling.
It takes a generic event name and defines a callback function that receives wrapped socket event data for that specific event.

## Type Parameters

| Type Parameter |
| ------ |
| `T` *extends* [`EventTypeNames`](EventTypeNames.md) |

## Parameters

| Parameter | Type |
| ------ | ------ |
| `data` | [`WrappedSocketEvent`](WrappedSocketEvent.md)\<`T`\> |

## Returns

`void`

## Defined in

voicenter-events-sdk.d.ts:327
