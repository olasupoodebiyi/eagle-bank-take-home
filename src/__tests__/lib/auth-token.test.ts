import { describe, it, expect, beforeEach, afterEach } from "vitest";
import Cookies from "js-cookie";
import { getAuthorizationHeader } from "@/lib/auth-token";

describe("getAuthorizationHeader", () => {
  afterEach(() => Cookies.remove("eagle_bank_token"));

  it("adds Bearer prefix to raw mock tokens", () => {
    Cookies.set("eagle_bank_token", "mock_token_usr_001_123456");
    expect(getAuthorizationHeader()).toEqual({
      Authorization: "Bearer mock_token_usr_001_123456",
    });
  });

  it("does not double-prefix tokens that already include Bearer", () => {
    Cookies.set("eagle_bank_token", "Bearer mock_token_usr_001_123456");
    expect(getAuthorizationHeader()).toEqual({
      Authorization: "Bearer mock_token_usr_001_123456",
    });
  });

  it("returns empty object when cookie is absent", () => {
    expect(getAuthorizationHeader()).toEqual({});
  });
});
