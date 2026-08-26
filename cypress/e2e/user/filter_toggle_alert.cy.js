//PUT - LOCALE
describe('Setting filter toggle alert',()=>{

    before(()=>{
        //fetching access token
        cy.login();
        
    });

    it('Should successfully set filter toggle alert',()=>{

        cy.request({

            method: 'PUT',
            url: `${Cypress.env('base_url')}/user/filter/toggle/1`,
            headers: {
                    Authorization: Cypress.env('access_Token'),
                    'x-api-key': Cypress.env('xApiKey')
            },
            body: {
                    "isFilterAlertEnabled": 1,
                    "isFilterEmailEnabled": 1,
                    "mobileDeviceId": "758def2bb31d4f88",
                    "userId": Cypress.env('email')
                }
        })

            .then((response)=>{
                expect(response.status).to.eq(200)
            })
    })
})