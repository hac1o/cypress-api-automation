class TokenManager {

    setToken(token) {
        Cypress.env('accessToken', token);
    }

    getToken() {
        return Cypress.env('accessToken');
    }
}

export default new TokenManager();