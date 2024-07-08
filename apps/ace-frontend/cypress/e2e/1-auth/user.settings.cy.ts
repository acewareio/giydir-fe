/// <reference types="cypress" />

import { customAlphabet } from "nanoid";
const nanoid = customAlphabet("0123456789qwertyuiopasdfghjklzxcvbnm", 10);

describe("User password-change", () => {
  let email: string;
  let password: string;
  let firstName: string;
  let lastName: string;

  beforeEach(() => {
    email = `test${nanoid()}@example.com`;
    password = nanoid();
    firstName = `FirstName${nanoid()}`;
    lastName = `LastName${nanoid()}`;

    cy.createNewUser({
      email,
      password,
      firstName,
      lastName,
    });

    cy.login({ email, password });
  });

  it("should be successful show leave page modal on unsaved changes", () => {
    cy.visit("/profile/password-change");

    cy.getBySel("old-password").type(`{selectAll}James`);
    cy.getBySel("cancel-edit-profile").click();

    cy.getBySel("stay").click();
  });

  it("should be successful change user password", () => {
    const newPassword = "passw1";
    cy.intercept("PATCH", "api/v1/auth/me").as("profileUpdate");
    cy.intercept("POST", "api/v1/auth/logout").as("logout");
    cy.intercept("POST", "/api/v1/auth/email/login").as("login");

    cy.visit("/profile/password-change");
    cy.getBySel("old-password").type(password);
    cy.getBySel("new-password").type(newPassword);
    cy.getBySel("password-confirmation").type(newPassword);
    cy.getBySel("save-password").click();
    cy.wait("@profileUpdate").then((request) => {
      expect(request.response?.statusCode).to.equal(200);
    });

    cy.getBySel("PersonIcon").click();
    cy.getBySel("logout-menu-item").click();
    cy.wait("@logout").then((request) => {
      expect(request.response?.statusCode).to.equal(204);
    });

    cy.getBySel("email").type(email);
    cy.getBySel("password").type(password);
    cy.getBySel("sign-in-submit").click();
    cy.wait("@login");
    cy.getBySel("password-error").should("be.visible");

    cy.getBySel("password").type(`{selectAll}${newPassword}`);
    cy.getBySel("sign-in-submit").click();
    cy.wait("@login");
    cy.location("pathname").should("not.include", "/sign-in");
  });
});
