import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import AccountsPage from "@/app/(app)/accounts/page";
import AccountDetailPage from "@/app/(app)/accounts/[id]/page";
import {
  AppTestProviders,
  seedAuthCookie,
  clearAuthCookie,
} from "./test-utils";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
  useParams: () => ({ id: "acc_001" }),
}));

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
      },
      { timeout: 5000 }
    );

    expect(screen.getByText("Savings")).toBeInTheDocument();
    expect(screen.getByText("Credit Card")).toBeInTheDocument();
  });
});

describe("AccountDetailPage", () => {
  beforeEach(() => seedAuthCookie());
  afterEach(() => clearAuthCookie());

  it("renders account detail for a valid account id", async () => {
    render(
      <AppTestProviders>
        <AccountDetailPage params={Promise.resolve({ id: "acc_001" })} />
      </AppTestProviders>
    );

    await waitFor(
      () => {
        expect(screen.getByText("Savings")).toBeInTheDocument();
      },
      { timeout: 5000 }
    );
  });
});
