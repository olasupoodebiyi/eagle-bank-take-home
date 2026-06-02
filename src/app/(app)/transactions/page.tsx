"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Text,
  HStack,
  Input,
  Select,
  Table,
  VStack,
  Skeleton,
  Portal,
  createListCollection,
} from "@chakra-ui/react";
import { ArrowUpDown, Filter, ChevronLeft, ChevronRight, ArrowLeftRight } from "lucide-react";
import { useFetch } from "@/hooks/useFetch";
import { TransactionTypeBadge, StatusBadge } from "@/components/ui/Badges";
import { EmptyState, ErrorState } from "@/components/feedback/States";
import { PageHeader } from "@/components/layout/PageHeader";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { PaginatedResponse, Transaction, TransactionType } from "@/types";

interface Filters {
  startDate: string;
  endDate: string;
  type: TransactionType | "all";
  sortBy: "date" | "amount";
  sortOrder: "asc" | "desc";
  page: number;
}

const typeCollection = createListCollection({
  items: [
    { label: "All types", value: "all" },
    { label: "Deposit", value: "deposit" },
    { label: "Withdrawal", value: "withdrawal" },
    { label: "Transfer", value: "transfer" },
  ],
});

function buildUrl(filters: Filters): string {
  const params = new URLSearchParams();
  if (filters.startDate) params.set("startDate", filters.startDate);
  if (filters.endDate) params.set("endDate", filters.endDate);
  if (filters.type !== "all") params.set("type", filters.type);
  params.set("sortBy", filters.sortBy);
  params.set("sortOrder", filters.sortOrder);
  params.set("page", String(filters.page));
  params.set("limit", "10");
  return `/api/transactions?${params.toString()}`;
}

