```ts
type EventCallbackListenersMap: { [K in EventTypeNames]: EventSpecificCallback<K>[] };
```

This type defines a map where each key is an event name, and the value is an array of callback functions associated with that event.
This structure is used to manage event listeners for different events

## Defined in

voicenter-events-sdk.d.ts:251
