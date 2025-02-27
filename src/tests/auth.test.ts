import request from "supertest";
import express from "express";
import app from "../index";

describe("Auth API Endpoints", () => {
  // Grouping tests for Authentication
  describe("/api/auth/register", () => {
    // Grouping tests for the /register endpoint
    it("should register a new user successfully", async () => {
      // Test case: successful registration
      // Arrange (Setup test data, if needed)
      const registrationData = {
        username: "testuser1",
        email: "test@example.com",
        password: "password123",
      };
      // Act (Make the API request)
      const response = await request(app)
        .post("/api/auth/register")
        .send(registrationData);
      // Assert (Check the response)
      expect(response.status).toBe(201);
      expect(response.headers["content-type"]).toContain("application/json");
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe("Registration successful!");
      expect(response.body).toHaveProperty("userId");
    });

    it("should return an error if the email is not valid", async () => {
      // Test case: invalid email
      // Arrange
      const registrationData = {
        username: "testuser",
        email: "invalid-email",
        password: "password123",
      };
      const response = await request(app)
        .post("/api/auth/register")
        .send(registrationData);

      expect(response.status).toBe(400);
      expect(response.headers["content-type"]).toContain("application/json");
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Registration failed.");
      expect(response.body).toHaveProperty("error");
      expect(response.body.error).toBe("Invalid email format.");
    });

    it("should return an error if the username is missing", async () => {
      // Test case: missing username
      // Arrange
      const registrationData = {
        username: "",
        email: "test@example.com",
        password: "password123",
      };

      const response = await request(app)
        .post("/api/auth/register")
        .send(registrationData);

      expect(response.status).toBe(400);
      expect(response.headers["content-type"]).toContain("application/json");
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Registration failed.");
      expect(response.body).toHaveProperty("error");
      expect(response.body.error).toBe("Username is required.");
    });
    it("should return an error if the username is shorter than 3 characters", async () => {
      // Test case: short username
      // Arrange
      const registrationData = {
        username: "ab",
        email: "test@example.com",
        password: "password123",
      };

      const response = await request(app)
        .post("/api/auth/register")
        .send(registrationData);

      expect(response.status).toBe(400);
      expect(response.headers["content-type"]).toContain("application/json");
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Registration failed.");
      expect(response.body).toHaveProperty("error");
      expect(response.body.error).toBe(
        "Username must be at least 3 characters long."
      );
    });

    it("should return an error if the password is missing", async () => {
      // Test case: missing password
      // Arrange
      const registrationData = {
        username: "testuser",
        email: "test@example.com",
        password: "",
      };
      const response = await request(app)
        .post("/api/auth/register")
        .send(registrationData);
      expect(response.status).toBe(400);
      expect(response.headers["content-type"]).toContain("application/json");
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Registration failed.");
      expect(response.body).toHaveProperty("error");
      expect(response.body.error).toBe(
        "Password is required."
      );
    });

    it("should return an error if the password is shorter than 6 characters", async () => {
      // Test case: short password
      // Arrange
      const registrationData = {
        username: "testuser",
        email: "test@example.com",
        password: "pass5",
      };
      const response = await request(app)
        .post("/api/auth/register")
        .send(registrationData);

      expect(response.status).toBe(400);
      expect(response.headers["content-type"]).toContain("application/json");
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Registration failed.");
      expect(response.body).toHaveProperty("error");
      expect(response.body.error).toBe(
        "Password must be at least 6 characters long."
      );
    });
    it("should return an error if the username already exists", async () => {
      const registrationData = {
        username: "testuser",
        email: "test@example.com",
        password: "password123",
      };

      const response = await request(app)
        .post("/api/auth/register")
        .send(registrationData);

      expect(response.status).toBe(409);
      expect(response.headers["content-type"]).toContain("application/json");
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Registration failed.");
      expect(response.body).toHaveProperty("error");
      expect(response.body.error).toBe("Username already taken.");
    });
  });
});
