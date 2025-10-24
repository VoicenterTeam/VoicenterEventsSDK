import { EventsEnum, Extension, ExtensionEventReasonEnum, type QueueCall, VoicebotEventDataCall, VoicebotEventDataCallEventsData } from '@voicenter-team/real-time-events-types'
import { EventDataMap, EventDataMapExtended } from '@/types/events'
import {
    CurrentCallUTCExtended,
    ExtensionCallSDK,
    ExtensionEventExtended,
    ExtensionUTCExtended,
} from '@/types/sdk-extension-extended'
import type { ExtensionCall } from '@voicenter-team/real-time-events-types/dist/models/ExtensionCall'
import { QueueCallSDK } from '@/types/sdk-queue-extended'
import { VoicebotCallUTCExtended } from '@/types/sdk-voicebots-extended'

type NumericKeys<T> = {
    [P in keyof T]: T[P] extends number
        ? P extends string
            ? P
            : never
        : never
}[keyof T]

type PropertyWithUTC<T extends string> = `${T}_UTC` | `${T}_UTC_CLIENT`

type WithUTCProperties<T extends object, K extends NumericKeys<T>> = T & {
    [P in K as PropertyWithUTC<P & string>]: number
}

export default class EventsHandler {
    public static mapExtensionEvent (data: EventDataMap[EventsEnum.EXTENSION_EVENT]): EventDataMapExtended[EventsEnum.EXTENSION_EVENT] {
        const reason = data.reason
        let dataExtended: undefined | ExtensionEventExtended
        let currentCallExtended: undefined | CurrentCallUTCExtended

        if (data.data.currentCall) {
            currentCallExtended = this.mapExtensionCall(data, data.data.currentCall)
        }

        const extensionExtended = this.mapExtensionData(data, data.data)

        if (reason === ExtensionEventReasonEnum.HANGUP) {
            dataExtended = {
                ...data,
                reason,
                data: {
                    ...extensionExtended,
                    currentCall: currentCallExtended ?
                        {
                            ...currentCallExtended,
                            duration: currentCallExtended.callAnswered_UTC_CLIENT ? Date.now() - currentCallExtended.callAnswered_UTC_CLIENT : 0
                        }
                        : undefined,
                    calls: data.data.calls?.map((call) => {
                        const callExtended = this.mapExtensionCall(data, call)

                        return {
                            ...callExtended,
                            duration: callExtended.callAnswered_UTC_CLIENT ? Date.now() - callExtended.callAnswered_UTC_CLIENT : 0
                        }
                    })
                }
            }
        } else {
            dataExtended = {
                ...data,
                data: {
                    ...extensionExtended,
                    currentCall: currentCallExtended,
                    calls: data.data.calls?.map((call) => this.mapExtensionCall(data, call))
                },
                reason
            }
        }

        return dataExtended
    }

    public static mapAllExtensionStatus (data: EventDataMap[EventsEnum.ALL_EXTENSION_STATUS]): EventDataMapExtended[EventsEnum.ALL_EXTENSION_STATUS] {
        return {
            ...data,
            extensions: data.extensions.map((extension) => {
                return {
                    ...this.mapExtensionData(data, extension),
                    currentCall: extension.currentCall
                        ? this.mapExtensionCall(data, extension.currentCall)
                        : undefined,
                    calls: extension.calls?.map((call) => this.mapExtensionCall(data, call))
                }
            })
        }
    }
    public static mapAllVoicebotStatus (data: EventDataMap[EventsEnum.ALL_VOICEBOTS_STATUS]): EventDataMapExtended[EventsEnum.ALL_VOICEBOTS_STATUS] {
        return {
            ...data,
            voicebots: data.voicebots.map(bot => ({
                ...bot,
                Calls: bot.Calls.map(call => ({
                    ...this.mapVoicebotCall(data, call),
                    eventsData: call?.eventsData?.map(eventData =>
                        this.mapVoicebotEventsData(data, eventData)
                    ),
                })),
            })),
        }
    }

