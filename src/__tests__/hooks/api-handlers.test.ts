import { describe, it, expect } from "vitest";

const BASE_HEADERS = {
  "Content-Type": "application/json",
  Authorization: "Bearer mock_token_usr_001_123456",
};

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

describe("Transactions API handler", () => {
  it("returns paginated transactions for authenticated user", async () => {
    const res = await fetch("/api/transactions?page=1&limit=10", {
      headers: BASE_HEADERS,
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toHaveProperty("data");
    expect(body).toHaveProperty("total");
    expect(body).toHaveProperty("page", 1);
    expect(Array.isArray(body.data)).toBe(true);
  });

  it("rejects unauthenticated requests", async () => {
    const res = await fetch("/api/transactions", {
      headers: { "Content-Type": "application/json" },
    });
    expect(res.status).toBe(401);
  });

  it("filters by transaction type", async () => {
    const res = await fetch("/api/transactions?type=deposit&page=1&limit=10", {
      headers: BASE_HEADERS,
    });
    const body = await res.json();
    expect(body.data.every((t: { type: string }) => t.type === "deposit")).toBe(true);
  });

  it("returns single transaction by id", async () => {
    const res = await fetch("/api/transactions/txn_001", {
      headers: BASE_HEADERS,
    });
    expect(res.status).toBe(200);
    const txn = await res.json();
    expect(txn.id).toBe("txn_001");
  });

  it("returns 404 for unknown transaction", async () => {
    const res = await fetch("/api/transactions/txn_nonexistent", {
      headers: BASE_HEADERS,
    });
    expect(res.status).toBe(404);
  });
});

describe("Accounts API handler", () => {
  it("returns accounts for authenticated user", async () => {
    const res = await fetch("/api/accounts", { headers: BASE_HEADERS });
    expect(res.status).toBe(200);
    const accounts = await res.json();
    expect(Array.isArray(accounts)).toBe(true);
    expect(accounts.every((a: { userId: string }) => a.userId === "usr_001")).toBe(true);
  });

  it("returns single account by id", async () => {
    const res = await fetch("/api/accounts/acc_001", { headers: BASE_HEADERS });
    expect(res.status).toBe(200);
    const account = await res.json();
    expect(account.id).toBe("acc_001");
  });

  it("returns 404 for account belonging to another user", async () => {
    const res = await fetch("/api/accounts/acc_004", { headers: BASE_HEADERS });
    expect(res.status).toBe(404);
  });
});
