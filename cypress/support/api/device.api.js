class DeviceApi{
    
    getDevices(){
            return cy.request({
            method: 'GET',
            url: `${Cypress.env('base_url')}/device/group?group_id=-1`,
            headers: {
            'x-api-key': Cypress.env('xApiKey'),
            'Authorization': Cypress.env('accessToken'),
            },
            //failOnStatusCode: false
        });
    }



    getDevicesbyMAC(macAddress){
        return cy.request({
            method: 'GET',
            qs:{
                macAddress
            },
            url: `${Cypress.env('base_url')}/device/mac`,
            headers: {
            'x-api-key': Cypress.env('xApiKey'),
            'Authorization': Cypress.env('accessToken'),
            },
            //failOnStatusCode: false
        })
    }


        getTimelinebyDeviceId(deviceId){
        return cy.request({
            method: 'GET',
            qs:{
                'direction':0,
                'limit':100,
                'exclusiveStartKey':0,
                deviceId
            },
            url: `${Cypress.env('base_url')}/device/timeline/10`,
            headers: {
            'x-api-key': Cypress.env('xApiKey'),
            'Authorization': Cypress.env('accessToken'),
            },
            //failOnStatusCode: false
        })
    }
}

export default new DeviceApi();
