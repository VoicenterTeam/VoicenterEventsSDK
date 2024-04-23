import { EventsEnum, Extension, ExtensionEventReasonEnum } from '@voicenter-team/real-time-events-types'
import { EventDataMap, EventDataMapExtended } from '@/types/events'
import { CurrentCallUTCExtended, ExtensionCallSDK, ExtensionEventExtended, ExtensionUTCExtended } from '@/types/sdk-extension-extended'
import type { ExtensionCall } from '@voicenter-team/real-time-events-types/dist/models/ExtensionCall'

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

export default class EventsHandler{
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
                            duration: Date.now() - (currentCallExtended?.callAnswered_UTC_CLIENT ?? 0)
                        }
                        : undefined,
                    calls: data.data.calls?.map((call) => {
                        const callExtended = this.mapExtensionCall(data, call)

                        return {
                            ...callExtended,
                            duration: Date.now() - (callExtended.callAnswered_UTC_CLIENT ?? 0)
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

    public static mapQueueEvent (data: EventDataMap[EventsEnum.QUEUE_EVENT]): EventDataMapExtended[EventsEnum.QUEUE_EVENT] {
        return {
            ...data,
            data: {
                ...data.data,
                Calls: data.data.Calls?.map(call => {
                    return this.configureUTCForObject(
                        call,
                        [
                            {
                                key: 'JoinTimeStamp',
                                format: 'sec'
                            }
                        ],
                        data.servertime,
                        data.servertimeoffset
                    )
                })
            }
        }
    }

    private static assignProperty <T extends object, K extends string> (obj: T, key: K, value: number) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (obj as any)[key] = value
    }

    /**
     * Configures UTC for the object
     *
     * @param data - object to configure UTC for
     * @param properties - properties of the object to configure UTC for
     * @param servertime - server time in seconds
     * @param servertimeoffset - server time offset in minutes
     * @private
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
