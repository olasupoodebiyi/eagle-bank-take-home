import { describe, it, expect } from "vitest";

describe("Auth API handler", () => {
  it("logs in with valid credentials", async () => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "alex.morgan@example.com", password: "password123" }),
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toHaveProperty("token");
    expect(body).toHaveProperty("user");
    expect(body.user.email).toBe("alex.morgan@example.com");
  });

  it("rejects invalid credentials", async () => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "bad@bad.com", password: "wrongpass" }),
    });
    expect(res.status).toBe(401);
  });

  it("registers a new user", async () => {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName: "Test User",
        email: `testuser_${Date.now()}@example.com`,
        password: "Password1",
        phone: "+44 7700 999999",
      }),
    });
    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body).toHaveProperty("token");
    expect(body.user.fullName).toBe("Test User");
  });

  it("rejects duplicate email registration", async () => {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName: "Duplicate",
        email: "alex.morgan@example.com",
        password: "Password1",
        phone: "+44 7700 000000",
      }),
    });
    expect(res.status).toBe(409);
  });
});
