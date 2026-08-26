//PUT - PASSWORD
describe('Setting New Password',()=>{

    before(()=>{
        //fetching access token
        cy.login();
        
    });

    it('Should successfully set New Password',()=>{

        cy.request({

            method: 'PUT',
            url: `${Cypress.env('base_url')}/user/password`,
            headers: {
                    Authorization: Cypress.env('access_Token'),
                    'x-api-key': Cypress.env('xApiKey')
            },
            body: {
                    "mobileDeviceId": "8f5d0fc27a906dd5",
                    "deviceTokenId": "d4bFjFzrtcY:APA91bE-DGKNkCox3DFTjmM1-O5iGwm8D0a-GOXf3O52KMGxuw3whvl_sL5xS4pgEqA8wL6cSMsCBSJxP8ZWgyMJ0CTxy_Gok4Mn3zW5fNa0IdF_pSi_W94WLtiC_YWONPCCYinyyiTv",
                    "deviceType" : "ISO",
                    "appVersion" : "3.5",
                    "appType" : "postman",
                    "ipAddress" : "232323",
                    "password": Cypress.env('password'),
                    "userId" : Cypress.env('email'),
                    "newPassword" : "12345678",
                }
        })

            .then((response)=>{
                expect(response.status).to.eq(200)
            })
    })
})