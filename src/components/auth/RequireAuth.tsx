"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Box, Text } from "@chakra-ui/react";
import { useAuth } from "@/context/AuthContext";
import { hasAuthCookie, redirectToLogin } from "@/lib/auth-session";

type RequireAuthProps = {
  children: ReactNode;
};

/**
 * Client guard for (app) routes: no cookie or invalid session → login redirect.
 * proxy.ts only runs on navigations; this covers cookie loss and expired tokens in-app.
 */
export function RequireAuth({ children }: RequireAuthProps) {
  const pathname = usePathname();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!hasAuthCookie()) {
      redirectToLogin(pathname);
      return;
    }

    if (!isLoading && !isAuthenticated) {
      redirectToLogin(pathname);
    }
  }, [isLoading, isAuthenticated, pathname]);

  useEffect(() => {
    const recheckCookie = () => {
      if (!hasAuthCookie()) {
        redirectToLogin(pathname);
      }
    };

    window.addEventListener("focus", recheckCookie);
    document.addEventListener("visibilitychange", recheckCookie);

    return () => {
      window.removeEventListener("focus", recheckCookie);
      document.removeEventListener("visibilitychange", recheckCookie);
    };
  }, [pathname]);

  if (!hasAuthCookie() || isLoading || !isAuthenticated) {
    return (
      <Box py="48px" textAlign="center">
        <Text fontSize="sm" color="fg.muted">
          Checking your session…
        </Text>
      </Box>
    );
  }

  return <>{children}</>;
}
