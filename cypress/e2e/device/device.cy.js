// FLOW 
// GET device --> GET device by MAC --> GET timeline of that device.


import DeviceApi from "../../support/api/device.api";

describe('Get devices', () => {
    before(() => {
        cy.login('parent');
    });

    // '() =>' to 'function()' so we can use 'this.skip()'
    it('Should Get All devices', function() {
        DeviceApi.getDevices()
            .then((response) => {
                expect(response.status).to.eq(200);
                expect(response.body.data).to.have.property('devicesCount');
                
                const devicesCount = response.body.data.devicesCount;
                cy.log(`Devices Count: ${devicesCount}`);

                // we use 'this.skip()' to tell Cypress this test is intentionally skipped!
                if (devicesCount === 0) {
                    cy.log('No devices exist in the account. Skipping MAC address check.');
                    //this.skip(); 
                    return; 
                }
                else {

                const firstDevice = response.body.data.listDevices[1];
                expect(firstDevice).to.have.property('macAddress');
                cy.log(`First Device MAC: ${firstDevice.macAddress}`);

                const macAddress = firstDevice.macAddress;
                Cypress.env('testMacAddress', macAddress);
                }
                
                // We return the next API call so we can chain a .then() below!
                //return DeviceApi.getDevicesbyMAC(macAddress);
            })
            .then((response) => {
                // If the test wasn't skipped, this block runs!
                if (response) {
                    expect(response.status).to.eq(200);
                    cy.log('Successfully verified device by MAC in the same test!');
                }
            });
    });
});


describe('Get device by MAC', () => {
    
    it('Should Get Device data by MAC', ()=> {
        const macAddress = Cypress.env('testMacAddress');

        // passing MAC ADDRESS
        DeviceApi.getDevicesbyMAC(macAddress) 
            .then((response) => {
                expect(response.status).to.eq(200);
                const deviceId = response.body.data.deviceState.deviceId;
                cy.log(`device id: ${deviceId}`);

                Cypress.env('testDeviceId', response.body.data.deviceState.deviceId);
                
                //return DeviceApi.getTimelinebyDeviceId(deviceId);
            });
    });
});

describe('Get Timeline',()=>{
    it ('Get Timeline of the device',()=> {
        const deviceId = Cypress.env('testDeviceId');

            DeviceApi.getTimelinebyDeviceId(deviceId) 
            .then((response) => {
                expect(response.status).to.eq(200);
                cy.log(`Validated status 200 for device id: ${deviceId}`);
            });
    })
})


/*
describe('Device APIs', () => {
    before(() => {
        // 1. Handle Login
        const expiry = Cypress.env('expiresIn');
        const now = Math.floor(Date.now() / 1000);
        if (!expiry || expiry < now) {
            cy.login();
        }
        
    });

    it('should do something with the devices', () => {

            cy.request({
        method: 'GET',
        url: `${Cypress.env('base_url')}/device/group?group_id=-1`,
        headers: {
            Authorization: Cypress.env('access_Token'),
            'x-api-key': Cypress.env('xApiKey')
        }
    }).then((response) => {
            expect(response.status).to.eq(200);
            
            const devicesCount = response.body.data.devicesCount;
            if (devicesCount === 0) {
                cy.log('No device exists for this user');
                Cypress.env('macAddresses', []); // Save an empty array to prevent errors later
                return; 
            }

            const devices = response.body.data.listDevices;
            const macAddresses = devices.map(device => device.macAddress);
            
            // Save to Cypress environment
            Cypress.env('macAddresses', macAddresses); 
            cy.log('Extracted and saved MACs:', JSON.stringify(macAddresses));
        });
    });
});
*/