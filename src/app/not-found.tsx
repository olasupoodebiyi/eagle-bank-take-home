import { Box, Text, VStack } from "@chakra-ui/react";
import { NextLinkButton } from "@/components/ui/NextLink";

export default function NotFound() {
  return (
    <Box
      minH="100vh"
      bg="surface.0"
      display="flex"
      alignItems="center"
      justifyContent="center"
      p="40px"
    >
      <VStack gap="20px" textAlign="center">
        <Text
          fontSize={{ base: "80px", md: "120px" }}
          fontWeight="700"
          letterSpacing="-4px"
          color="surface.border"
          lineHeight="1"
          fontFamily="mono"
        >
          404
        </Text>
        <VStack gap="8px">
          <Text fontSize="24px" fontWeight="700" color="fg.default" letterSpacing="-0.5px">
            Page not found
          </Text>
          <Text fontSize="15px" color="fg.muted" maxW="380px" lineHeight="1.6">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </Text>
        </VStack>
        <NextLinkButton
          href="/dashboard"
          bg="brand.600"
          color="white"
          fontWeight="600"
          borderRadius="lg"
          h="44px"
          px="28px"
          _hover={{ bg: "brand.500" }}
        >
          Go to dashboard
        </NextLinkButton>
      </VStack>
    </Box>
  );
}
