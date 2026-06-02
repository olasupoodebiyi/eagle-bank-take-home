"use client";

import {
  Box,
  Grid,
  Text,
  HStack,
  VStack,
  Skeleton,
} from "@chakra-ui/react";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  ArrowLeftRight,
  ArrowRight,
  CreditCard,
} from "lucide-react";
import { NextLinkBox } from "@/components/ui/NextLink";
import { useFetch } from "@/hooks/useFetch";
import { StatCard } from "@/components/ui/StatCard";
import { StatusBadge } from "@/components/ui/Badges";
import { ErrorState } from "@/components/feedback/States";
import { PageHeader } from "@/components/layout/PageHeader";
import {
  formatCurrency,
  formatDate,
  maskAccountNumber,
  accountTypeLabel,
} from "@/lib/utils";
import type { DashboardData } from "@/types";

export default function DashboardPage() {
  const { data, isLoading, error, refetch } =
    useFetch<DashboardData>("/api/dashboard");

  if (error) {
    return <ErrorState message={error} onRetry={refetch} />;
  }

  const user = data?.user;
  const stats = data?.stats;

  return (
    <Box>
      <PageHeader
        title={
          isLoading
            ? "Welcome back"
            : `Welcome back, ${user?.fullName?.split(" ")[0]} 👋`
        }
        subtitle="Here's what's happening with your money today."
      />

      {/* Stats grid */}
      <Grid
        templateColumns={{
          base: "1fr",
          md: "repeat(2, 1fr)",
          xl: "repeat(4, 1fr)",
        }}
        gap="16px"
        mb="32px"
      >
        <StatCard
          label="Total balance"
          value={
            stats ? formatCurrency(stats.totalBalance, stats.currency) : "—"
          }
          icon={Wallet}
          isLoading={isLoading}
          accentColor="brand.400"
        />
        <StatCard
          label="Current balance"
          value={
            stats ? formatCurrency(stats.currentBalance, stats.currency) : "—"
          }
          icon={CreditCard}
          isLoading={isLoading}
          accentColor="brand.300"
        />
        <StatCard
          label="Monthly deposits"
          value={
            stats ? formatCurrency(stats.monthlyDeposits, stats.currency) : "—"
          }
          subValue="This month"
          icon={TrendingUp}
          trend="up"
          isLoading={isLoading}
          accentColor="emerald.400"
        />
        <StatCard
          label="Monthly withdrawals"
          value={
            stats
              ? formatCurrency(stats.monthlyWithdrawals, stats.currency)
              : "—"
          }
          subValue="This month"
          icon={TrendingDown}
          trend="down"
          isLoading={isLoading}
          accentColor="coral.400"
        />
      </Grid>

      <Grid templateColumns={{ base: "1fr", xl: "1fr 340px" }} gap="24px">
        {/* Recent transactions */}
        <Box
          bg="surface.1"
          border="1px solid"
          borderColor="surface.border"
          borderRadius="xl"
          overflow="hidden"
        >
          <HStack
            justify="space-between"
            p="20px 24px"
            borderBottom="1px solid"
            borderColor="surface.border"
          >
            <Text fontWeight="600" fontSize="16px" color="fg.default">
              Recent transactions
            </Text>
            <NextLinkBox
              href="/transactions"
              fontSize="13px"
              color="brand.300"
              fontWeight="500"
              _hover={{ color: "brand.200" }}
              display="flex"
              alignItems="center"
              gap="4px"
            >
              View all <ArrowRight size={14} />
            </NextLinkBox>
          </HStack>

          <VStack
            gap={0}
            align="stretch"
            divideY="1px"
            divideColor="surface.border"
          >
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <HStack key={i} p="16px 24px" justify="space-between">
                  <HStack gap="12px">
                    <Skeleton w="36px" h="36px" borderRadius="md" />
                    <VStack gap="4px" align="flex-start">
                      <Skeleton h="14px" w="140px" borderRadius="sm" />
                      <Skeleton h="11px" w="80px" borderRadius="sm" />
                    </VStack>
                  </HStack>
                  <Skeleton h="16px" w="70px" borderRadius="sm" />
                </HStack>
              ))
            ) : data?.recentTransactions.length === 0 ? (
              <Box p="40px" textAlign="center">
                <Text color="fg.subtle" fontSize="14px">
                  No recent transactions
                </Text>
              </Box>
            ) : (
              data?.recentTransactions.map((txn) => (
                <NextLinkBox
                  key={txn.id}
                  href={`/transactions/${txn.id}`}
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  p="14px 24px"
                  transition="background 0.15s"
                  _hover={{ bg: "surface.2" }}
                >
                  <HStack gap="12px">
                    <Box
                      w="36px"
                      h="36px"
                      borderRadius="md"
                      bg={
                        txn.type === "deposit"
                          ? "rgba(16,185,129,0.1)"
                          : txn.type === "withdrawal"
                            ? "rgba(244,63,94,0.1)"
                            : "rgba(90,96,245,0.1)"
                      }
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      color={
                        txn.type === "deposit"
                          ? "emerald.400"
                          : txn.type === "withdrawal"
                            ? "coral.400"
                            : "brand.400"
                      }
                      flexShrink={0}
                    >
                      <ArrowLeftRight size={16} />
                    </Box>
                    <Box>
                      <Text
                        fontSize="14px"
                        fontWeight="500"
                        color="fg.default"
                        maxLines={1}
                        maxW="200px"
                      >
                        {txn.description}
                      </Text>
                      <Text fontSize="12px" color="fg.subtle">
                        {formatDate(txn.date)}
                      </Text>
                    </Box>
                  </HStack>
                  <Box textAlign="right">
                    <Text
                      fontSize="14px"
                      fontWeight="600"
                      fontFamily="mono"
                      color={
                        txn.type === "deposit" ? "emerald.400" : "coral.400"
                      }
                    >
                      {txn.type === "deposit" ? "+" : "−"}
                      {formatCurrency(txn.amount, txn.currency)}
                    </Text>
                    <StatusBadge status={txn.status} />
                  </Box>
                </NextLinkBox>
              ))
            )}
          </VStack>
        </Box>

        {/* Right column */}
        <VStack gap="24px" align="stretch">
          {/* Quick actions */}
          <Box
            bg="surface.1"
            border="1px solid"
            borderColor="surface.border"
            borderRadius="xl"
            p="20px 24px"
          >
            <Text fontWeight="600" fontSize="16px" color="fg.default" mb="16px">
              Quick actions
            </Text>
            <VStack gap="8px" align="stretch">
              {[
                {
                  label: "New transfer",
                  icon: ArrowLeftRight,
                  href: "/transactions",
                },
                { label: "View accounts", icon: CreditCard, href: "/accounts" },
              ].map(({ label, icon: Icon, href }) => (
                <NextLinkBox
                  key={label}
                  href={href}
                  display="flex"
                  alignItems="center"
                  gap="10px"
                  p="12px 14px"
                  bg="surface.2"
                  borderRadius="lg"
                  border="1px solid"
                  borderColor="surface.border"
                  color="fg.default"
                  fontSize="14px"
                  fontWeight="500"
                  transition="all 0.15s"
                  _hover={{
                    bg: "surface.3",
                    borderColor: "surface.borderHover",
                  }}
                >
                  <Box
                    p="7px"
                    bg="surface.3"
                    borderRadius="md"
                    color="brand.400"
                  >
                    <Icon size={15} />
                  </Box>
                  {label}
                </NextLinkBox>
              ))}
            </VStack>
          </Box>

          {/* Accounts summary */}
          <Box
            bg="surface.1"
            border="1px solid"
            borderColor="surface.border"
            borderRadius="xl"
            overflow="hidden"
          >
            <HStack
              justify="space-between"
              p="20px 24px"
              borderBottom="1px solid"
              borderColor="surface.border"
            >
              <Text fontWeight="600" fontSize="16px" color="fg.default">
                My accounts
              </Text>
              <NextLinkBox
                href="/accounts"
                fontSize="13px"
                color="brand.300"
                fontWeight="500"
                _hover={{ color: "brand.200" }}
              >
                <ArrowRight size={14} />
              </NextLinkBox>
            </HStack>

            <VStack gap={0} align="stretch">
              {isLoading
                ? Array.from({ length: 2 }).map((_, i) => (
                    <HStack key={i} p="14px 24px" justify="space-between">
                      <VStack gap="4px" align="flex-start">
                        <Skeleton h="14px" w="100px" borderRadius="sm" />
                        <Skeleton h="11px" w="130px" borderRadius="sm" />
                      </VStack>
                      <Skeleton h="18px" w="80px" borderRadius="sm" />
                    </HStack>
                  ))
                : data?.accounts.map((acc) => (
                    <NextLinkBox
                      key={acc.id}
                      href={`/accounts/${acc.id}`}
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                      p="14px 24px"
                      _hover={{ bg: "surface.2" }}
                      transition="background 0.15s"
                      borderBottom="1px solid"
                      borderColor="surface.border"
                      _last={{ borderBottom: "none" }}
                    >
                      <Box>
                        <Text
                          fontSize="13px"
                          fontWeight="600"
                          color="fg.default"
                        >
                          {accountTypeLabel(acc.type)}
                        </Text>
                        <Text
                          fontSize="11px"
                          color="fg.subtle"
                          fontFamily="mono"
                        >
                          {maskAccountNumber(acc.accountNumber)}
                        </Text>
                      </Box>
                      <Text
                        fontSize="14px"
                        fontWeight="700"
                        fontFamily="mono"
                        color={acc.balance < 0 ? "coral.400" : "fg.default"}
                      >
                        {formatCurrency(acc.balance, acc.currency)}
                      </Text>
                    </NextLinkBox>
                  ))}
            </VStack>
          </Box>
        </VStack>
      </Grid>
    </Box>
  );
}
