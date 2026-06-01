import { Box, Text, HStack } from "@chakra-ui/react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export function PageHeader({ title, subtitle, actions }: PageHeaderProps) {
  return (
    <HStack
      justify="space-between"
      align="flex-end"
      mb="32px"
      flexWrap="wrap"
      gap="16px"
    >
      <Box>
        <Text
          fontSize="24px"
          fontWeight="700"
          color="fg.default"
          letterSpacing="-0.5px"
          lineHeight="1.2"
        >
          {title}
        </Text>
        {subtitle && (
          <Text fontSize="14px" color="fg.muted" mt="4px">
            {subtitle}
          </Text>
        )}
      </Box>
      {actions && <Box>{actions}</Box>}
    </HStack>
  );
}
