```ts
type Queue: {
  AnsweredAgent: string;
  Calls: QueueCall[];
  DistributorID: number;
  IsDistributedQueue: boolean;
  QueueID: number;
  QueueName: string;
  UserId: number;
};
```

## Type declaration

### AnsweredAgent?

```ts
optional AnsweredAgent: string;
```

Answered agent

### Calls

```ts
Calls: QueueCall[];
```

### DistributorID?

```ts
optional DistributorID: number;
```

Distributor id

### IsDistributedQueue?

```ts
optional IsDistributedQueue: boolean;
```

Is distributed queue

### QueueID

```ts
QueueID: number;
```

Queue id

### QueueName

```ts
QueueName: string;
```

Queue name

### UserId?

```ts
optional UserId: number;
```

User id

## Defined in

voicenter-events-sdk.d.ts:895
