"use client";

import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";

const config = defineConfig({
  theme: {
    tokens: {
      colors: {
        // Brand: deep indigo/violet
        brand: {
          50: { value: "#eef0ff" },
          100: { value: "#dde2ff" },
          200: { value: "#c4caff" },
          300: { value: "#9ea7ff" },
          400: { value: "#7480ff" },
          500: { value: "#5a60f5" },
          600: { value: "#4740e8" },
          700: { value: "#3c34cf" },
          800: { value: "#3130a7" },
          900: { value: "#2c2e84" },
          950: { value: "#1a1b50" },
        },
        // Accent: electric emerald for positive
        emerald: {
          400: { value: "#34d399" },
          500: { value: "#10b981" },
          600: { value: "#059669" },
        },
        // Coral for negative / warnings
        coral: {
          400: { value: "#fb7185" },
          500: { value: "#f43f5e" },
          600: { value: "#e11d48" },
        },
        // Surface hierarchy
        surface: {
          0: { value: "#0d0e1a" },
          1: { value: "#12132a" },
          2: { value: "#1a1c35" },
          3: { value: "#21243f" },
          4: { value: "#2a2e52" },
          border: { value: "#2e3260" },
          borderHover: { value: "#4040a0" },
        },
      },
      fonts: {
        heading: { value: "'DM Sans', sans-serif" },
        body: { value: "'DM Sans', sans-serif" },
        mono: { value: "'JetBrains Mono', monospace" },
      },
      radii: {
        sm: { value: "6px" },
        md: { value: "10px" },
        lg: { value: "14px" },
        xl: { value: "20px" },
      },
    },
    semanticTokens: {
      colors: {
        bg: {
          default: { value: "{colors.surface.0}" },
          subtle: { value: "{colors.surface.1}" },
          muted: { value: "{colors.surface.2}" },
          emphasized: { value: "{colors.surface.3}" },
        },
        border: {
          default: { value: "{colors.surface.border}" },
          hover: { value: "{colors.surface.borderHover}" },
        },
        fg: {
          default: { value: "#e8e9f3" },
          muted: { value: "#9193b0" },
          subtle: { value: "#60628a" },
        },
        accent: {
          solid: { value: "{colors.brand.500}" },
          muted: { value: "{colors.brand.900}" },
          text: { value: "{colors.brand.300}" },
        },
        positive: {
          solid: { value: "{colors.emerald.500}" },
          text: { value: "{colors.emerald.400}" },
        },
        negative: {
          solid: { value: "{colors.coral.500}" },
          text: { value: "{colors.coral.400}" },
        },
      },
    },
  },
  globalCss: {
    "*": {
      boxSizing: "border-box",
    },
    body: {
      bg: "bg.default",
      color: "fg.default",
      fontFamily: "body",
      // Vendor-prefixed font smoothing isn't in Chakra's typed style surface.
      ...({
        WebkitFontSmoothing: "antialiased",
        MozOsxFontSmoothing: "grayscale",
      } satisfies Record<string, string>),
    },
    "::selection": {
      bg: "brand.800",
      color: "brand.100",
    },
    "::-webkit-scrollbar": {
      width: "6px",
    },
    "::-webkit-scrollbar-track": {
      bg: "surface.1",
    },
    "::-webkit-scrollbar-thumb": {
      bg: "surface.border",
      borderRadius: "full",
    },
    "::-webkit-scrollbar-thumb:hover": {
      bg: "surface.borderHover",
    },
  },
});

export const system = createSystem(defaultConfig, config);
