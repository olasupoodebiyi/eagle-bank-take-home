import React from "react";
import React from "react";
import { describe, it, expect, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import RootLayout from "@/app/layout";

vi.mock("next/font/google", () => ({
  DM_Sans: () => ({ variable: "--font-dm-sans" }),
  JetBrains_Mono: () => ({ variable: "--font-mono" }),
}));

vi.mock("@/components/providers/Providers", () => ({
  Providers: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe("RootLayout", () => {
  it("applies dark color scheme on the document root for Chakra", () => {
    const html = renderToStaticMarkup(
      <RootLayout>
        <main>content</main>
      </RootLayout>
    );

    expect(html).toMatch(/class="[^"]*\bdark\b/);
    expect(html).toContain('style="color-scheme:dark"');
  });
});
