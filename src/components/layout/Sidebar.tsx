"use client";

import { Box, VStack, HStack, Text, Avatar } from "@chakra-ui/react";
import { NextLinkBox } from "@/components/ui/NextLink";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CreditCard,
  ArrowLeftRight,
  User,
  LogOut,
  Feather,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { useRouter } from "next/navigation";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/accounts", label: "Accounts", icon: CreditCard },
  { href: "/transactions", label: "Transactions", icon: ArrowLeftRight },
  { href: "/profile", label: "Profile", icon: User },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  async function handleLogout() {
    await logout();
    toast({ title: "Signed out", status: "success" });
    router.push("/login");
  }

  return (
    <Box
      as="nav"
      w="240px"
      minH="100vh"
      bg="surface.1"
      borderRight="1px solid"
      borderColor="surface.border"
      display="flex"
      flexDirection="column"
      flexShrink={0}
      aria-label="Main navigation"
    >
      {/* Logo */}
      <Box
        px="24px"
        py="28px"
        borderBottom="1px solid"
        borderColor="surface.border"
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
          <Text
            fontWeight="700"
            fontSize="17px"
            letterSpacing="-0.3px"
            color="fg.default"
          >
            Eagle Bank
          </Text>
        </HStack>
      </Box>

      {/* Nav links */}
      <VStack gap="4px" p="16px" flex={1} align="stretch">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname.startsWith(href);
          return (
            <NextLinkBox
              key={href}
              href={href}
              display="flex"
              alignItems="center"
              gap="10px"
              px="12px"
              py="10px"
              borderRadius="lg"
              bg={isActive ? "rgba(90,96,245,0.12)" : "transparent"}
              color={isActive ? "brand.300" : "fg.muted"}
              fontWeight={isActive ? "600" : "500"}
              fontSize="14px"
              transition="all 0.15s"
              _hover={{
                bg: isActive ? "rgba(90,96,245,0.16)" : "surface.3",
                color: isActive ? "brand.300" : "fg.default",
              }}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon size={18} aria-hidden="true" />
              {label}
            </NextLinkBox>
          );
        })}
      </VStack>

      {/* User footer */}
      <Box p="16px" borderTop="1px solid" borderColor="surface.border">
        <HStack gap="10px" mb="12px">
          <Avatar.Root size="sm" w="36px" h="36px">
            <Avatar.Image src={user?.avatar} alt={user?.fullName} />
            <Avatar.Fallback bg="brand.800" color="brand.200" fontSize="13px">
              {user?.fullName?.slice(0, 2).toUpperCase()}
            </Avatar.Fallback>
          </Avatar.Root>
          <Box flex={1} minW={0}>
            <Text
              fontSize="13px"
              fontWeight="600"
              color="fg.default"
              maxLines={1}
            >
              {user?.fullName}
            </Text>
            <Text fontSize="11px" color="fg.subtle" maxLines={1}>
              {user?.email}
            </Text>
          </Box>
        </HStack>

        <Box
          as="button"
          onClick={handleLogout}
          display="flex"
          alignItems="center"
          gap="8px"
          w="full"
          px="12px"
          py="9px"
          borderRadius="lg"
          color="fg.subtle"
          fontSize="13px"
          fontWeight="500"
          bg="transparent"
          border="none"
          cursor="pointer"
          transition="all 0.15s"
          _hover={{ bg: "rgba(244,63,94,0.08)", color: "coral.400" }}
          aria-label="Sign out"
        >
          <LogOut size={16} aria-hidden="true" />
          Sign out
        </Box>
      </Box>
    </Box>
  );
}
