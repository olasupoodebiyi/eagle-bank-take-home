import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ChakraProvider } from "@chakra-ui/react";
import { system } from "@/styles/theme";
import { TransactionTypeBadge, StatusBadge } from "@/components/ui/Badges";

function Wrapper({ children }: { children: React.ReactNode }) {
  return <ChakraProvider value={system}>{children}</ChakraProvider>;
}

describe("TransactionTypeBadge", () => {
  it("renders deposit badge", () => {
    render(<Wrapper><TransactionTypeBadge type="deposit" /></Wrapper>);
    expect(screen.getByText("Deposit")).toBeInTheDocument();
  });

  it("renders withdrawal badge", () => {
    render(<Wrapper><TransactionTypeBadge type="withdrawal" /></Wrapper>);
    expect(screen.getByText("Withdrawal")).toBeInTheDocument();
  });

  it("renders transfer badge", () => {
    render(<Wrapper><TransactionTypeBadge type="transfer" /></Wrapper>);
    expect(screen.getByText("Transfer")).toBeInTheDocument();
  });
});

describe("StatusBadge", () => {
  const statuses = [
    { status: "completed" as const, label: "Completed" },
    { status: "pending" as const, label: "Pending" },
    { status: "failed" as const, label: "Failed" },
    { status: "active" as const, label: "Active" },
    { status: "frozen" as const, label: "Frozen" },
    { status: "closed" as const, label: "Closed" },
  ];

  statuses.forEach(({ status, label }) => {
    it(`renders ${status} status`, () => {
      render(<Wrapper><StatusBadge status={status} /></Wrapper>);
      expect(screen.getByText(label)).toBeInTheDocument();
    });
  });
});
