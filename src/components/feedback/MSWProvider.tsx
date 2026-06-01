"use client";

import { useEffect, useState, type ReactNode } from "react";

const isDev = process.env.NODE_ENV === "development";

export function MSWProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(!isDev);

  useEffect(() => {
    if (!isDev) return;

    import("@/mocks/browser").then(({ worker }) => {
      worker.start({ onUnhandledRequest: "bypass" }).then(() => {
        setReady(true);
      });
    });
  }, []);

  if (!ready) return null;
  return <>{children}</>;
}
