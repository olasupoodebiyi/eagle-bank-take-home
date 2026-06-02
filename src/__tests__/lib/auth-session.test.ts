import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import Cookies from "js-cookie";
import { TOKEN_COOKIE } from "@/lib/auth-token";
import {
  clearAuthCookie,
  getSessionAwareErrorState,
  hasAuthCookie,
  isPublicAuthPath,
  isSessionError,
  redirectToLogin,
} from "@/lib/auth-session";

describe("auth-session", () => {
  beforeEach(() => {
    clearAuthCookie();
  });

  it("hasAuthCookie reflects cookie presence", () => {
    expect(hasAuthCookie()).toBe(false);
    Cookies.set(TOKEN_COOKIE, "mock_token_usr_001_1");
    expect(hasAuthCookie()).toBe(true);
  });

  it("isPublicAuthPath matches login and register", () => {
    expect(isPublicAuthPath("/login")).toBe(true);
    expect(isPublicAuthPath("/register")).toBe(true);
    expect(isPublicAuthPath("/dashboard")).toBe(false);
  });

  it("isSessionError detects status and message", () => {
    expect(isSessionError(401)).toBe(true);
    expect(isSessionError(403)).toBe(true);
    expect(isSessionError(500)).toBe(false);
    expect(isSessionError(0, "Unauthorized")).toBe(true);
    expect(isSessionError(0, "Session expired")).toBe(true);
  });

  it("getSessionAwareErrorState uses reauthenticate copy for session errors", () => {
    const state = getSessionAwareErrorState("Unauthorized");
    expect(state.title).toBe("Reauthenticate");
    expect(state.showRetry).toBe(false);
  });

  it("getSessionAwareErrorState keeps generic copy for other errors", () => {
    const state = getSessionAwareErrorState("Network failed");
    expect(state.title).toBe("Something went wrong");
    expect(state.message).toBe("Network failed");
    expect(state.showRetry).toBe(true);
  });

  describe("redirectToLogin", () => {
    const replace = vi.fn();

    beforeEach(() => {
      replace.mockClear();
      vi.stubGlobal("location", {
        pathname: "/accounts",
        search: "?tab=savings",
        replace,
      });
    });

    afterEach(() => {
      vi.unstubAllGlobals();
    });

    it("redirects protected paths with return URL", () => {
      redirectToLogin();
      expect(replace).toHaveBeenCalledWith(
        "/login?redirect=%2Faccounts%3Ftab%3Dsavings"
      );
    });

    it("redirects to plain login when already on auth pages", () => {
      vi.stubGlobal("location", {
        pathname: "/login",
        search: "",
        replace,
      });
      redirectToLogin("/login");
      expect(replace).toHaveBeenCalledWith("/login");
    });
  });
});
