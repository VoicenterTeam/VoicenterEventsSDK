import { EventsEnum, ExtensionEventReasonEnum } from '@voicenter-team/real-time-events-types'
import { EventDataMap, EventDataMapExtended } from '@/types/events'
import { CurrentCallUTCExtended, ExtensionEventExtended } from '@/types/extended'

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
            currentCallExtended = this.configureUTCForObject(
                data.data.currentCall,
                [ 'callAnswered', 'callStarted' ],
                data.servertime,
                data.servertimeoffset
            )
        }

        if (reason === ExtensionEventReasonEnum.HANGUP) {
            dataExtended = {
                ...data,
                reason,
                data: {
                    ...data.data,
                    currentCall: currentCallExtended ?
                        {
                            ...currentCallExtended,
                            duration: Date.now() - (currentCallExtended?.callAnswered_UTC_CLIENT ?? 0)
                        }
                        : undefined
                }
            }
        } else {
            dataExtended = {
                ...data,
                data: {
                    ...data.data,
                    currentCall: currentCallExtended
                },
                reason
            }
        }

        return dataExtended
    }

    private static assignProperty <T extends object, K extends string> (obj: T, key: K, value: number) {
        (obj as any)[key] = value
    }

    private static configureUTCForObject<T extends object, K extends NumericKeys<T>> (
        data: T,
        properties: Array<K>,
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
            const value: number = data[property] as unknown as number

            console.log('####################')
            console.log('property', property)
            console.log('value', value)
            console.log('####################')

            if (value === 0) {
                this.assignProperty(extendedProperties, `${property}_UTC`, 0)
                this.assignProperty(extendedProperties, `${property}_UTC_CLIENT`, 0)
            } else {
                const baseTime: number = (value - servertimeoffset * 60) * 1000

                this.assignProperty(extendedProperties, `${property}_UTC`, baseTime)
                this.assignProperty(extendedProperties, `${property}_UTC_CLIENT`, baseTime + diffServerAndClient)
            }
        })

        return {
            ...data,
            ...extendedProperties,
        } as WithUTCProperties<T, K>
    }
}
