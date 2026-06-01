import type { NextConfig } from "next";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  // Pin Turbopack root — avoids picking C:\Users\paddy\ when a parent package-lock.json exists
  turbopack: {
    root: projectRoot,
  },
};

export default nextConfig;
