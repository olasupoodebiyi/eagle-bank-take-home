import { Box, Text, Button, VStack } from "@chakra-ui/react";
import { Inbox, AlertCircle, RefreshCcw } from "lucide-react";
import { getSessionAwareErrorState } from "@/lib/auth-session";

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ title, description, icon, action }: EmptyStateProps) {
  return (
    <VStack
      gap="16px"
      py="60px"
      px="24px"
      align="center"
      justify="center"
      w="full"
    >
      <Box
        p="20px"
        bg="surface.3"
        borderRadius="full"
        color="fg.subtle"
      >
        {icon ?? <Inbox size={28} />}
      </Box>
      <VStack gap="6px" textAlign="center">
        <Text fontWeight="600" fontSize="16px" color="fg.default">
          {title}
        </Text>
        {description && (
          <Text fontSize="14px" color="fg.muted" maxW="340px" lineHeight="1.6">
            {description}
          </Text>
        )}
      </VStack>
      {action && (
        <Button
          size="sm"
          variant="outline"
          onClick={action.onClick}
          borderColor="surface.border"
          color="fg.default"
          _hover={{ bg: "surface.3" }}
          mt="4px"
        >
          {action.label}
        </Button>
      )}
    </VStack>
  );
}

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export function ErrorState({
  title,
  message,
  onRetry,
}: ErrorStateProps) {
  const resolved = getSessionAwareErrorState(message);
  const displayTitle = title ?? resolved.title;
  const displayMessage = resolved.message;
  const showRetry = resolved.showRetry && onRetry;

  return (
    <VStack gap="16px" py="48px" px="24px" align="center" justify="center" w="full">
      <Box p="16px" bg="rgba(244,63,94,0.1)" borderRadius="full" color="coral.400">
        <AlertCircle size={28} />
      </Box>
      <VStack gap="6px" textAlign="center">
        <Text fontWeight="600" fontSize="16px" color="fg.default">
          {displayTitle}
        </Text>
        <Text fontSize="14px" color="fg.muted" maxW="360px" lineHeight="1.6">
          {displayMessage}
        </Text>
      </VStack>
      {showRetry && (
        <Button
          size="sm"
          onClick={onRetry}
          bg="surface.3"
          color="fg.default"
          _hover={{ bg: "surface.4" }}
        >
          <RefreshCcw size={14} />
          Try again
        </Button>
      )}
    </VStack>
  );
}

export function PageSkeleton() {
  return (
    <Box p="8" w="full" aria-label="Loading content" aria-busy="true">
      <Box h="8" bg="surface.3" borderRadius="md" mb="6" w="40%" />
      <Box h="4" bg="surface.3" borderRadius="md" mb="3" w="70%" />
      <Box h="4" bg="surface.3" borderRadius="md" mb="3" w="50%" />
    </Box>
  );
}
