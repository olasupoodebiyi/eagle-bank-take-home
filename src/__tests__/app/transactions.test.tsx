import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import TransactionsPage from "@/app/(app)/transactions/page";
import {
  AppTestProviders,
  seedAuthCookie,
  clearAuthCookie,
} from "./test-utils";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

describe("TransactionsPage", () => {
  beforeEach(() => seedAuthCookie());
  afterEach(() => clearAuthCookie());

  it("renders transactions page with filters and data rows", async () => {
    render(
      <AppTestProviders>
        <TransactionsPage />
      </AppTestProviders>
    );

    await waitFor(
      () => {
        expect(screen.getByText("Transactions")).toBeInTheDocument();
        expect(screen.getByText("Filters")).toBeInTheDocument();
        expect(screen.getAllByText("Deposit").length).toBeGreaterThan(0);
        const detailLinks = screen.getAllByRole("link", { name: /view transaction/i });
        expect(detailLinks.length).toBeGreaterThan(0);
        expect(detailLinks[0]).toHaveAttribute("href", expect.stringMatching(/\/transactions\//));
      },
      { timeout: 10000 }
    );
  });
});

describe("TransactionDetailPage", () => {
  it.todo("detail view — async route params; see api-handlers GET /api/transactions/:id");
});
