import { Box, HStack, Text } from "@chakra-ui/react";
import { Feather } from "lucide-react";

/** Logo row shown on auth pages when the desktop branding panel is hidden */
export function AuthMobileBrand() {
  return (
    <HStack gap="10px" mb="24px" display={{ base: "flex", lg: "none" }}>
      <Box
        w="32px"
        h="32px"
        bg="brand.600"
        borderRadius="md"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Feather size={18} color="white" />
      </Box>
      <Text fontWeight="700" fontSize="17px" color="fg.default" letterSpacing="-0.3px">
        Eagle Bank
      </Text>
    </HStack>
  );
}
