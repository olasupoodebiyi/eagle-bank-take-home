"use client";

import { Box, Text, HStack } from "@chakra-ui/react";
import { CheckCircle, AlertCircle, Info, AlertTriangle, X } from "lucide-react";
import { useToast, type ToastStatus } from "@/context/ToastContext";

const icons: Record<ToastStatus, React.ReactNode> = {
  success: <CheckCircle size={18} />,
  error: <AlertCircle size={18} />,
  info: <Info size={18} />,
  warning: <AlertTriangle size={18} />,
};

const colors: Record<ToastStatus, string> = {
  success: "emerald.500",
  error: "coral.500",
  info: "brand.400",
  warning: "#f59e0b",
};

export function ToastContainer() {
  const { toasts, dismiss } = useToast();

  return (
    <Box
      position="fixed"
      bottom="24px"
      right="24px"
      zIndex={9999}
      display="flex"
      flexDirection="column"
      gap="10px"
      pointerEvents="none"
    >
      {toasts.map((toast) => (
        <Box
          key={toast.id}
          bg="surface.2"
          border="1px solid"
          borderColor="surface.border"
          borderRadius="lg"
          p="14px 16px"
          minW="300px"
          maxW="400px"
          pointerEvents="auto"
          boxShadow="0 20px 60px rgba(0,0,0,0.5)"
          style={{
            animation: "slideInRight 0.25s ease",
          }}
        >
          <HStack gap="10px" align="flex-start">
            <Box color={colors[toast.status]} mt="1px" flexShrink={0}>
              {icons[toast.status]}
            </Box>
            <Box flex={1}>
              <Text fontWeight="600" fontSize="14px" color="fg.default" lineHeight="1.4">
                {toast.title}
              </Text>
              {toast.description && (
                <Text fontSize="13px" color="fg.muted" mt="2px" lineHeight="1.5">
                  {toast.description}
                </Text>
              )}
            </Box>
            <Box
              as="button"
              onClick={() => dismiss(toast.id)}
              color="fg.subtle"
              _hover={{ color: "fg.default" }}
              transition="color 0.15s"
              flexShrink={0}
              cursor="pointer"
              aria-label="Dismiss notification"
            >
              <X size={16} />
            </Box>
          </HStack>
        </Box>
      ))}

      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(120%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </Box>
  );
}
