import EventsSdkClass from './events-sdk.class'
import { eventsSdkDefaultOptions } from './events-sdk-default-options'

describe('EventsSdkClass', () => {
    it('should be true', () => {
        const eventsSdkClass = new EventsSdkClass(eventsSdkDefaultOptions)
        expect(eventsSdkClass.init()).toBe(true)
    })
})