```ts
type EventsSdkOptionsMain: Required<Pick<EventsSdkOptionsOldStack | EventsSdkOptionsNewStack, 
  | "isNewStack"
  | "loginUrl"
  | "refreshTokenUrl"
  | "forceNew"
  | "protocol"
  | "timeout"
  | "loggerConfig"
  | "keepAliveTimeout"
  | "reconnectionDelay"
  | "loggerServer"
  | "useLogger">> & {
  email: string;
  getSettingsUrl: string;
  loggerConnectOptions: LoggerConnectOptions;
  loggerSocketConnection: Socket_2;
  password: string;
  storageLoggerInstance: StorageLogger;
  token: string;
};
```

## Type declaration

### email?

```ts
optional email: string;
```

### getSettingsUrl?

```ts
optional getSettingsUrl: string;
```

### loggerConnectOptions?

```ts
optional loggerConnectOptions: LoggerConnectOptions;
```

### loggerSocketConnection?

```ts
optional loggerSocketConnection: Socket_2;
```

### password?

```ts
optional password: string;
```

### storageLoggerInstance?

```ts
optional storageLoggerInstance: StorageLogger;
```

### token?

```ts
optional token: string;
```

## Defined in

voicenter-events-sdk.d.ts:377
