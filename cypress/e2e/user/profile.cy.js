// GET - PROFILE
describe('Cielo User Profile API', () => {

    before(() => {

        cy.login();

    });

    it('should successfully fetch profile', () => {

        cy.request({

            method: 'GET',

            url: `${Cypress.env('base_url')}/user/profile`,

            headers: {

                Authorization: Cypress.env('access_Token'),

                'x-api-key': Cypress.env('xApiKey')

            }

        }).then((response) => {

            expect(response.status).to.eq(200);

        });

    });

});