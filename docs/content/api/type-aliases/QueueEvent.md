```ts
type QueueEvent: {
  data: Queue;
  eventName: string;
  ivrUniqueId: string;
  reason: QueueEventReasonEnum;
  servertime: number;
  servertimeoffset: number;
  telephonyServerTime: number;
};
```

## Type declaration

### data

```ts
data: Queue;
```

### eventName

```ts
eventName: string;
```

Event name (queue)

### ivrUniqueId

```ts
ivrUniqueId: string;
```

Ivr unique id

### reason

```ts
reason: QueueEventReasonEnum;
```

### servertime

```ts
servertime: number;
```

Server time

### servertimeoffset

```ts
servertimeoffset: number;
```

Server time offset

### telephonyServerTime

```ts
telephonyServerTime: number;
```

Telephony server time

## Defined in

voicenter-events-sdk.d.ts:959
