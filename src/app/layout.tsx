import type { Metadata } from "next";
import { DM_Sans, JetBrains_Mono } from "next/font/google";
import { Providers } from "@/components/providers/Providers";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: "%s | Eagle Bank",
    default: "Eagle Bank — Modern Banking",
  },
  description:
    "Eagle Bank — your modern, secure banking platform for the digital age.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`dark ${dmSans.variable} ${jetbrainsMono.variable}`}
      style={{ colorScheme: "dark" }}
      suppressHydrationWarning
    >
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
