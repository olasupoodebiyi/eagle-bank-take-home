import { setupServer } from "msw/node";
import { authHandlers } from "./handlers/auth";
import { accountHandlers } from "./handlers/accounts";

export const server = setupServer(...authHandlers, ...accountHandlers);
