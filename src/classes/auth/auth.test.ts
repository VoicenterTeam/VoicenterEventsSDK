import AuthClass from '@/classes/auth/auth.class'
import { eventsSdkDefaultOptions } from '@/classes/events-sdk/events-sdk-default-options'
import EventsSdkClass from '@/classes/events-sdk/events-sdk.class'

describe('AuthClass', () => {
    const sdk = new EventsSdkClass(eventsSdkDefaultOptions)

    const authClass = new AuthClass(sdk)

    it('should be cypher', () => {
        const key = authClass.login(eventsSdkDefaultOptions)
        expect(typeof key).toBe('string')
    })
})
