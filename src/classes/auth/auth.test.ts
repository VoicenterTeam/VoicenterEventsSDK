import AuthClass from '@/classes/auth/auth.class'
import { eventsSdkDefaultOptions } from '@/classes/events-sdk/events-sdk-default-options'

describe('AuthClass', () => {
    const authClass = new AuthClass()

    it('should be cypher', () => {
        const key = authClass.login(eventsSdkDefaultOptions)
        expect(typeof key).toBe('string')
    })
})
