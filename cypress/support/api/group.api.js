class GroupApi {
    
    createGroup(payload) {
        return cy.request({
            method: "POST",
            url: `${Cypress.env("base_url")}/group`,
            headers: {
                "x-api-key": Cypress.env("xApiKey"),
                Authorization: Cypress.env("accessToken"),
            },
            body: payload,
        });
    }

    editGroup(payload) {
        return cy.request({
            method: "PUT",
            url: `${Cypress.env("base_url")}/group`,
            headers: {
                "x-api-key": Cypress.env("xApiKey"),
                Authorization: Cypress.env("accessToken"),
            },
            body: payload,
        });
    }

    deleteGroup(payload) {
        return cy.request({
            method: "DELETE",
            url: `${Cypress.env("base_url")}/group`,
            headers: {
                "x-api-key": Cypress.env("xApiKey"),
                Authorization: Cypress.env("accessToken"),
            },
            body: payload,
        });
    }

    addDeviceToGroup(payload) {
        return cy.request({
            method: "POST",
            url: `${Cypress.env("base_url")}/group/device/1`,
            headers: {
                "x-api-key": Cypress.env("xApiKey"),
                Authorization: Cypress.env("accessToken"),
            },
            body: payload,
        });
    }

    removeDeviceFromGroup(payload) {
        return cy.request({
            method: "DELETE",
            url: `${Cypress.env("base_url")}/group/device/1`,
            headers: {
                "x-api-key": Cypress.env("xApiKey"),
                Authorization: Cypress.env("accessToken"),
            },
            body: payload,
        });
    }
}

export default new GroupApi();
