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
      align={{ base: "flex-start", sm: "flex-end" }}
      mb={{ base: "20px", lg: "32px" }}
      flexWrap="wrap"
      gap="12px"
      flexDirection={{ base: "column", sm: "row" }}
    >
      <Box minW={0} flex={1}>
        <Text
          fontSize={{ base: "20px", sm: "24px" }}
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
