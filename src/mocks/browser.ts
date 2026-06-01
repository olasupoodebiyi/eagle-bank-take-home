import { setupWorker } from "msw/browser";
import { authHandlers } from "./handlers/auth";
import { accountHandlers } from "./handlers/accounts";

export const worker = setupWorker(...authHandlers, ...accountHandlers);
