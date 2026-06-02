"use client";

import { Box, Text, HStack } from "@chakra-ui/react";
import { ArrowLeft, ArrowLeftRight } from "lucide-react";
import { NextLinkBox } from "@/components/ui/NextLink";
import { Suspense, use } from "react";
import { useFetch } from "@/hooks/useFetch";
import { TransactionTypeBadge, StatusBadge } from "@/components/ui/Badges";
import { ErrorState } from "@/components/feedback/States";
import { PageHeader } from "@/components/layout/PageHeader";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Transaction } from "@/types";

export default function TransactionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense fallback={null}>
      <TransactionDetailContent params={params} />
    </Suspense>
  );
}

function TransactionDetailContent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: txn, isLoading, error, refetch } = useFetch<Transaction>(
    `/api/transactions/${id}`
  );

  if (error) {
    return (
      <Box>
        <NextLinkBox href="/transactions" display="inline-flex" alignItems="center" gap="6px" color="fg.muted" fontSize="13px" mb="24px" _hover={{ color: "fg.default" }}>
          <ArrowLeft size={14} /> Back to transactions
        </NextLinkBox>
        <ErrorState message={error} onRetry={refetch} />
      </Box>
    );
  }

  return (
    <Box>
      <NextLinkBox href="/transactions" display="inline-flex" alignItems="center" gap="6px" color="fg.muted" fontSize="13px" mb="24px" _hover={{ color: "fg.default" }}>
        <ArrowLeft size={14} /> Back to transactions
      </NextLinkBox>

      <PageHeader title="Transaction details" />

      {isLoading ? (
        <Box h="300px" bg="surface.2" borderRadius="xl" style={{ animation: "pulse 1.5s ease-in-out infinite" }} />
      ) : txn ? (
        <Box>
          {/* Amount hero */}
          <Box
            bg="surface.2"
            border="1px solid"
            borderColor="surface.border"
            borderRadius="xl"
            p="32px"
            mb="20px"
            textAlign="center"
          >
            <Box
              w="56px"
              h="56px"
              borderRadius="full"
              mx="auto"
              mb="16px"
              bg={txn.type === "deposit" ? "rgba(16,185,129,0.1)" : txn.type === "withdrawal" ? "rgba(244,63,94,0.1)" : "rgba(90,96,245,0.1)"}
              display="flex"
              alignItems="center"
              justifyContent="center"
              color={txn.type === "deposit" ? "emerald.400" : txn.type === "withdrawal" ? "coral.400" : "brand.400"}
            >
              <ArrowLeftRight size={24} />
            </Box>

            <Text
              fontSize="40px"
              fontWeight="700"
              fontFamily="mono"
              letterSpacing="-1px"
              color={txn.type === "deposit" ? "emerald.400" : "coral.400"}
              mb="8px"
            >
              {txn.type === "deposit" ? "+" : "−"}
              {formatCurrency(txn.amount, txn.currency)}
            </Text>

            <Text fontSize="15px" color="fg.muted" mb="16px">{txn.description}</Text>

            <HStack gap="8px" justify="center">
              <TransactionTypeBadge type={txn.type} />
              <StatusBadge status={txn.status} />
            </HStack>
          </Box>

          {/* Detail rows */}
          <Box
            bg="surface.1"
            border="1px solid"
            borderColor="surface.border"
            borderRadius="xl"
            overflow="hidden"
          >
            <Text px="24px" py="16px" fontWeight="600" color="fg.default" borderBottom="1px solid" borderColor="surface.border">
              Transaction information
            </Text>
            {[
              { label: "Reference", value: txn.reference, mono: true },
              { label: "Date", value: formatDate(txn.date, "dd MMMM yyyy, HH:mm"), mono: false },
              { label: "Account", value: txn.accountId, mono: true },
              ...(txn.recipientName ? [{ label: "Recipient", value: txn.recipientName, mono: false }] : []),
              ...(txn.recipientAccount ? [{ label: "Recipient account", value: txn.recipientAccount, mono: true }] : []),
              { label: "Currency", value: txn.currency, mono: true },
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
                <Text fontSize="13px" fontWeight="500" color="fg.default" fontFamily={mono ? "mono" : "body"}>
                  {value}
                </Text>
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
