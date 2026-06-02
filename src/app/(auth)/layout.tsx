import { Box, Flex, Text, HStack } from "@chakra-ui/react";
import { Feather } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <Flex minH="100vh" bg="surface.0">
      {/* Left panel - branding */}
      <Box
        display={{ base: "none", lg: "flex" }}
        flexDirection="column"
        justifyContent="space-between"
        w="420px"
        flexShrink={0}
        bg="surface.1"
        borderRight="1px solid"
        borderColor="surface.border"
        p="40px"
        position="relative"
        overflow="hidden"
      >
        {/* Background decoration */}
        <Box
          position="absolute"
          top="-100px"
          left="-100px"
          w="400px"
          h="400px"
          borderRadius="full"
          bg="brand.900"
          opacity={0.3}
          pointerEvents="none"
        />
        <Box
          position="absolute"
          bottom="-80px"
          right="-80px"
          w="300px"
          h="300px"
          borderRadius="full"
          bg="brand.800"
          opacity={0.2}
          pointerEvents="none"
        />

        {/* Logo */}
        <HStack gap="10px" position="relative" zIndex={1}>
          <Box
            w="36px"
            h="36px"
            bg="brand.600"
            borderRadius="md"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Feather size={20} color="white" />
          </Box>
          <Text fontWeight="700" fontSize="19px" color="fg.default" letterSpacing="-0.3px">
            Eagle Bank
          </Text>
        </HStack>

        {/* Quote */}
        <Box position="relative" zIndex={1}>
          <Text
            fontSize="28px"
            fontWeight="700"
            color="fg.default"
            lineHeight="1.3"
            letterSpacing="-0.5px"
            mb="16px"
          >
            Banking built for the digital generation.
          </Text>
          <Text fontSize="14px" color="fg.muted" lineHeight="1.7">
            Secure, transparent, and always in your pocket. Eagle Bank puts you in control of your financial future.
          </Text>
        </Box>

        {/* Footer note */}
        <Text fontSize="12px" color="fg.subtle" position="relative" zIndex={1}>
          Protected by 256-bit encryption. FCA regulated.
        </Text>
      </Box>

      {/* Right panel - form */}
      <Flex
        flex={1}
        align="center"
        justify="center"
        p={{ base: "24px", sm: "32px", lg: "40px" }}
        w="full"
        minW={0}
      >
        <Box w="full" maxW="440px">
          {children}
        </Box>
      </Flex>
    </Flex>
  );
}
