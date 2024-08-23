```ts
type AllExtensionStatusEvent: {
  errorCode: number;
  errorDesc: string;
  extensions: Extension[];
  servertime: number;
  servertimeoffset: number;
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

### extensions

```ts
extensions: Extension[];
```

### servertime

```ts
servertime: number;
```

Server time at the moment of the event

### servertimeoffset

```ts
servertimeoffset: number;
```

Difference in time between server and client

## Defined in

voicenter-events-sdk.d.ts:33
