```ts
type EventWrappedSocketDataMap: { [K in EventTypeNames]: WrappedSocketEvent<K> };
```

This type represents a mapping of listener event names to their corresponding wrapped socket event data structures.
Each key is an event name, and the value is the wrapped socket event data for that event

## Defined in

voicenter-events-sdk.d.ts:461
