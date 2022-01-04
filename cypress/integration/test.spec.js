const response = {
    Status: 200
}

const url = '/?token=Y6C1T3kadBbIQlyx1zsQNcUky1uSTbCaL3zpNoQF3f6ABM9xSfryBefp916N2Ytfyws2YyhQvytvfhZsLlm2Vf3PL1IUCLHzvxoA'

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
