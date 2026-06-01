"use client";

import { Box, Text, HStack, Skeleton } from "@chakra-ui/react";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string;
  subValue?: string;
  icon: LucideIcon;
  trend?: "up" | "down" | "neutral";
  isLoading?: boolean;
  accentColor?: string;
}

export function StatCard({
  label,
  value,
  subValue,
  icon: Icon,
  trend,
  isLoading,
  accentColor = "brand.400",
}: StatCardProps) {
  const trendColor =
    trend === "up"
      ? "emerald.400"
      : trend === "down"
        ? "coral.400"
        : "fg.muted";

  return (
    <Box
      bg="surface.2"
      border="1px solid"
      borderColor="surface.border"
      borderRadius="xl"
      p="20px 24px"
      position="relative"
      overflow="hidden"
      transition="border-color 0.2s, transform 0.2s"
      _hover={{ borderColor: "surface.borderHover", transform: "translateY(-1px)" }}
    >
      {/* Glow accent */}
      <Box
        position="absolute"
        top="-30px"
        right="-30px"
        w="120px"
        h="120px"
        borderRadius="full"
        bg={accentColor}
        opacity={0.06}
        pointerEvents="none"
      />

      <HStack justify="space-between" align="flex-start" mb="16px">
        <Text fontSize="13px" color="fg.muted" fontWeight="500" letterSpacing="0.5px">
          {label}
        </Text>
        <Box
          p="8px"
          bg="surface.3"
          borderRadius="md"
          color={accentColor}
        >
          <Icon size={16} />
        </Box>
      </HStack>

      {isLoading ? (
        <>
          <Skeleton height="32px" width="140px" mb="6px" borderRadius="md" />
          <Skeleton height="16px" width="80px" borderRadius="md" />
        </>
      ) : (
        <>
          <Text
            fontSize="26px"
            fontWeight="700"
            color="fg.default"
            lineHeight="1.2"
            letterSpacing="-0.5px"
            mb="4px"
            fontFamily="mono"
          >
            {value}
          </Text>
          {subValue && (
            <Text fontSize="12px" color={trendColor} fontWeight="500">
              {subValue}
            </Text>
          )}
        </>
      )}
    </Box>
  );
}