    public static mapVoicebotEvent (data: EventDataMap[EventsEnum.VOICEBOT_EVENT]): EventDataMapExtended[EventsEnum.VOICEBOT_EVENT] {
        return {
            ...data,
            data: {
                ...data.data,
                Call: {
                    ...this.mapVoicebotCall(data, data.data.Call),
                    eventsData: data.data.Call?.eventsData?.map(eventData => this.mapVoicebotEventsData(data, eventData))
                }
            }

        }
    }

    public static mapVoicebotInitialCallHistory (data: EventDataMap[EventsEnum.VOICEBOT_INITIAL_CALL_HISTORY]): EventDataMapExtended[EventsEnum.VOICEBOT_INITIAL_CALL_HISTORY] {
        return {
            ...data,
            history: data.history.map(call => {
                const callExtended =  this.mapVoicebotCall(data, call)
                return {
                    ...callExtended,
                    eventsData: callExtended.eventsData?.map(eventData => this.mapVoicebotEventsData(data, eventData))
                }
            })

        }
    }
    public static mapVoicebotCall (data: EventDataMap[EventsEnum.ALL_VOICEBOTS_STATUS] | EventDataMap[EventsEnum.VOICEBOT_EVENT] | EventDataMap[EventsEnum.VOICEBOT_INITIAL_CALL_HISTORY], call: VoicebotEventDataCall) {
        return this.configureUTCForObject(
            call,
            [
                {
                    key: 'callStarted',
                    format: 'sec'
                }

            ],
            data.servertime,
            data.servertimeoffset
        )
    }

    public static mapVoicebotEventsData (data: EventDataMap[EventsEnum.ALL_VOICEBOTS_STATUS] | EventDataMap[EventsEnum.VOICEBOT_EVENT] | EventDataMap[EventsEnum.VOICEBOT_INITIAL_CALL_HISTORY], eventData: VoicebotEventDataCallEventsData) {
        return this.configureUTCForObject(
            eventData,
            [
                {
                    key: 'Timestamp',
                    format: 'sec'
                }
            ],
            data.servertime,
            data.servertimeoffset
        )
    }

    public static mapExtensionData (data: EventDataMap[EventsEnum.ALL_EXTENSION_STATUS] | EventDataMap[EventsEnum.EXTENSION_EVENT], extension: Extension): ExtensionUTCExtended {
        return this.configureUTCForObject(
            extension,
            [
                {
                    key: 'lastAnsweredCallEventEpoch',
                    format: 'sec'
                },
                {
                    key: 'lastCallEventEpoch',
                    format: 'sec'
                },
                {
                    key: 'lastHangupCallEpoch',
                    format: 'sec'
                },
                {
                    key: 'representativeUpdated',
                    format: 'ms'
                }
            ],
            data.servertime,
            data.servertimeoffset
        )
    }

    public static mapExtensionCall (data: EventDataMap[EventsEnum.ALL_EXTENSION_STATUS] | EventDataMap[EventsEnum.EXTENSION_EVENT], call: ExtensionCall): ExtensionCallSDK {
        return this.configureUTCForObject(
            call,
            [
                {
                    key: 'callAnswered',
                    format: 'sec'
                },
                {
                    key: 'callStarted',
                    format: 'sec'
                }
            ],
            data.servertime,
            data.servertimeoffset
        )
    }

    public static mapQueueCall (data: EventDataMap[EventsEnum.QUEUE_EVENT] | EventDataMap[EventsEnum.LOGIN_STATUS], call: QueueCall): QueueCallSDK {
        return this.configureUTCForObject(
            call,
            [
                {
                    key: 'JoinTimeStamp',
                    format: 'sec'
                },
                {
                    key: 'VHJoinTimeStamp', // TODO: should add the VHJoinTimeStamp in TS definitions
                    format: 'sec'
                }
            ],
            data.servertime, // TODO: currently the TS error because in LoginStatusEvent type the key is "serverTime" but actual is "servertime", remove comment after fixed
            data.servertimeoffset // TODO: currently the TS error because in LoginStatusEvent type the key is "serverTimeOffset" but actual is "servertimeoffset", remove comment after fixed
        )
    }

