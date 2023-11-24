import AuthClass from '@/classes/auth/auth.class'
import { eventsSdkDefaultOptions } from '@/classes/events-sdk/events-sdk-default-options'

describe('AuthClass', () => {
    it('should be cypher', () => {
        const key = AuthClass.login(eventsSdkDefaultOptions)
        expect(typeof key).toBe('string')
    })
})