export default function TransactionsPage() {
  const router = useRouter();
  const [filters, setFilters] = useState<Filters>({
    startDate: "",
    endDate: "",
    type: "all",
    sortBy: "date",
    sortOrder: "desc",
    page: 1,
  });

  const url = buildUrl(filters);
  const { data, isLoading, error, refetch } = useFetch<PaginatedResponse<Transaction>>(url);

  const updateFilter = useCallback(
    <K extends keyof Filters>(key: K, value: Filters[K]) => {
      setFilters((prev) => ({ ...prev, [key]: value, page: key !== "page" ? 1 : prev.page }));
    },
    []
  );

  const toggleSort = useCallback((field: "date" | "amount") => {
    setFilters((prev) => ({
      ...prev,
      sortBy: field,
      sortOrder: prev.sortBy === field && prev.sortOrder === "desc" ? "asc" : "desc",
      page: 1,
    }));
  }, []);

  if (error) {
    return <ErrorState message={error} onRetry={refetch} />;
  }

  const transactions = data?.data ?? [];
  const totalPages = data?.totalPages ?? 1;

  return (
    <Box>
      <PageHeader
        title="Transactions"
        subtitle="Your complete transaction history across all accounts."
      />

      {/* Filters */}
      <Box
        bg="surface.1"
        border="1px solid"
        borderColor="surface.border"
        borderRadius="xl"
        p="16px 20px"
        mb="20px"
      >
        <HStack gap="12px" flexWrap="wrap">
          <HStack gap="6px" color="fg.subtle">
            <Filter size={14} />
            <Text fontSize="12px" fontWeight="500">Filters</Text>
          </HStack>

          <Input
            type="date"
            value={filters.startDate}
            onChange={(e) => updateFilter("startDate", e.target.value)}
            placeholder="From date"
            size="sm"
            w="160px"
            bg="surface.2"
            border="1px solid"
            borderColor="surface.border"
            color="fg.default"
            borderRadius="lg"
            fontSize="13px"
            aria-label="Filter from date"
            _focus={{ borderColor: "brand.400", outline: "none" }}
          />
          <Input
            type="date"
            value={filters.endDate}
            onChange={(e) => updateFilter("endDate", e.target.value)}
            placeholder="To date"
            size="sm"
            w="160px"
            bg="surface.2"
            border="1px solid"
            borderColor="surface.border"
            color="fg.default"
            borderRadius="lg"
            fontSize="13px"
            aria-label="Filter to date"
            _focus={{ borderColor: "brand.400", outline: "none" }}
          />

          <Select.Root
            collection={typeCollection}
            value={[filters.type]}
            onValueChange={({ value }) => updateFilter("type", value[0] as TransactionType | "all")}
            size="sm"
            w="160px"
          >
            <Select.HiddenSelect />
            <Select.Control>
              <Select.Trigger
                bg="surface.2"
                border="1px solid"
                borderColor="surface.border"
                borderRadius="lg"
                color="fg.default"
                fontSize="13px"
                aria-label="Filter by transaction type"
              >
                <Select.ValueText placeholder="All types" />
              </Select.Trigger>
              <Select.IndicatorGroup>
                <Select.Indicator />
              </Select.IndicatorGroup>
            </Select.Control>
            <Portal>
              <Select.Positioner>
                <Select.Content bg="surface.2" borderColor="surface.border">
                  {typeCollection.items.map((item) => (
                    <Select.Item key={item.value} item={item} color="fg.default" _hover={{ bg: "surface.3" }}>
                      <Select.ItemText>{item.label}</Select.ItemText>
                      <Select.ItemIndicator />
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Positioner>
            </Portal>
          </Select.Root>

          {(filters.startDate || filters.endDate || filters.type !== "all") && (
            <Box
              as="button"
              fontSize="12px"
              color="coral.400"
              fontWeight="500"
              cursor="pointer"
              bg="transparent"
              border="none"
              onClick={() => setFilters({ startDate: "", endDate: "", type: "all", sortBy: "date", sortOrder: "desc", page: 1 })}
              _hover={{ color: "coral.300" }}
            >
              Clear all
            </Box>
          )}
        </HStack>
      </Box>

      {/* Table */}
      <Box
        bg="surface.1"
        border="1px solid"
        borderColor="surface.border"
        borderRadius="xl"
        overflow="hidden"
      >
        <Box overflowX="auto">
          <Table.Root>
            <Table.Header>
              <Table.Row bg="surface.2">
                <Table.ColumnHeader px="24px" py="14px" fontSize="12px" color="fg.subtle" fontWeight="600" letterSpacing="0.5px" textTransform="uppercase">
                  Description
                </Table.ColumnHeader>
                <Table.ColumnHeader px="16px" py="14px" fontSize="12px" color="fg.subtle" fontWeight="600" letterSpacing="0.5px" textTransform="uppercase">
                  Type
                </Table.ColumnHeader>
                <Table.ColumnHeader
                  px="16px"
                  py="14px"
                  fontSize="12px"
                  color="fg.subtle"
                  fontWeight="600"
                  letterSpacing="0.5px"
                  textTransform="uppercase"
                  cursor="pointer"
                  onClick={() => toggleSort("date")}
                  _hover={{ color: "fg.default" }}
                  userSelect="none"
                >
                  <HStack gap="4px">
                    Date
                    <ArrowUpDown size={12} color={filters.sortBy === "date" ? "#9ea7ff" : undefined} />
                  </HStack>
                </Table.ColumnHeader>
                <Table.ColumnHeader
                  px="16px"
                  py="14px"
                  fontSize="12px"
                  color="fg.subtle"
                  fontWeight="600"
                  letterSpacing="0.5px"
                  textTransform="uppercase"
                  cursor="pointer"
                  onClick={() => toggleSort("amount")}
                  _hover={{ color: "fg.default" }}
                  userSelect="none"
                  textAlign="right"
                >
                  <HStack gap="4px" justify="flex-end">
                    Amount
                    <ArrowUpDown size={12} color={filters.sortBy === "amount" ? "#9ea7ff" : undefined} />
                  </HStack>
                </Table.ColumnHeader>
                <Table.ColumnHeader px="24px" py="14px" fontSize="12px" color="fg.subtle" fontWeight="600" letterSpacing="0.5px" textTransform="uppercase">
                  Status
                </Table.ColumnHeader>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {isLoading
                ? Array.from({ length: 8 }).map((_, i) => (
                    <Table.Row key={i} borderColor="surface.border">
                      <Table.Cell px="24px" py="16px">
                        <VStack gap="4px" align="flex-start">
                          <Skeleton h="14px" w="200px" borderRadius="sm" />
                          <Skeleton h="11px" w="80px" borderRadius="sm" />
                        </VStack>
                      </Table.Cell>
                      <Table.Cell px="16px"><Skeleton h="20px" w="80px" borderRadius="md" /></Table.Cell>
                      <Table.Cell px="16px"><Skeleton h="14px" w="90px" borderRadius="sm" /></Table.Cell>
                      <Table.Cell px="16px" textAlign="right"><Skeleton h="14px" w="70px" borderRadius="sm" ml="auto" /></Table.Cell>
                      <Table.Cell px="24px"><Skeleton h="20px" w="70px" borderRadius="md" /></Table.Cell>
                    </Table.Row>
                  ))
                : transactions.length === 0
                  ? (
                    <Table.Row>
                      <Table.Cell colSpan={5}>
                        <EmptyState
                          title="No transactions found"
                          description="No transactions match your current filters. Try adjusting your date range or type filter."
                          icon={<ArrowLeftRight size={28} />}
                          action={{ label: "Clear filters", onClick: () => setFilters({ startDate: "", endDate: "", type: "all", sortBy: "date", sortOrder: "desc", page: 1 }) }}
                        />
                      </Table.Cell>
                    </Table.Row>
                  )
                  : transactions.map((txn) => (
                      <Table.Row
                        key={txn.id}
                        borderColor="surface.border"
                        transition="background 0.15s"
                        _hover={{ bg: "surface.2" }}
                      >
                        <Table.Cell px="24px" py="16px">
                          <Box
                            as="button"
                            type="button"
                            display="block"
                            w="full"
                            textAlign="left"
                            borderRadius="md"
                            bg="transparent"
                            border="none"
                            cursor="pointer"
                            p="0"
                            onClick={() => router.push(`/transactions/${txn.id}`)}
                          >
                            <Text fontSize="14px" fontWeight="500" color="fg.default" lineClamp={1} maxW="240px">
                              {txn.description}
                            </Text>
                            {txn.recipientName && (
                              <Text fontSize="12px" color="fg.subtle" mt="2px">
                                {txn.recipientName}
                              </Text>
                            )}
                          </Box>
                        </Table.Cell>
                        <Table.Cell px="16px">
                          <TransactionTypeBadge type={txn.type} />
                        </Table.Cell>
                        <Table.Cell px="16px">
                          <Text fontSize="13px" color="fg.muted">{formatDate(txn.date)}</Text>
                        </Table.Cell>
                        <Table.Cell px="16px" textAlign="right">
                          <Text
                            fontSize="14px"
                            fontWeight="600"
                            fontFamily="mono"
                            color={txn.type === "deposit" ? "emerald.400" : "coral.400"}
                          >
                            {txn.type === "deposit" ? "+" : "−"}
                            {formatCurrency(txn.amount, txn.currency)}
                          </Text>
                        </Table.Cell>
                        <Table.Cell px="24px">
                          <StatusBadge status={txn.status} />
                        </Table.Cell>
                      </Table.Row>
                    ))}
            </Table.Body>
          </Table.Root>
        </Box>

        {/* Pagination */}
        {!isLoading && data && data.total > 0 && (
          <HStack
            justify="space-between"
            px="24px"
            py="14px"
            borderTop="1px solid"
            borderColor="surface.border"
          >
            <Text fontSize="13px" color="fg.subtle">
              Showing {(filters.page - 1) * 10 + 1}–{Math.min(filters.page * 10, data.total)} of {data.total}
            </Text>
            <HStack gap="6px">
              <Box
                asChild
                p="6px 10px"
                bg="surface.2"
                border="1px solid"
                borderColor="surface.border"
                borderRadius="md"
                color={filters.page <= 1 ? "fg.subtle" : "fg.default"}
                cursor={filters.page <= 1 ? "not-allowed" : "pointer"}
                _hover={filters.page > 1 ? { bg: "surface.3" } : undefined}
                fontSize="13px"
              >
                <button
                  onClick={() => updateFilter("page", filters.page - 1)}
                  disabled={filters.page <= 1}
                  aria-label="Previous page"
                >
                  <ChevronLeft size={16} />
                </button>
              </Box>
              <Text fontSize="13px" color="fg.muted" px="8px">
                {filters.page} / {totalPages}
              </Text>
              <Box
                asChild
                p="6px 10px"
                bg="surface.2"
                border="1px solid"
                borderColor="surface.border"
                borderRadius="md"
                color={filters.page >= totalPages ? "fg.subtle" : "fg.default"}
                cursor={filters.page >= totalPages ? "not-allowed" : "pointer"}
                _hover={filters.page < totalPages ? { bg: "surface.3" } : undefined}
                fontSize="13px"
              >
                <button
                  onClick={() => updateFilter("page", filters.page + 1)}
                  disabled={filters.page >= totalPages}
                  aria-label="Next page"
                >
                  <ChevronRight size={16} />
                </button>
              </Box>
            </HStack>
          </HStack>
        )}
      </Box>
    </Box>
  );
}
