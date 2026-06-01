import { describe, it, expect } from "vitest";
import { loginSchema, registerSchema, profileSchema } from "@/lib/validations";

describe("loginSchema", () => {
  it("accepts valid credentials", () => {
    const result = loginSchema.safeParse({
      email: "user@example.com",
      password: "password123",
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid email", () => {
    const result = loginSchema.safeParse({
      email: "not-an-email",
      password: "password123",
    });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].path).toContain("email");
  });

  it("rejects short password", () => {
    const result = loginSchema.safeParse({
      email: "user@example.com",
      password: "short",
    });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].path).toContain("password");
  });

  it("rejects empty email", () => {
    const result = loginSchema.safeParse({ email: "", password: "password123" });
    expect(result.success).toBe(false);
  });
});

describe("registerSchema", () => {
  const validData = {
    fullName: "Alex Morgan",
    email: "alex@example.com",
    password: "Password1",
    confirmPassword: "Password1",
    phone: "+44 7700 900123",
  };

  it("accepts valid registration data", () => {
    const result = registerSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("rejects mismatched passwords", () => {
    const result = registerSchema.safeParse({
      ...validData,
      confirmPassword: "different",
    });
    expect(result.success).toBe(false);
    const hasConfirmError = result.error?.issues.some(
      (i) => i.path.includes("confirmPassword")
    );
    expect(hasConfirmError).toBe(true);
  });

  it("requires uppercase in password", () => {
    const result = registerSchema.safeParse({
      ...validData,
      password: "lowercase1",
      confirmPassword: "lowercase1",
    });
    expect(result.success).toBe(false);
  });

  it("requires number in password", () => {
    const result = registerSchema.safeParse({
      ...validData,
      password: "NoNumbers!",
      confirmPassword: "NoNumbers!",
    });
    expect(result.success).toBe(false);
  });

  it("rejects name shorter than 2 chars", () => {
    const result = registerSchema.safeParse({ ...validData, fullName: "A" });
    expect(result.success).toBe(false);
  });
});

describe("profileSchema", () => {
  it("accepts valid profile data", () => {
    const result = profileSchema.safeParse({
      fullName: "Alex Morgan",
      email: "alex@example.com",
      phone: "+44 7700 900123",
      address: "12 Financial Street, London",
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid email in profile", () => {
    const result = profileSchema.safeParse({
      fullName: "Alex Morgan",
      email: "bad-email",
      phone: "+44 7700 900123",
      address: "",
    });
    expect(result.success).toBe(false);
  });
});
