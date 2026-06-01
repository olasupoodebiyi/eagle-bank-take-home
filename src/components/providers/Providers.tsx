"use client";

import { ChakraProvider } from "@chakra-ui/react";
import { system } from "@/styles/theme";
import { ToastProvider } from "@/context/ToastContext";
import { MSWProvider } from "@/components/feedback/MSWProvider";
import { ToastContainer } from "@/components/feedback/ToastContainer";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ChakraProvider value={system}>
      <ToastProvider>
        <MSWProvider>{children}</MSWProvider>
        <ToastContainer />
      </ToastProvider>
    </ChakraProvider>
  );
}
