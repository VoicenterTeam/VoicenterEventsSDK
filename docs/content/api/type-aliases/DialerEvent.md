```ts
type DialerEvent: {
  callerID: string;
  data: Dialer;
  dialStatus: string;
  eventName: string;
  ivrUniqueId: string;
  telephonyServerTime: number;
};
```

## Type declaration

### callerID?

```ts
optional callerID: string;
```

callerID

### data

```ts
data: Dialer;
```

### dialStatus?

```ts
optional dialStatus: string;
```

dialStatus

### eventName

```ts
eventName: string;
```

Event name (dialer)

### ivrUniqueId?

```ts
optional ivrUniqueId: string;
```

ivrUniqueId

### telephonyServerTime?

```ts
optional telephonyServerTime: number;
```

TelephonyServerTime

## Defined in

voicenter-events-sdk.d.ts:197
