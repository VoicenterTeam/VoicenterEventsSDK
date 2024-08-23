```ts
type Extension: {
  accountID: number;
  calls: ExtensionCall[];
  currentCall: ExtensionCall;
  extenUser: string;
  lastAnsweredCallEventEpoch: number;
  lastCallEventEpoch: number;
  lastHangupCallEpoch: number;
  number: number;
  onlineUserID: number;
  peerStatus: string;
  representative: number;
  representativeStatus: number;
  representativeUpdated: number;
  summery: Summery;
  topAccountID: number;
  userID: number;
  userName: string;
};
```

## Type declaration

### accountID

```ts
accountID: number;
```

Account id

### calls

```ts
calls: ExtensionCall[];
```

### currentCall?

```ts
optional currentCall: ExtensionCall;
```

### extenUser

```ts
extenUser: string;
```

Exten user

### lastAnsweredCallEventEpoch

```ts
lastAnsweredCallEventEpoch: number;
```

Last answered call event epoch

### lastCallEventEpoch

```ts
lastCallEventEpoch: number;
```

Last call event epoch

### lastHangupCallEpoch

```ts
lastHangupCallEpoch: number;
```

Last hangup call epoch

### number

```ts
number: number;
```

Number

### onlineUserID

```ts
onlineUserID: number;
```

Online user id

### peerStatus

```ts
peerStatus: string;
```

Peer status

### representative

```ts
representative: number;
```

Representative

### representativeStatus

```ts
representativeStatus: number;
```

Representative status

### representativeUpdated

```ts
representativeUpdated: number;
```

Representative updated

### summery

```ts
summery: Summery;
```

### topAccountID

```ts
topAccountID: number;
```

Top account id

### userID

```ts
userID: number;
```

User id

### userName

```ts
userName: string;
```

User name

## Defined in

voicenter-events-sdk.d.ts:465
