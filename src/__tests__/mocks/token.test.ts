import { describe, it, expect } from "vitest";
import { getUserIdFromToken } from "@/mocks/utils/token";

describe("getUserIdFromToken", () => {
  it("parses user ids that contain underscores", () => {
    expect(getUserIdFromToken("Bearer mock_token_usr_001_123456")).toBe("usr_001");
  });

  it("returns null for invalid tokens", () => {
    expect(getUserIdFromToken("Bearer invalid")).toBeNull();
    expect(getUserIdFromToken(null)).toBeNull();
  });
});
