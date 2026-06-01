import { setupServer } from "msw/node";
import { authHandlers } from "./handlers/auth";
import { accountHandlers } from "./handlers/accounts";
import { transactionHandlers } from "./handlers/transactions";
import { dashboardHandlers, profileHandlers } from "./handlers/dashboard-profile";

export const server = setupServer(
  ...authHandlers,
  ...accountHandlers,
  ...transactionHandlers,
  ...dashboardHandlers,
  ...profileHandlers
);
