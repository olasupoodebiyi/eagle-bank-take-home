"use client";

import { Box, Grid, Text, HStack } from "@chakra-ui/react";
import { CreditCard, ArrowRight } from "lucide-react";
import { NextLinkBox } from "@/components/ui/NextLink";
import { useFetch } from "@/hooks/useFetch";
import { StatusBadge } from "@/components/ui/Badges";
import { EmptyState, ErrorState } from "@/components/feedback/States";
import { PageHeader } from "@/components/layout/PageHeader";
import {
  formatCurrency,
  maskAccountNumber,
  accountTypeLabel,
} from "@/lib/utils";
import type { Account } from "@/types";

const accountAccents: Record<string, string> = {
  savings: "brand.400",
  credit: "coral.400",
  checking: "emerald.400",
};

function AccountCard({ account }: { account: Account }) {
  const accentColor = accountAccents[account.type] ?? "brand.400";

  return (
    <NextLinkBox
      href={`/accounts/${account.id}`}
      display="block"
      bg="surface.2"
      border="1px solid"
      borderColor="surface.border"
      borderRadius="xl"
      p="24px"
      position="relative"
      overflow="hidden"
      transition="all 0.2s"
      _hover={{ borderColor: "surface.borderHover", transform: "translateY(-2px)" }}
      aria-label={`${accountTypeLabel(account.type)} account ending ${account.accountNumber.slice(-4)}`}
    >
      {/* Accent strip */}
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        h="3px"
        bg={accentColor}
        borderTopLeftRadius="xl"
        borderTopRightRadius="xl"
      />

      {/* Background glow */}
      <Box
        position="absolute"
        top="-40px"
        right="-40px"
        w="160px"
        h="160px"
        borderRadius="full"
        bg={accentColor}
        opacity={0.05}
        pointerEvents="none"
      />

      <HStack justify="space-between" align="flex-start" mb="20px">
        <Box>
          <Text fontWeight="700" fontSize="16px" color="fg.default" mb="4px">
            {accountTypeLabel(account.type)}
          </Text>
          <Text fontSize="12px" color="fg.subtle" fontFamily="mono">
            {maskAccountNumber(account.accountNumber)}
          </Text>
        </Box>
        <HStack gap="6px">
          <StatusBadge status={account.status} />
        </HStack>
      </HStack>

      <Box mb="16px">
        <Text fontSize="11px" color="fg.subtle" mb="4px" fontWeight="500">
          {account.type === "credit" ? "Outstanding balance" : "Available balance"}
        </Text>
        <Text
          fontSize="28px"
          fontWeight="700"
          fontFamily="mono"
          letterSpacing="-0.5px"
          color={account.balance < 0 ? "coral.400" : "fg.default"}
        >
          {formatCurrency(account.balance, account.currency)}
        </Text>
      </Box>

      {account.type === "credit" && (
        <Box
          bg="surface.3"
          borderRadius="md"
          p="10px 12px"
          mb="16px"
        >
          <HStack justify="space-between">
            <Text fontSize="12px" color="fg.muted">Credit limit</Text>
            <Text fontSize="12px" fontWeight="600" color="fg.default" fontFamily="mono">
              {formatCurrency(account.availableBalance + Math.abs(account.balance), account.currency)}
            </Text>
          </HStack>
          <HStack justify="space-between" mt="4px">
            <Text fontSize="12px" color="fg.muted">Available</Text>
            <Text fontSize="12px" fontWeight="600" color="emerald.400" fontFamily="mono">
              {formatCurrency(account.availableBalance, account.currency)}
            </Text>
          </HStack>
        </Box>
      )}

      <HStack justify="flex-end" color="brand.400" fontSize="13px" fontWeight="500">
        <Text>View details</Text>
        <ArrowRight size={14} />
      </HStack>
    </NextLinkBox>
  );
}

export default function AccountsPage() {
  const { data: accounts, isLoading, error, refetch } = useFetch<Account[]>("/api/accounts");

  if (error) {
    return <ErrorState message={error} onRetry={refetch} />;
  }

  return (
    <Box>
      <PageHeader
        title="Accounts"
        subtitle="Manage and monitor all your Eagle Bank accounts."
      />

      {isLoading ? (
        <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", xl: "repeat(3, 1fr)" }} gap="20px">
          {Array.from({ length: 3 }).map((_, i) => (
            <Box
              key={i}
              bg="surface.2"
              border="1px solid"
              borderColor="surface.border"
              borderRadius="xl"
              h="220px"
              style={{ animation: `pulse 1.5s ease-in-out ${i * 0.1}s infinite` }}
            />
          ))}
        </Grid>
      ) : accounts?.length === 0 ? (
        <EmptyState
          title="No accounts yet"
          description="You don't have any bank accounts set up yet. Contact us to open your first account."
          icon={<CreditCard size={28} />}
        />
      ) : (
        <Grid
          templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", xl: "repeat(3, 1fr)" }}
          gap="20px"
        >
          {accounts?.map((account) => (
            <AccountCard key={account.id} account={account} />
          ))}
        </Grid>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </Box>
  );
}
