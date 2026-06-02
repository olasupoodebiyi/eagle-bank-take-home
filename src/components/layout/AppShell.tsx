"use client";

import { Suspense, useState } from "react";
import { Box, Flex, HStack, Text, Drawer, IconButton } from "@chakra-ui/react";
import { Menu, Feather } from "lucide-react";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { SidebarContent } from "./Sidebar";

type AppShellProps = {
  children: React.ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <Flex minH="100vh" bg="surface.0" direction={{ base: "column", lg: "row" }}>
      <HStack
        display={{ base: "flex", lg: "none" }}
        px="16px"
        py="12px"
        bg="surface.1"
        borderBottom="1px solid"
        borderColor="surface.border"
        justify="space-between"
        flexShrink={0}
        position="sticky"
        top={0}
        zIndex="sticky"
      >
        <HStack gap="10px">
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
          <Text fontWeight="700" fontSize="16px" color="fg.default" letterSpacing="-0.3px">
            Eagle Bank
          </Text>
        </HStack>
        <IconButton
          aria-label="Open navigation menu"
          variant="ghost"
          size="sm"
          color="fg.default"
          onClick={() => setMenuOpen(true)}
          _hover={{ bg: "surface.3" }}
        >
          <Menu size={22} aria-hidden="true" />
        </IconButton>
      </HStack>

      <Box display={{ base: "none", lg: "block" }} flexShrink={0}>
        <Suspense fallback={null}>
          <SidebarContent />
        </Suspense>
      </Box>

      <Drawer.Root
        open={menuOpen}
        onOpenChange={(details) => setMenuOpen(details.open)}
        placement="start"
      >
        <Drawer.Backdrop bg="blackAlpha.600" />
        <Drawer.Positioner>
          <Drawer.Content
            bg="surface.1"
            maxW="min(280px, 85vw)"
            h="full"
            borderRight="1px solid"
            borderColor="surface.border"
          >
            <Drawer.Body p={0} overflowY="auto">
              <Suspense fallback={null}>
                <SidebarContent onNavigate={() => setMenuOpen(false)} />
              </Suspense>
            </Drawer.Body>
          </Drawer.Content>
        </Drawer.Positioner>
      </Drawer.Root>

      <Box
        as="main"
        flex={1}
        p={{ base: "16px", sm: "24px", lg: "40px" }}
        overflowY="auto"
        minH={{ base: "auto", lg: "100vh" }}
        w="full"
        minW={0}
        aria-label="Main content"
      >
        <Box maxW="1200px" mx="auto" w="full">
          <RequireAuth>{children}</RequireAuth>
        </Box>
      </Box>
    </Flex>
  );
}
