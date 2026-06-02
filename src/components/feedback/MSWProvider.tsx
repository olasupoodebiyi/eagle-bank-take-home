"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Box, Text } from "@chakra-ui/react";

const isDev = process.env.NODE_ENV === "development";

/** Mock API is required unless a real backend URL is configured. */
function shouldEnableMsw(): boolean {
  if (process.env.NEXT_PUBLIC_API_URL) return false;
  if (process.env.NEXT_PUBLIC_ENABLE_MSW === "false") return false;
  return true;
}

export function MSWProvider({ children }: { children: ReactNode }) {
  const enableMsw = shouldEnableMsw();
  const [ready, setReady] = useState(!enableMsw);

  useEffect(() => {
    if (!enableMsw) return;

    let cancelled = false;

    const timeout = window.setTimeout(() => {
      if (!cancelled) {
        console.warn(
          "[MSW] Worker start timed out. Clear site data (Application → Service Workers) and reload."
        );
        setReady(true);
      }
    }, 10_000);

    import("@/mocks/browser")
      .then(({ worker }) =>
        worker.start({
          onUnhandledRequest: "bypass",
          quiet: true,
          ...(isDev
            ? {}
            : { serviceWorker: { url: "/mockServiceWorker.js" } }),
        })
      )
      .then(() => {
        if (!cancelled) setReady(true);
      })
      .catch((err) => {
        console.error("[MSW] Failed to start:", err);
        if (!cancelled) setReady(true);
      })
      .finally(() => clearTimeout(timeout));

    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, [enableMsw]);

  if (!ready) {
    return (
      <Box
        minH="100vh"
        bg="surface.0"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Text color="fg.muted" fontSize="sm">
          Starting mock API…
        </Text>
      </Box>
    );
  }

  return <>{children}</>;
}
