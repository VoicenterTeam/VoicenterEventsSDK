## Extends

- `Omit`\<[`AllExtensionStatusEvent`](../type-aliases/AllExtensionStatusEvent.md), `"extensions"`\>

## Properties

| Property | Type | Description | Inherited from | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| `errorCode?` | `number` | 0 - Connection was establishing successfully. | `Omit.errorCode` | voicenter-events-sdk.d.ts:37 |
| `errorDesc?` | `string` | “Ok” - Connection was establishing successfully. | `Omit.errorDesc` | voicenter-events-sdk.d.ts:41 |
| `extensions` | [`ExtensionSDK`](../type-aliases/ExtensionSDK.md)[] | - | - | voicenter-events-sdk.d.ts:54 |
| `servertime` | `number` | Server time at the moment of the event | `Omit.servertime` | voicenter-events-sdk.d.ts:46 |
| `servertimeoffset` | `number` | Difference in time between server and client | `Omit.servertimeoffset` | voicenter-events-sdk.d.ts:50 |
