// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })


import AuthApi from './api/auth.api';

Cypress.Commands.add('login', (role) => {

    return AuthApi.login(role)
        .then((response) => {
            expect(response.status).to.eq(200);
            const now = Math.floor(Date.now() / 1000);

            const token = response.body.data.user.accessToken;
            
            //Save the specific role token
            if (role === 'parent') {
                Cypress.env('parentToken', token);
            } else {
                Cypress.env('childToken', token);
            }
            
            //OVERWRITE the active token
            Cypress.env('accessToken', token); 
            
            //Save expiration
            const expiresIn = response.body.data.user.expiresIn;
            Cypress.env('expiresIn', now + expiresIn);

            return response;
        });
});

