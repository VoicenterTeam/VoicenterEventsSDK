import userData from '../fixtures/example.json';

const response = {
    Status: 200
}

const token = userData.accessToken;
const url = `/?token=${token}`

describe('Initial test', () => {
    it('Base test', () => {
        cy.server()
        cy.visit(url);
        cy.url().should('contain', url);
        expect(response).to.include({
            Status: 200
        })
    })
})
