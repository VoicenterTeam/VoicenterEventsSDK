## Extends

- `Omit`\<[`ExtensionEvent`](../type-aliases/ExtensionEvent.md), `"reason"` \| `"data"`\>

## Properties

| Property | Type | Description | Inherited from | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| `callerID?` | `string` | Caller id | `Omit.callerID` | voicenter-events-sdk.d.ts:646 |
| `cause?` | [`ExtensionHangupCauseEnum`](../enumerations/ExtensionHangupCauseEnum.md) | - | `Omit.cause` | voicenter-events-sdk.d.ts:641 |
| `data` | [`ExtensionCallsUTCExtended`](ExtensionCallsUTCExtended.md) | - | - | voicenter-events-sdk.d.ts:693 |
| `dialStatus?` | `string` | Dial status | `Omit.dialStatus` | voicenter-events-sdk.d.ts:654 |
| `eventName` | `string` | Event name (extension) | `Omit.eventName` | voicenter-events-sdk.d.ts:650 |
| `ivrUniqueId?` | `string` | Ivr unique id | `Omit.ivrUniqueId` | voicenter-events-sdk.d.ts:662 |
| `reason` | \| `NEWCALL` \| `ANSWER` \| `HOLD` \| `UNHOLD` \| `USER_STATUS_UPDATE` | - | - | voicenter-events-sdk.d.ts:692 |
| `servertime` | `number` | Server time | `Omit.servertime` | voicenter-events-sdk.d.ts:658 |
| `servertimeoffset` | `number` | Server time offset | `Omit.servertimeoffset` | voicenter-events-sdk.d.ts:666 |
| `telephonyServerTime?` | `number` | Telephony server time | `Omit.telephonyServerTime` | voicenter-events-sdk.d.ts:670 |
