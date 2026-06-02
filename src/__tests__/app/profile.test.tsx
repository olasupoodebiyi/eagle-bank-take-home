import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ProfilePage from "@/app/(app)/profile/page";
import {
  AppTestProviders,
  seedAuthCookie,
  clearAuthCookie,
} from "./test-utils";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

describe("ProfilePage", () => {
  beforeEach(() => seedAuthCookie());
  afterEach(() => clearAuthCookie());

  it("renders profile form with user data from auth context", async () => {
    render(
      <AppTestProviders>
        <ProfilePage />
      </AppTestProviders>
    );

    await waitFor(
      () => {
        expect(screen.getByText("Profile")).toBeInTheDocument();
        expect(screen.getByText("Alex Morgan")).toBeInTheDocument();
        expect(screen.getByText("alex.morgan@example.com")).toBeInTheDocument();
      },
      { timeout: 8000 }
    );
  });

  it("shows validation error when required fields are cleared and submitted", async () => {
    const user = userEvent.setup();
    render(
      <AppTestProviders>
        <ProfilePage />
      </AppTestProviders>
    );

    await waitFor(
      () => {
        expect(screen.getByText("Alex Morgan")).toBeInTheDocument();
      },
      { timeout: 8000 }
    );

    const nameInput = screen.getByLabelText(/full name/i);
    await user.clear(nameInput);
    await user.type(nameInput, "A");
    await user.click(screen.getByRole("button", { name: /save changes/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/name must be at least 2 characters/i)
      ).toBeInTheDocument();
    });
  });
});
