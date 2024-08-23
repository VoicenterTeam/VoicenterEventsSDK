```ts
type LoginStatusEvent: {
  errorCode: number;
  errorDesc: string;
  queues: Queue[];
  serverTime: number;
  serverTimeOffset: number;
};
```

## Type declaration

### errorCode?

```ts
optional errorCode: number;
```

0 - Connection was establishing successfully.

### errorDesc?

```ts
optional errorDesc: string;
```

“Ok” - Connection was establishing successfully.

### queues

```ts
queues: Queue[];
```

### serverTime

```ts
serverTime: number;
```

Server time at the moment of the event

### serverTimeOffset

```ts
serverTimeOffset: number;
```

Difference in time between server and client

## Defined in

voicenter-events-sdk.d.ts:819
