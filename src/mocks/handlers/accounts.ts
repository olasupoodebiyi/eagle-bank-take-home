import { http, HttpResponse } from "msw";
import { mockAccounts } from "../data/accounts";
import { getUserIdFromToken } from "../utils/token";

export const accountHandlers = [
  // GET /api/accounts
  http.get("/api/accounts", async ({ request }) => {
    await delay(500);

    const userId = getUserIdFromToken(request.headers.get("Authorization"));
    if (!userId) {
      return HttpResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const accounts = mockAccounts.filter((a) => a.userId === userId);
    return HttpResponse.json(accounts, { status: 200 });
  }),

  // GET /api/accounts/:id
  http.get("/api/accounts/:id", async ({ request, params }) => {
    await delay(400);

    const userId = getUserIdFromToken(request.headers.get("Authorization"));
    if (!userId) {
      return HttpResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const account = mockAccounts.find(
      (a) => a.id === params.id && a.userId === userId
    );

    if (!account) {
      return HttpResponse.json(
        { message: "Account not found" },
        { status: 404 }
      );
    }

    return HttpResponse.json(account, { status: 200 });
  }),
];

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
