"use client";

import { Box, Text, VStack, Button } from "@chakra-ui/react";
import { AlertCircle, RefreshCcw } from "lucide-react";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Uncaught error:", error);
  }, [error]);

  return (
    <Box
      minH="80vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      p="40px"
    >
      <VStack gap="20px" textAlign="center">
        <Box p="20px" bg="rgba(244,63,94,0.08)" borderRadius="full" color="coral.400">
          <AlertCircle size={40} />
        </Box>
        <VStack gap="8px">
          <Text fontSize="22px" fontWeight="700" color="fg.default" letterSpacing="-0.3px">
            Something went wrong
          </Text>
          <Text fontSize="14px" color="fg.muted" maxW="380px" lineHeight="1.7">
            An unexpected error occurred. Our team has been notified. Please try refreshing.
          </Text>
        </VStack>
        <Button
          onClick={reset}
          bg="surface.2"
          color="fg.default"
          borderRadius="lg"
          h="42px"
          px="24px"
          _hover={{ bg: "surface.3" }}
          fontWeight="600"
        >
          <RefreshCcw size={15} style={{ marginRight: "8px" }} />
          Try again
        </Button>
      </VStack>
    </Box>
  );
}
