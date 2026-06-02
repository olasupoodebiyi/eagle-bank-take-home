"use client";

import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import Cookies from "js-cookie";
import { getAuthorizationHeader, TOKEN_COOKIE } from "@/lib/auth-token";
import {
  clearAuthCookie,
  hasAuthCookie,
  isPublicAuthPath,
  redirectToLogin,
} from "@/lib/auth-session";
import type { AuthState, User, LoginPayload, RegisterPayload } from "@/types";

// ─── State ─────────────────────────────────────────────────────────────────────

type AuthAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "LOGIN_SUCCESS"; payload: { user: User; token: string } }
  | { type: "LOGOUT" }
  | { type: "UPDATE_USER"; payload: User };

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "LOGIN_SUCCESS":
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
      };
    case "LOGOUT":
      return { ...initialState, isLoading: false };
    case "UPDATE_USER":
      return { ...state, user: action.payload };
    default:
      return state;
  }
}

// ─── Context ───────────────────────────────────────────────────────────────────

interface AuthContextValue extends AuthState {
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

// ─── Provider ──────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Rehydrate session on mount
  useEffect(() => {
    if (!hasAuthCookie()) {
      if (isPublicAuthPath()) {
        dispatch({ type: "SET_LOADING", payload: false });
        return;
      }
      redirectToLogin();
      return;
    }

    const token = Cookies.get(TOKEN_COOKIE) ?? "";

    fetch("/api/auth/me", {
      headers: {
        "Content-Type": "application/json",
        ...getAuthorizationHeader(),
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Session expired");
        return res.json();
      })
      .then((user: User) => {
        dispatch({ type: "LOGIN_SUCCESS", payload: { user, token } });
      })
      .catch(() => {
        clearAuthCookie();
        redirectToLogin();
      });
  }, []);

  const login = useCallback(async (payload: LoginPayload) => {
    dispatch({ type: "SET_LOADING", payload: true });
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = await res.json();
      dispatch({ type: "SET_LOADING", payload: false });
      throw new Error(err.message ?? "Login failed");
    }

    const data = await res.json();
    Cookies.set(TOKEN_COOKIE, data.token, { expires: 7, sameSite: "strict" });
    dispatch({ type: "LOGIN_SUCCESS", payload: data });
  }, []);

  const register = useCallback(async (payload: RegisterPayload) => {
    dispatch({ type: "SET_LOADING", payload: true });
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = await res.json();
      dispatch({ type: "SET_LOADING", payload: false });
      throw new Error(err.message ?? "Registration failed");
    }

    const data = await res.json();
    Cookies.set(TOKEN_COOKIE, data.token, { expires: 7, sameSite: "strict" });
    dispatch({ type: "LOGIN_SUCCESS", payload: data });
  }, []);

  const logout = useCallback(async () => {
    const token = Cookies.get(TOKEN_COOKIE);
    await fetch("/api/auth/logout", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    }).catch(() => {});
    clearAuthCookie();
    dispatch({ type: "LOGOUT" });
  }, []);

  const updateUser = useCallback((user: User) => {
    dispatch({ type: "UPDATE_USER", payload: user });
  }, []);

  return (
    <AuthContext.Provider
      value={{ ...state, login, register, logout, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ─── Hook ──────────────────────────────────────────────────────────────────────

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
