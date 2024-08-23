```ts
type ExtensionEvent: {
  callerID: string;
  cause: ExtensionHangupCauseEnum;
  data: Extension;
  dialStatus: string;
  eventName: string;
  ivrUniqueId: string;
  reason: ExtensionEventReasonEnum;
  servertime: number;
  servertimeoffset: number;
  telephonyServerTime: number;
};
```

## Type declaration

### callerID?

```ts
optional callerID: string;
```

Caller id

### cause?

```ts
optional cause: ExtensionHangupCauseEnum;
```

### data

```ts
data: Extension;
```

### dialStatus?

```ts
optional dialStatus: string;
```

Dial status

### eventName

```ts
eventName: string;
```

Event name (extension)

### ivrUniqueId?

```ts
optional ivrUniqueId: string;
```

Ivr unique id

### reason

```ts
reason: ExtensionEventReasonEnum;
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

### telephonyServerTime?

```ts
optional telephonyServerTime: number;
```

Telephony server time

## Defined in

voicenter-events-sdk.d.ts:639
