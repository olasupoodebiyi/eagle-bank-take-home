import { Badge } from "@chakra-ui/react";
import type { TransactionType, TransactionStatus, AccountStatus } from "@/types";

interface TransactionTypeBadgeProps {
  type: TransactionType;
}

export function TransactionTypeBadge({ type }: TransactionTypeBadgeProps) {
  const map = {
    deposit: { label: "Deposit", bg: "rgba(16,185,129,0.12)", color: "#34d399" },
    withdrawal: { label: "Withdrawal", bg: "rgba(244,63,94,0.12)", color: "#fb7185" },
    transfer: { label: "Transfer", bg: "rgba(90,96,245,0.12)", color: "#9ea7ff" },
  };
  const { label, bg, color } = map[type];
  return (
    <Badge
      px="8px"
      py="3px"
      borderRadius="md"
      fontSize="11px"
      fontWeight="600"
      letterSpacing="0.3px"
      bg={bg}
      color={color}
      textTransform="capitalize"
    >
      {label}
    </Badge>
  );
}

interface StatusBadgeProps {
  status: TransactionStatus | AccountStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const map: Record<string, { label: string; bg: string; color: string }> = {
    completed: { label: "Completed", bg: "rgba(16,185,129,0.12)", color: "#34d399" },
    pending: { label: "Pending", bg: "rgba(245,158,11,0.12)", color: "#fbbf24" },
    failed: { label: "Failed", bg: "rgba(244,63,94,0.12)", color: "#fb7185" },
    active: { label: "Active", bg: "rgba(16,185,129,0.12)", color: "#34d399" },
    frozen: { label: "Frozen", bg: "rgba(245,158,11,0.12)", color: "#fbbf24" },
    closed: { label: "Closed", bg: "rgba(100,100,120,0.15)", color: "#9193b0" },
  };
  const { label, bg, color } = map[status] ?? { label: status, bg: "surface.3", color: "fg.muted" };
  return (
    <Badge
      px="8px"
      py="3px"
      borderRadius="md"
      fontSize="11px"
      fontWeight="600"
      letterSpacing="0.3px"
      bg={bg}
      color={color}
    >
      {label}
    </Badge>
  );
}
