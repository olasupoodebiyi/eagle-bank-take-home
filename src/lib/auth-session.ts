"use client";

import Cookies from "js-cookie";
import { TOKEN_COOKIE } from "@/lib/auth-token";

export function hasAuthCookie(): boolean {
  return !!Cookies.get(TOKEN_COOKIE)?.trim();
}

export function isPublicAuthPath(pathname?: string): boolean {
  const path =
    pathname ??
    (typeof window !== "undefined" ? window.location.pathname : "");
  return path.startsWith("/login") || path.startsWith("/register");
}

export function clearAuthCookie(): void {
  Cookies.remove(TOKEN_COOKIE);
}

/** Send the user to login and clear any stale session cookie. */
export function redirectToLogin(redirectPath?: string): void {
  if (typeof window === "undefined") return;

  clearAuthCookie();

  const path =
    redirectPath ?? `${window.location.pathname}${window.location.search}`;

  if (path.startsWith("/login") || path.startsWith("/register")) {
    window.location.replace("/login");
    return;
  }

  window.location.replace(
    `/login?redirect=${encodeURIComponent(path)}`
  );
}

export function handleUnauthorizedResponse(): void {
  redirectToLogin();
}

export function isSessionError(status: number, message?: string): boolean {
  if (status === 401 || status === 403) return true;
  if (!message) return false;
  return /unauthorized|session expired|not authenticated/i.test(message);
}

export function getSessionAwareErrorState(message: string): {
  title: string;
  message: string;
  showRetry: boolean;
} {
  if (isSessionError(0, message)) {
    return {
      title: "Reauthenticate",
      message: "Your session has ended. Sign in again to continue.",
      showRetry: false,
    };
  }

  return {
    title: "Something went wrong",
    message,
    showRetry: true,
  };
}
