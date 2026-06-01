import type { NextConfig } from "next";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  // Next.js 16: explicit caching via Cache Components
  cacheComponents: true,
  // Pin Turbopack root — avoids picking C:\Users\paddy\ when a parent package-lock.json exists
  turbopack: {
    root: projectRoot,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.dicebear.com",
      },
    ],
  },
};

export default nextConfig;
