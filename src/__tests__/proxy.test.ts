import { describe, it, expect } from "vitest";
import { NextRequest } from "next/server";
import { proxy } from "@/proxy";

describe("proxy route protection", () => {
  it("redirects unauthenticated users from protected routes to login", () => {
    const request = new NextRequest("http://localhost:3000/dashboard");
    const response = proxy(request);

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe(
      "http://localhost:3000/login?redirect=%2Fdashboard"
    );
  });

  it("allows public auth routes without a token", () => {
    const request = new NextRequest("http://localhost:3000/login");
    const response = proxy(request);

    expect(response.status).toBe(200);
  });

  it("redirects authenticated users away from login", () => {
    const request = new NextRequest("http://localhost:3000/login", {
      headers: { cookie: "eagle_bank_token=mock_token_usr_001_123456" },
    });
    const response = proxy(request);

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe("http://localhost:3000/dashboard");
  });
});
