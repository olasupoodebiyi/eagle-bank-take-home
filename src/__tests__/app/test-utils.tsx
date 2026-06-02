import React from "react";
import { ChakraProvider } from "@chakra-ui/react";
import Cookies from "js-cookie";
import { AuthProvider } from "@/context/AuthContext";
import { ToastProvider } from "@/context/ToastContext";
import { system } from "@/styles/theme";

export const MOCK_TOKEN = "mock_token_usr_001_123456";

export function AppTestProviders({ children }: { children: React.ReactNode }) {
  return (
    <ChakraProvider value={system}>
      <ToastProvider>
        <AuthProvider>{children}</AuthProvider>
      </ToastProvider>
    </ChakraProvider>
  );
}

export function seedAuthCookie() {
  Cookies.set("eagle_bank_token", MOCK_TOKEN);
}

export function clearAuthCookie() {
  Cookies.remove("eagle_bank_token");
}
