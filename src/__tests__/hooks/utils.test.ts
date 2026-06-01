import { describe, it, expect } from "vitest";
import {
  formatCurrency,
  formatDate,
  maskAccountNumber,
  transactionTypeLabel,
  accountTypeLabel,
  accountStatusLabel,
} from "@/lib/utils";

describe("formatCurrency", () => {
  it("formats positive GBP correctly", () => {
    expect(formatCurrency(1234.56, "GBP")).toBe("£1,234.56");
  });

  it("formats negative amounts without sign by default", () => {
    expect(formatCurrency(-500, "GBP")).toBe("−£500.00");
  });

  it("formats with explicit sign", () => {
    expect(formatCurrency(250, "GBP", true)).toBe("+£250.00");
    expect(formatCurrency(-250, "GBP", true)).toBe("−£250.00");
  });

  it("formats zero correctly", () => {
    expect(formatCurrency(0, "GBP")).toBe("£0.00");
  });

  it("handles large amounts", () => {
    expect(formatCurrency(1000000, "GBP")).toBe("£1,000,000.00");
  });
});

describe("formatDate", () => {
  it("formats date in default format", () => {
    expect(formatDate("2025-04-01T10:00:00Z")).toMatch(/01 Apr 2025/);
  });

  it("formats with custom format", () => {
    expect(formatDate("2025-04-01T00:00:00Z", "yyyy-MM-dd")).toBe("2025-04-01");
  });
});

describe("maskAccountNumber", () => {
  it("masks all groups except the last", () => {
    const result = maskAccountNumber("GB29 NWBK 6016 1331 9268 19");
    expect(result).toBe("•••• •••• •••• •••• •••• 19");
  });

  it("handles single group (no masking)", () => {
    const result = maskAccountNumber("1234");
    expect(result).toBe("1234");
  });
});

describe("label helpers", () => {
  it("returns correct transaction type labels", () => {
    expect(transactionTypeLabel("deposit")).toBe("Deposit");
    expect(transactionTypeLabel("withdrawal")).toBe("Withdrawal");
    expect(transactionTypeLabel("transfer")).toBe("Transfer");
  });

  it("returns correct account type labels", () => {
    expect(accountTypeLabel("savings")).toBe("Savings");
    expect(accountTypeLabel("credit")).toBe("Credit Card");
    expect(accountTypeLabel("checking")).toBe("Current Account");
  });

  it("returns correct account status labels", () => {
    expect(accountStatusLabel("active")).toBe("Active");
    expect(accountStatusLabel("frozen")).toBe("Frozen");
    expect(accountStatusLabel("closed")).toBe("Closed");
  });
});
