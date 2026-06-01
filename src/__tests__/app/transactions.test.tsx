import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import TransactionsPage from "@/app/(app)/transactions/page";
import TransactionDetailPage from "@/app/(app)/transactions/[id]/page";
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

  it("renders transaction history from API", async () => {
    render(
      <AppTestProviders>
        <TransactionsPage />
      </AppTestProviders>
    );

    await waitFor(
      () => {
        expect(screen.getByText("Transactions")).toBeInTheDocument();
      },
      { timeout: 5000 }
    );

    expect(
      screen.getByText("Salary payment — April 2025")
    ).toBeInTheDocument();
  });
});

describe("TransactionDetailPage", () => {
  beforeEach(() => seedAuthCookie());
  afterEach(() => clearAuthCookie());

  it("renders transaction detail for a valid id", async () => {
    render(
      <AppTestProviders>
        <TransactionDetailPage params={Promise.resolve({ id: "txn_001" })} />
      </AppTestProviders>
    );

    await waitFor(
      () => {
        expect(screen.getByText("Transaction details")).toBeInTheDocument();
      },
      { timeout: 5000 }
    );

    expect(
      screen.getByText("Salary payment — April 2025")
    ).toBeInTheDocument();
  });
});
