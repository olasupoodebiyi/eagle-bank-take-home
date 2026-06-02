import { Suspense } from "react";
import { Box, Flex } from "@chakra-ui/react";
import { Sidebar } from "@/components/layout/Sidebar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <Flex minH="100vh" bg="surface.0">
      <Suspense fallback={null}>
        <Sidebar />
      </Suspense>
      <Box
        as="main"
        flex={1}
        p="40px"
        overflowY="auto"
        minH="100vh"
        aria-label="Main content"
      >
        <Box maxW="1200px" mx="auto">
          {children}
        </Box>
      </Box>
    </Flex>
  );
}
