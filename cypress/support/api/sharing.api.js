class SharingApi{
    
    getSharedDevices(){
        return cy.request({
            method: 'GET',
            url: `${Cypress.env('base_url')}/shareddevices/1`,
            headers: {
            'x-api-key': Cypress.env('xApiKey'),
            'Authorization': Cypress.env('accessToken'),
            },
        })

    }

    generateShareLink(payload){
        return cy.request({
            method: 'POST',
            url:`${Cypress.env('base_url')}/shareddevices/2`,
            headers: {
            'x-api-key': Cypress.env('xApiKey'),
            'Authorization': Cypress.env('accessToken'),
            },
            body: payload
        })

    }

    acceptInvitation(payload){

            return cy.request({
            method: 'POST',
            url:`${Cypress.env('base_url')}/shareddevices/sharing-invitation-response/1`,
            headers: {
            'x-api-key': Cypress.env('xApiKey'),
            'Authorization': Cypress.env('accessToken'),
            },
            body: payload
        })

    }

    updateSharedDevices(payload){
            return cy.request({
            method: 'PUT',
            url:`${Cypress.env('base_url')}/shareddevices/2`,
            headers: {
            'x-api-key': Cypress.env('xApiKey'),
            'Authorization': Cypress.env('accessToken'),
            },
            body: payload
        })
    }

    childRevoke(payload){
            return cy.request({
            method: 'PUT',
            url:`${Cypress.env('base_url')}/shareddevices/child-revoke/2`,
            headers: {
            'x-api-key': Cypress.env('xApiKey'),
            'Authorization': Cypress.env('accessToken'),
            },
            body: payload
        })
    }

    removeAllAccess(payload){
            return cy.request({
            method: 'DELETE',
            url:`${Cypress.env('base_url')}/shareddevices/1`,
            headers: {
            'x-api-key': Cypress.env('xApiKey'),
            'Authorization': Cypress.env('accessToken'),
            },
            body: payload
        })
    }
}

export default new SharingApi();
