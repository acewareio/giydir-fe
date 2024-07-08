/// <reference types="cypress" />

import { customAlphabet } from "nanoid";
const nanoid = customAlphabet("0123456789qwertyuiopasdfghjklzxcvbnm", 10);

describe("Forgot Password", () => {
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

    cy.visit("/sign-in");
  });
  context("page with form", () => {
    it("should display forgot password link and navigate to the reset password page", () => {
      cy.getBySel("forgot-password").should("be.visible").click();
      cy.location("pathname").should("include", "/forgot-password");
    });

    it("should show validation messages for invalid inputs", () => {
      cy.visit("/forgot-password");

      // Test submitting without entering an email
      cy.getBySel("send-email").click();
      cy.getBySel("email-error").should("be.visible");

      // Test submitting with an invalid email
      cy.getBySel("email").type("invalidemail");
      cy.getBySel("send-email").click();
      cy.getBySel("email-error").should("be.visible");

      cy.getBySel("email").type(email);
      cy.getBySel("email-error").should("not.exist");
    });

    it("should handle errors for an invalid email", () => {
      cy.intercept("POST", "/api/v1/auth/forgot/password").as("emailSend");

      cy.getBySel("forgot-password").click();
      cy.location("pathname").should("include", "/forgot-password");
      cy.getBySel("email").type("nonexistentemail@mail.com");
      cy.getBySel("send-email").click();

      cy.wait("@emailSend").then((request) => {
        expect(request.response?.statusCode).to.equal(422);
        cy.getBySel("email-error").should("be.visible");
      });
    });
  });
});
