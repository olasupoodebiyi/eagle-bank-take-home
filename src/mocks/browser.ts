import { setupWorker } from "msw/browser";
import { authHandlers } from "./handlers/auth";
import { accountHandlers } from "./handlers/accounts";
import { transactionHandlers } from "./handlers/transactions";
import { dashboardHandlers, profileHandlers } from "./handlers/dashboard-profile";

export const worker = setupWorker(
  ...authHandlers,
  ...accountHandlers,
  ...transactionHandlers,
  ...dashboardHandlers,
  ...profileHandlers
);
