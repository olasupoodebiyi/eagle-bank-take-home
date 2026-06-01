import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ChakraProvider } from "@chakra-ui/react";
import { system } from "@/styles/theme";
import { StatCard } from "@/components/ui/StatCard";
import { Wallet } from "lucide-react";

function Wrapper({ children }: { children: React.ReactNode }) {
  return <ChakraProvider value={system}>{children}</ChakraProvider>;
}

describe("StatCard", () => {
  it("renders label and value", () => {
    render(
      <Wrapper>
        <StatCard label="Total balance" value="£24,850.75" icon={Wallet} />
      </Wrapper>
    );
    expect(screen.getByText("Total balance")).toBeInTheDocument();
    expect(screen.getByText("£24,850.75")).toBeInTheDocument();
  });

  it("renders sub value when provided", () => {
    render(
      <Wrapper>
        <StatCard label="Deposits" value="£3,500.00" subValue="This month" icon={Wallet} />
      </Wrapper>
    );
    expect(screen.getByText("This month")).toBeInTheDocument();
  });

  it("renders skeleton when loading", () => {
    render(
      <Wrapper>
        <StatCard label="Balance" value="£0.00" icon={Wallet} isLoading />
      </Wrapper>
    );
    // Value should not be visible when loading
    expect(screen.queryByText("£0.00")).not.toBeInTheDocument();
  });
});
