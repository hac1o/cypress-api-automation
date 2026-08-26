import * as allure from "allure-js-commons";
describe("Login API", () => {

    before(() => {
        cy.login("parent");
    });

    it("Should Login Successfully", () => {

        allure.epic("Authentication");
        allure.feature("Login");
        allure.story("Parent Login");
        allure.owner("QA +TEAM");
        allure.severity("critical");

        expect(Cypress.env("accessToken")).to.exist;

    });

});


/*
describe('Login Api',()=>{
  before(()=>{
    cy.login('parent')
  });
  it('Should Login Successfully',()=>{
    expect(Cypress.env('accessToken')).to.not.be.undefined;
    });
});

*/
