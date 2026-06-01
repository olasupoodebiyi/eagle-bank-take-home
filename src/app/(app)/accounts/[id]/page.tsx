"use client";

import { Box, Text, HStack } from "@chakra-ui/react";
import { ArrowLeft, CreditCard } from "lucide-react";
import { NextLinkBox } from "@/components/ui/NextLink";
import { use } from "react";
import { useFetch } from "@/hooks/useFetch";
import { StatusBadge } from "@/components/ui/Badges";
import { ErrorState } from "@/components/feedback/States";
import { PageHeader } from "@/components/layout/PageHeader";
import {
  formatCurrency,
  formatDate,
  accountTypeLabel,
} from "@/lib/utils";
import type { Account } from "@/types";

export default function AccountDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: account, isLoading, error, refetch } = useFetch<Account>(
    `/api/accounts/${id}`
  );

  if (error) {
    return (
      <Box>
        <NextLinkBox href="/accounts" display="inline-flex" alignItems="center" gap="6px" color="fg.muted" fontSize="13px" mb="24px" _hover={{ color: "fg.default" }}>
          <ArrowLeft size={14} /> Back to accounts
        </NextLinkBox>
        <ErrorState message={error} onRetry={refetch} />
      </Box>
    );
  }

  return (
    <Box>
      <NextLinkBox href="/accounts" display="inline-flex" alignItems="center" gap="6px" color="fg.muted" fontSize="13px" mb="24px" _hover={{ color: "fg.default" }}>
        <ArrowLeft size={14} /> Back to accounts
      </NextLinkBox>

      <PageHeader
        title={isLoading ? "Account details" : accountTypeLabel(account!.type)}
        subtitle={account?.accountNumber}
      />

      {isLoading ? (
        <Box h="200px" bg="surface.2" borderRadius="xl" style={{ animation: "pulse 1.5s ease-in-out infinite" }} />
      ) : account ? (
        <Box>
          {/* Main card */}
          <Box
            bg="surface.2"
            border="1px solid"
            borderColor="surface.border"
            borderRadius="xl"
            p="32px"
            mb="24px"
          >
            <HStack justify="space-between" mb="32px">
              <HStack gap="12px">
                <Box p="12px" bg="surface.3" borderRadius="lg" color="brand.400">
                  <CreditCard size={22} />
                </Box>
                <Box>
                  <Text fontWeight="700" fontSize="18px" color="fg.default">
                    {accountTypeLabel(account.type)}
                  </Text>
                  <Text fontSize="12px" color="fg.subtle" fontFamily="mono">
                    {account.accountNumber}
                  </Text>
                </Box>
              </HStack>
              <StatusBadge status={account.status} />
            </HStack>

            <HStack gap="40px" flexWrap="wrap">
              <Box>
                <Text fontSize="12px" color="fg.subtle" mb="4px">Balance</Text>
                <Text fontSize="32px" fontWeight="700" fontFamily="mono" letterSpacing="-1px" color={account.balance < 0 ? "coral.400" : "fg.default"}>
                  {formatCurrency(account.balance, account.currency)}
                </Text>
              </Box>
              <Box>
                <Text fontSize="12px" color="fg.subtle" mb="4px">Available balance</Text>
                <Text fontSize="24px" fontWeight="600" fontFamily="mono" color="emerald.400">
                  {formatCurrency(account.availableBalance, account.currency)}
                </Text>
              </Box>
            </HStack>
          </Box>

          {/* Details */}
          <Box bg="surface.1" border="1px solid" borderColor="surface.border" borderRadius="xl" overflow="hidden">
            <Text px="24px" py="16px" fontWeight="600" color="fg.default" borderBottom="1px solid" borderColor="surface.border">
              Account details
            </Text>
            {[
              { label: "Account number", value: account.accountNumber, mono: true },
              { label: "Account type", value: accountTypeLabel(account.type), mono: false },
              { label: "Currency", value: account.currency, mono: true },
              { label: "Status", value: <StatusBadge status={account.status} />, mono: false },
              { label: "Opened", value: formatDate(account.createdAt, "dd MMMM yyyy"), mono: false },
            ].map(({ label, value, mono }) => (
              <HStack
                key={label}
                px="24px"
                py="14px"
                justify="space-between"
                borderBottom="1px solid"
                borderColor="surface.border"
                _last={{ borderBottom: "none" }}
              >
                <Text fontSize="13px" color="fg.muted">{label}</Text>
                {typeof value === "string" ? (
                  <Text fontSize="13px" fontWeight="500" color="fg.default" fontFamily={mono ? "mono" : "body"}>
                    {value}
                  </Text>
                ) : value}
              </HStack>
            ))}
          </Box>
        </Box>
      ) : null}

      <style>{`
        @keyframes pulse { 0%,100% { opacity:1 } 50% { opacity:0.5 } }
      `}</style>
    </Box>
  );
}
