```ts
type EventCallbackRegistry: { [K in EventTypeNames]: Function };
```

Defines a registry of callback functions for each event type.
Each key is an event type name, and the value is a function that takes the specific event data type as an argument.
This registry is used to manage and invoke event-specific callbacks.

## Defined in

voicenter-events-sdk.d.ts:260
