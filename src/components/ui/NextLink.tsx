"use client";

import NextLink from "next/link";
import { Box, Button, type BoxProps, type ButtonProps } from "@chakra-ui/react";
import type { ComponentProps } from "react";

type Href = ComponentProps<typeof NextLink>["href"];

export type NextLinkBoxProps = Omit<BoxProps, "as" | "asChild"> & {
  href: Href;
};

export function NextLinkBox({ href, children, ...props }: NextLinkBoxProps) {
  return (
    <Box asChild {...props}>
      <NextLink href={href}>{children}</NextLink>
    </Box>
  );
}

export type NextLinkButtonProps = Omit<ButtonProps, "as" | "asChild"> & {
  href: Href;
};

export function NextLinkButton({ href, children, ...props }: NextLinkButtonProps) {
  return (
    <Button asChild {...props}>
      <NextLink href={href}>{children}</NextLink>
    </Button>
  );
}
