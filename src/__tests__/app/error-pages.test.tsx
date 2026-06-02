import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ChakraProvider } from "@chakra-ui/react";
import NotFound from "@/app/not-found";
import ErrorPage from "@/app/error";
import { system } from "@/styles/theme";

function renderWithChakra(ui: React.ReactElement) {
  return render(<ChakraProvider value={system}>{ui}</ChakraProvider>);
}

describe("NotFound page", () => {
  it("renders 404 heading and link to dashboard", () => {
    renderWithChakra(<NotFound />);
    expect(screen.getByText("404")).toBeInTheDocument();
    expect(screen.getByText(/page not found/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /go to dashboard/i })).toHaveAttribute(
      "href",
      "/dashboard"
    );
  });
});

describe("Error boundary page", () => {
  it("renders error message and calls reset when Try again is clicked", async () => {
    const reset = vi.fn();
    const user = userEvent.setup();
    renderWithChakra(
      <ErrorPage error={new Error("boom")} reset={reset} />
    );

    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /try again/i }));
    expect(reset).toHaveBeenCalledOnce();
  });
});