    public static mapLoginStatusEvent (data: EventDataMap[EventsEnum.LOGIN_STATUS]): EventDataMapExtended[EventsEnum.LOGIN_STATUS] {
        return {
            ...data,
            queues: data.queues.map(queue => {
                return {
                    ...queue,
                    Calls: queue.Calls.map(call => this.mapQueueCall(data, call))
                }
            })
        }
    }

    public static mapQueueEvent (data: EventDataMap[EventsEnum.QUEUE_EVENT]): EventDataMapExtended[EventsEnum.QUEUE_EVENT] {
        return {
            ...data,
            data: {
                ...data.data,
                Calls: data.data.Calls.map(call => this.mapQueueCall(data, call))
            }
        }
    }

    private static assignProperty <T extends object, K extends string> (obj: T, key: K, value: number) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (obj as any)[key] = value
    }

    /**
     * Configures UTC timestamps for an object by converting server-time properties to both UTC and client-local UTC timestamps
     *
     * For each specified property, creates two new timestamp properties:
     * - property_UTC: Server timestamp converted to UTC milliseconds
     * - property_UTC_CLIENT: Server timestamp converted to client-local UTC milliseconds
     *
     * @example
     * // Input object
     * const data = {
     *   callStarted: 1634567890 // Unix timestamp in seconds
     * }
     *
     * // After configureUTCForObject:
     * {
     *   callStarted: 1634567890,
     *   callStarted_UTC: 1634567890000, // Converted to UTC ms
     *   callStarted_UTC_CLIENT: 1634571490000 // Converted to client-local UTC ms
     * }
     *
     * @param data - Source object containing server timestamp properties
     * @param properties - Array of property configs specifying which properties to convert and their format
     * @param servertime - Current server time in seconds
     * @param servertimeoffset - Server timezone offset in minutes
     * @private
     * @returns Original object extended with new _UTC and _UTC_CLIENT properties for each configured timestamp
     */
    private static configureUTCForObject<T extends object, K extends NumericKeys<T>> (
        data: T,
        properties: Array<{ key: K, format: 'sec' | 'ms' }>,
        servertime: number,
        servertimeoffset: number
    ): WithUTCProperties<T, K> {
        const serverTimeUTC: number = (servertime - servertimeoffset * 60) * 1000
        const diffServerAndClient: number = Date.now() - serverTimeUTC

        type UTCProps = {
            [P in K]: number
        } & {
            [P in K as `${P}_UTC`]: number
        } & {
            [P in K as `${P}_UTC_CLIENT`]: number
        }

        const extendedProperties: Partial<UTCProps> = {}

        properties.forEach((property) => {
            const value = data[property.key]
            const key = property.key

            if (value !== 0 && typeof value === 'number' && !isNaN(value)) {
                let valueFormatted: number = value

                if (property.format === 'ms') {
                    valueFormatted = Math.floor(valueFormatted / 1000)
                }

                const baseTime: number = (valueFormatted - servertimeoffset * 60) * 1000

                this.assignProperty(extendedProperties, `${key}_UTC`, baseTime)
                this.assignProperty(extendedProperties, `${key}_UTC_CLIENT`, baseTime + diffServerAndClient)
            } else {
                this.assignProperty(extendedProperties, `${key}_UTC`, 0)
                this.assignProperty(extendedProperties, `${key}_UTC_CLIENT`, 0)
            }
        })

        return {
            ...data,
            ...extendedProperties,
        } as WithUTCProperties<T, K>
    }
}
