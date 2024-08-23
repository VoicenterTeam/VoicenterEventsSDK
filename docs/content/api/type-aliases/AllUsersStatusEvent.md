```ts
type AllUsersStatusEvent: {
  errorCode: number;
  errorDesc: string;
  serverTime: number;
  serverTimeOffset: number;
  users: User[];
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

### users

```ts
users: User[];
```

## Defined in

voicenter-events-sdk.d.ts:59
