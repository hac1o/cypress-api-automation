// auth.api.js
class AuthApi {
    login(role="parent") {
        // Fetch credentials based on role from env file
        const email = Cypress.env(role === 'parent' ? 'email' : 'childEmail');
        const password = Cypress.env(role === 'parent' ? 'password' : 'childPassword');
        
        return cy.fixture('auth/login').then((payload) => {
            payload.user.userId = email;
            payload.user.password = password;
            
            return cy.request({
                method: 'POST',
                url: `${Cypress.env('base_url')}/user/login`,
                headers: {
                    'x-api-key': Cypress.env('xApiKey'),
                    'Content-Type': 'application/json'
                },
                body: payload
            });
        });
    }
}
export default new AuthApi();