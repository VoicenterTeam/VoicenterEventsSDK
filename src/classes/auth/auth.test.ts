import AuthClass from '@/classes/auth/auth.class'

describe('AuthClass', () => {
    it('should be cypher', () => {
        const key = AuthClass.login()
        expect(typeof key).toBe('string')
    })
})