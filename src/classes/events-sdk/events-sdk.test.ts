import EventsSdkClass from '@/classes/events-sdk/events-sdk.class'
import { eventsSdkDefaultOptions } from '@/classes/events-sdk/events-sdk-default-options'

describe('EventsSdkClass', () => {
    it('should be true', () => {
        const eventsSdkClass = new EventsSdkClass(eventsSdkDefaultOptions)
        expect(eventsSdkClass.init()).toBe(true)
    })
})