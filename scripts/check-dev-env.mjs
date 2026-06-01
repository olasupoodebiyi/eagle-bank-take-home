import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const chakra = path.join(root, "node_modules", "@chakra-ui", "react", "package.json");
const config = path.join(root, "next.config.ts");

if (!fs.existsSync(chakra)) {
  console.error(
    "\n[eagle-bank] @chakra-ui/react is missing. From this folder run:\n  pnpm install\n",
  );
  process.exit(1);
}

if (!fs.existsSync(config) || !fs.readFileSync(config, "utf8").includes("turbopack")) {
  console.error(
    "\n[eagle-bank] next.config.ts is missing turbopack.root. Run:\n  git pull\n",
  );
  process.exit(1);
}

const parentLock = path.join(process.env.USERPROFILE ?? "", "package-lock.json");
if (fs.existsSync(parentLock)) {
  console.warn(
    `\n[eagle-bank] Warning: ${parentLock} exists.\n` +
      "  If dev fails to resolve packages, rename/remove it or use: pnpm dev:webpack\n",
  );
}
