import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import AccountsPage from "@/app/(app)/accounts/page";
import {
  AppTestProviders,
  seedAuthCookie,
  clearAuthCookie,
} from "./test-utils";

describe("AccountsPage", () => {
  beforeEach(() => seedAuthCookie());
  afterEach(() => clearAuthCookie());

  it("renders account cards for the authenticated user", async () => {
    render(
      <AppTestProviders>
        <AccountsPage />
      </AppTestProviders>
    );

    await waitFor(
      () => {
        expect(screen.getByText("Accounts")).toBeInTheDocument();
        expect(screen.getByText("Savings")).toBeInTheDocument();
        expect(screen.getByText("Credit Card")).toBeInTheDocument();
      },
      { timeout: 8000 }
    );
  });
});

// Dynamic route params use React `use()` — covered by api-handlers tests + manual QA
describe("AccountDetailPage", () => {
  it.todo("detail view — async route params; see api-handlers GET /api/accounts/:id");
});
