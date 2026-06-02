import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import DashboardPage from "@/app/(app)/dashboard/page";
import {
  AppTestProviders,
  seedAuthCookie,
  clearAuthCookie,
} from "./test-utils";

describe("DashboardPage", () => {
  beforeEach(() => seedAuthCookie());
  afterEach(() => clearAuthCookie());

  it("renders user greeting and balance stats from API", async () => {
    render(
      <AppTestProviders>
        <DashboardPage />
      </AppTestProviders>
    );

    await waitFor(
      () => {
        expect(screen.getByText(/Welcome back, Alex/i)).toBeInTheDocument();
        expect(screen.getByText("Total balance")).toBeInTheDocument();
        expect(screen.getAllByText(/£24,850\.75/).length).toBeGreaterThan(0);
      },
      { timeout: 8000 }
    );
  });
});
