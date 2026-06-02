"use client";

import { useState, useEffect, useCallback } from "react";
import { getAuthorizationHeader } from "@/lib/auth-token";
import {
  handleUnauthorizedResponse,
  isSessionError,
} from "@/lib/auth-session";

interface UseFetchState<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
}

export function useFetch<T>(url: string | null) {
  const [state, setState] = useState<UseFetchState<T>>({
    data: null,
    isLoading: !!url,
    error: null,
  });

  const fetchData = useCallback(async () => {
    if (!url) return;

    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const res = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          ...getAuthorizationHeader(),
        },
      });

      if (!res.ok) {
        if (isSessionError(res.status)) {
          handleUnauthorizedResponse();
          setState({ data: null, isLoading: false, error: null });
          return;
        }
        const err = await res.json().catch(() => ({ message: "Request failed" }));
        throw new Error(err.message ?? `Error ${res.status}`);
      }

      const data: T = await res.json();
      setState({ data, isLoading: false, error: null });
    } catch (err) {
      setState({
        data: null,
        isLoading: false,
        error: err instanceof Error ? err.message : "Unknown error",
      });
    }
  }, [url]);

  useEffect(() => {
    if (!url) {
      queueMicrotask(() => {
        setState({ data: null, isLoading: false, error: null });
      });
      return;
    }

    let cancelled = false;

    void (async () => {
      try {
        const res = await fetch(url, {
          headers: {
            "Content-Type": "application/json",
            ...getAuthorizationHeader(),
          },
        });

        if (cancelled) return;

        if (!res.ok) {
          if (isSessionError(res.status)) {
            handleUnauthorizedResponse();
            if (!cancelled) {
              setState({ data: null, isLoading: false, error: null });
            }
            return;
          }
          const err = await res.json().catch(() => ({ message: "Request failed" }));
          throw new Error(err.message ?? `Error ${res.status}`);
        }

        const data: T = await res.json();
        if (!cancelled) {
          setState({ data, isLoading: false, error: null });
        }
      } catch (err) {
        if (!cancelled) {
          setState({
            data: null,
            isLoading: false,
            error: err instanceof Error ? err.message : "Unknown error",
          });
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [url]);

  return { ...state, refetch: fetchData };
}

// Authenticated fetch helper for mutations
export async function authFetch<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...getAuthorizationHeader(),
      ...options.headers,
    },
  });

  if (!res.ok) {
    if (isSessionError(res.status)) {
      handleUnauthorizedResponse();
      throw new Error("Session expired");
    }
    const err = await res.json().catch(() => ({ message: "Request failed" }));
    throw new Error(err.message ?? `Error ${res.status}`);
  }

  return res.json() as Promise<T>;
}
