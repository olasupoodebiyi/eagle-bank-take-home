import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Cookies from "js-cookie";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { ChakraProvider } from "@chakra-ui/react";
import { system } from "@/styles/theme";

// Helper: minimal wrapper
function TestWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ChakraProvider value={system}>
      <AuthProvider>{children}</AuthProvider>
    </ChakraProvider>
  );
}

// Consumer component for testing context
function AuthStatus() {
  const { isAuthenticated, user, isLoading } = useAuth();
  if (isLoading) return <div>loading</div>;
  if (!isAuthenticated) return <div>not authenticated</div>;
  return <div>authenticated as {user?.email}</div>;
}

function LoginButton() {
  const { login } = useAuth();
  return (
    <button
      onClick={() =>
        login({ email: "alex.morgan@example.com", password: "password123" })
      }
    >
      login
    </button>
  );
}

describe("AuthContext", () => {
  beforeEach(() => {
    Cookies.remove("eagle_bank_token");
  });

  it("starts in unauthenticated state after loading", async () => {
    render(
      <TestWrapper>
        <AuthStatus />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText("not authenticated")).toBeInTheDocument();
    });
  });

  it("authenticates on successful login", async () => {
    const user = userEvent.setup();
    render(
      <TestWrapper>
        <AuthStatus />
        <LoginButton />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText("not authenticated")).toBeInTheDocument();
    });

    await user.click(screen.getByText("login"));

    await waitFor(() => {
      expect(
        screen.getByText("authenticated as alex.morgan@example.com")
      ).toBeInTheDocument();
    });
  });

  it("throws on invalid login credentials", async () => {
    function BadLoginButton() {
      const { login } = useAuth();
      const [error, setError] = React.useState("");
      return (
        <>
          <button
            onClick={() =>
              login({ email: "bad@bad.com", password: "wrongpass" }).catch((e) =>
                setError(e.message)
              )
            }
          >
            bad login
          </button>
          {error && <div role="alert">{error}</div>}
        </>
      );
    }

    const { default: React } = await import("react");
    const user = userEvent.setup();
    render(
      <TestWrapper>
        <BadLoginButton />
      </TestWrapper>
    );

    await user.click(screen.getByText("bad login"));
    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(
        "Invalid email or password"
      );
    });
  });

  it("logs out and clears state", async () => {
    function LogoutButton() {
      const { logout } = useAuth();
      return <button onClick={logout}>logout</button>;
    }

    const user = userEvent.setup();
    render(
      <TestWrapper>
        <AuthStatus />
        <LoginButton />
        <LogoutButton />
      </TestWrapper>
    );

    // Login first
    await waitFor(() =>
      expect(screen.getByText("not authenticated")).toBeInTheDocument()
    );
    await user.click(screen.getByText("login"));
    await waitFor(() =>
      expect(screen.getByText(/authenticated as/)).toBeInTheDocument()
    );

    // Then logout
    await user.click(screen.getByText("logout"));
    await waitFor(() =>
      expect(screen.getByText("not authenticated")).toBeInTheDocument()
    );
  });
});
