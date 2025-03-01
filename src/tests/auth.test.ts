import request from "supertest";
import express from "express";
import app from "../index";
import { supabase } from "../utils/supabaseClient";
const cleanUpTestUsers = async () => {
  await supabase.from("users").delete().ilike("username", "testuser%");
};
describe("Auth API Endpoints", () => {
  // Grouping tests for Authentication
  describe("/api/auth/register", () => {
    beforeEach(async () => {
      await cleanUpTestUsers();
    });
    afterAll(async () => {
      await cleanUpTestUsers();
    });
    // Grouping tests for the /register endpoint
    it("should register a new user successfully", async () => {
      // Test case: successful registration
      // Arrange (Setup test data, if needed)
      const registrationData = {
        username: "testuser2",
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
      expect(typeof response.body.userId).toBe("string");
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
      expect(response.body.error).toBe("Password is required.");
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
        username: "existingUser",
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
    describe("Password Hashing Verification", () => {
      it("should not store plain text password in the database", async () => {
        const registrationData = {
          username: "testuser3",
          email: "tester@example.com",
          password: "password123",
        };

        const response = await request(app)
          .post("/api/auth/register")
          .send(registrationData);

        expect(response.status).toBe(201);

        const { data: user, error: supabaseError } = await supabase
          .from("users")
          .select("password_hash")
          .eq("username", registrationData.username);

        expect(supabaseError).toBeNull();
        expect(user).toBeDefined();
        expect(user).not.toBeNull();
        expect(user).toHaveLength(1);

        const storedPasswordHash = user![0].password_hash;
        expect(storedPasswordHash).toBeDefined();
        expect(storedPasswordHash).not.toBeNull();
        expect(typeof storedPasswordHash).toBe("string");

        expect(storedPasswordHash).not.toBe(registrationData.password);
      });
      it("should hash the password before storing it in the database", async () => {
        const registrationData = {
          username: "testuser4",
          email: "tester@example.com",
          password: "password123",
        };

        const response = await request(app)
          .post("/api/auth/register")
          .send(registrationData);

        expect(response.status).toBe(201);

        const { data: user, error: supabaseError } = await supabase
          .from("users")
          .select("password_hash")
          .eq("username", registrationData.username);

        expect(supabaseError).toBeNull();
        expect(user).toBeDefined();
        expect(user).not.toBeNull();
        expect(user).toHaveLength(1);

        expect(user![0].password_hash).toBeDefined();
        expect(user![0].password_hash).not.toBeNull();
        expect(typeof user![0].password_hash).toBe("string");
        expect(user![0].password_hash).not.toBe(registrationData.password);

        expect(user![0].password_hash.length).toBeGreaterThan(50)
      });
    });
  });
});
