```ts
type WrappedSocketEvent<T>: {
  data: EventDataMapExtended[T];
  name: T;
};
```

The structure of received socket events.

## Type Parameters

| Type Parameter |
| ------ |
| `T` *extends* [`EventsEnum`](../enumerations/EventsEnum.md) |

## Type declaration

### data

```ts
data: EventDataMapExtended[T];
```

### name

```ts
name: T;
```

## Defined in

voicenter-events-sdk.d.ts:1166
