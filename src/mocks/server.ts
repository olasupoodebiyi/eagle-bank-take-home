import { setupServer } from "msw/node";
import { authHandlers } from "./handlers/auth";
import { accountHandlers } from "./handlers/accounts";
import { transactionHandlers } from "./handlers/transactions";

export const server = setupServer(
  ...authHandlers,
  ...accountHandlers,
  ...transactionHandlers
);
