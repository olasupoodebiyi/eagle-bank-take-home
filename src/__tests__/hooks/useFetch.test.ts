import { describe, it, expect } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { server } from "@/mocks/server";
import { useFetch } from "@/hooks/useFetch";

describe("useFetch", () => {
  it("returns loading state initially", () => {
    const { result } = renderHook(() => useFetch("/api/dashboard"));
    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it("returns data on successful fetch", async () => {
    server.use(
      http.get("/api/dashboard", () =>
        HttpResponse.json({ stats: { totalBalance: 1000 } }, { status: 200 })
      )
    );

    const { result } = renderHook(() => useFetch<{ stats: { totalBalance: number } }>("/api/dashboard"));

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.data?.stats.totalBalance).toBe(1000);
    expect(result.current.error).toBeNull();
  });

  it("returns error on failed fetch", async () => {
    server.use(
      http.get("/api/accounts", () =>
        HttpResponse.json({ message: "Unauthorized" }, { status: 401 })
      )
    );

    const { result } = renderHook(() => useFetch("/api/accounts"));

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.error).toBe("Unauthorized");
    expect(result.current.data).toBeNull();
  });

  it("does not fetch when url is null", () => {
    const { result } = renderHook(() => useFetch(null));
    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toBeNull();
  });

  it("refetch triggers a new request", async () => {
    let callCount = 0;
    server.use(
      http.get("/api/profile", () => {
        callCount++;
        return HttpResponse.json({ id: "usr_001" }, { status: 200 });
      })
    );

    const { result } = renderHook(() => useFetch("/api/profile"));
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(callCount).toBe(1);

    await result.current.refetch();
    expect(callCount).toBe(2);
  });
});
