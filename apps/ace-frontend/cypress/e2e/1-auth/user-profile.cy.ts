/// <reference types="cypress" />

import { customAlphabet } from "nanoid";
const nanoid = customAlphabet("0123456789qwertyuiopasdfghjklzxcvbnm", 10);

describe("User Profile", () => {
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

  it("should be successful open page and check data is displayed", () => {
    cy.getBySel("PersonIcon").click();
    cy.getBySel("user-profile").click();
    cy.location("pathname").should("include", "/profile");

    cy.getBySel("user-name").should("contain.text", firstName + " " + lastName);
    cy.getBySel("user-email").should("contain.text", email);
    cy.getBySel("edit-profile").click();
    cy.location("pathname").should("include", "/profile/edit");
    cy.getBySel("first-name").should("contain.value", firstName);
    cy.getBySel("last-name").should("contain.value", lastName);
  });

  it("should be successful update user data", () => {
    cy.intercept("PATCH", "api/v1/auth/me").as("profileUpdate");
    cy.visit("/profile/edit");
    cy.getBySel("first-name").type(`{selectAll}James`);
    cy.getBySel("first-name").should("contain.value", "James");
    cy.getBySel("last-name").type(`{selectAll}Bond`);
    cy.wait(100);
    cy.getBySel("last-name").should("contain.value", "Bond");
    cy.getBySel("save-profile").click();

    cy.wait("@profileUpdate").then((request) => {
      expect(request.response?.statusCode).to.equal(200);
    });

    cy.visit("/");
    cy.getBySel("PersonIcon").click();
    cy.getBySel("user-profile").click();
    cy.location("pathname").should("include", "/profile");
    cy.getBySel("user-name").should("contain.text", "James Bond");
    cy.getBySel("user-email").should("contain.text", email);
    cy.getBySel("edit-profile").click();
    cy.location("pathname").should("include", "/profile/edit");

    cy.getBySel("first-name").should("contain.value", "James");

    cy.getBySel("last-name").should("contain.value", "Bond");
  });

  it("should be successful upload avatar", () => {
    cy.fixture("profileImage.jpg", null).as("userImage");
    cy.intercept("PATCH", "api/v1/auth/me").as("profileUpdate");
    cy.intercept("POST", "api/v1/files/upload").as("uploadFile");
    cy.visit("/profile/edit");
    cy.get("input[type=file]").selectFile("@userImage", {
      force: true,
      action: "drag-drop",
    });
    cy.getBySel("save-profile").click();

    cy.wait("@uploadFile").then((request) => {
      expect(request.response?.statusCode).to.equal(201);
      cy.get("img").should("be.visible").and("have.attr", "src");
    });
  });
});
