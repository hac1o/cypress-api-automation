//PUT - LOCALE
describe('Setting Locale',()=>{

    before(()=>{
        //fetching access token
        cy.login();
        
    });

    it('Should successfully set Locale',()=>{

        cy.request({

            method: 'PUT',
            url: `${Cypress.env('base_url')}/user/locale`,
            headers: {
                    Authorization: Cypress.env('access_Token'),
                    'x-api-key': Cypress.env('xApiKey')
            },
            body: {
                    "userID": Cypress.env('email'),
                    "accessToken": Cypress.env('access_Token'),
                    "expiresIn": Cypress.env('expiresIn'),
                    "sessionId": "zlws0hhbda3tk2bnuq35cos4",
                    "refreshToken": null,
                    "locale": "en"
                }
        })

            .then((response)=>{
                expect(response.status).to.eq(200)
            })
    })
})