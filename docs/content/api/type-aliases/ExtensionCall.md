```ts
type ExtensionCall: {
  actualDialedNumber: number;
  answered: number;
  blcServerID: number;
  blcServerId: number;
  callAnswered: number;
  callStarted: number;
  callType: CallTypeEnum;
  calldurationinterval: number;
  callername: string;
  callerphone: string;
  callstatus: CallStatusEnum;
  channel: string;
  channel 2: string;
  customdata: CustomData;
  did: string;
  direction: DirectionEnum;
  ip: string;
  isInternal: boolean;
  isOpensips: boolean;
  isSpyed: boolean;
  ivrid: string;
  originalCallerID: string;
  originalCallerName: string;
  outgoingcallername: string;
  outgoingcallerphone: string;
  queueID: number;
  recording: Recording;
  relatedIvrUniqueIDs: string[];
};
```

## Type declaration

### actualDialedNumber?

```ts
optional actualDialedNumber: number;
```

Actual dialed number

### answered

```ts
answered: number;
```

Answered

### blcServerID

```ts
blcServerID: number;
```

Blc server id

### blcServerId?

```ts
optional blcServerId: number;
```

Blc server id

### callAnswered

```ts
callAnswered: number;
```

Call answered

### callStarted

```ts
callStarted: number;
```

Call started

### callType?

```ts
optional callType: CallTypeEnum;
```

### calldurationinterval

```ts
calldurationinterval: number;
```

Call duration interval

### callername

```ts
callername: string;
```

Caller name

### callerphone

```ts
callerphone: string;
```

Caller phone

### callstatus

```ts
callstatus: CallStatusEnum;
```

### channel

```ts
channel: string;
```

Channel

### channel 2

```ts
channel 2: string;
```

Channel 2

### customdata

```ts
customdata: CustomData;
```

### did

```ts
did: string;
```

Did

### direction

```ts
direction: DirectionEnum;
```

### ip

```ts
ip: string;
```

Ip

### isInternal

```ts
isInternal: boolean;
```

Is internal

### isOpensips

```ts
isOpensips: boolean;
```

Is opensips

### isSpyed?

```ts
optional isSpyed: boolean;
```

Is spyed

### ivrid

```ts
ivrid: string;
```

Ivr id

### originalCallerID?

```ts
optional originalCallerID: string;
```

Original caller id

### originalCallerName?

```ts
optional originalCallerName: string;
```

Original caller name

### outgoingcallername?

```ts
optional outgoingcallername: string;
```

Outgoing caller name

### outgoingcallerphone?

```ts
optional outgoingcallerphone: string;
```

Outgoing caller phone

### queueID?

```ts
optional queueID: number;
```

Queue id

### recording

```ts
recording: Recording;
```

### relatedIvrUniqueIDs?

```ts
optional relatedIvrUniqueIDs: string[];
```

Related ivr unique ids

## Defined in

voicenter-events-sdk.d.ts:527
