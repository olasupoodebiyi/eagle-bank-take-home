import { format } from "date-fns";
import type { TransactionType, AccountType, AccountStatus } from "@/types";

export function formatCurrency(
  amount: number,
  currency: string = "GBP",
  showSign: boolean = false
): string {
  const formatted = new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(Math.abs(amount));

  if (showSign) {
    return amount < 0 ? `−${formatted}` : `+${formatted}`;
  }
  return amount < 0 ? `−${formatted}` : formatted;
}

export function formatDate(
  dateString: string,
  formatStr: string = "dd MMM yyyy"
): string {
  return format(new Date(dateString), formatStr);
}

export function maskAccountNumber(accountNumber: string): string {
  const parts = accountNumber.split(" ");
  return parts
    .map((part, i) => (i < parts.length - 1 ? "••••" : part))
    .join(" ");
}

export function transactionTypeLabel(type: TransactionType): string {
  return { deposit: "Deposit", withdrawal: "Withdrawal", transfer: "Transfer" }[
    type
  ];
}

export function accountTypeLabel(type: AccountType): string {
  return {
    savings: "Savings",
    credit: "Credit Card",
    checking: "Current Account",
  }[type];
}

export function accountStatusLabel(status: AccountStatus): string {
  return { active: "Active", frozen: "Frozen", closed: "Closed" }[status];
}
