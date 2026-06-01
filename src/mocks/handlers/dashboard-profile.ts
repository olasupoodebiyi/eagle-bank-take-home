import { http, HttpResponse } from "msw";
import { mockUsers } from "../data/users";
import { mockAccounts } from "../data/accounts";
import { mockTransactions } from "../data/transactions";
import { getUserIdFromToken } from "../utils/token";
import { toSafeUser } from "../utils/user";
import type { User } from "@/types";

// In-memory profile store (mirrors registered users)
const profileStore = mockUsers.map(toSafeUser);

export function upsertProfileUser(user: User) {
  const idx = profileStore.findIndex((u) => u.id === user.id);
  if (idx === -1) profileStore.push(user);
  else profileStore[idx] = user;
}

export const dashboardHandlers = [
  http.get("/api/dashboard", async ({ request }) => {
    await delay(700);

    const userId = getUserIdFromToken(request.headers.get("Authorization"));
    if (!userId) {
      return HttpResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = profileStore.find((u) => u.id === userId);
    if (!user) {
      return HttpResponse.json({ message: "User not found" }, { status: 404 });
    }

    const accounts = mockAccounts.filter((a) => a.userId === userId);
    const accountIds = accounts.map((a) => a.id);
    const allTxns = mockTransactions.filter((t) =>
      accountIds.includes(t.accountId)
    );

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const monthlyTxns = allTxns.filter(
      (t) => new Date(t.date) >= startOfMonth && t.status === "completed"
    );

    const monthlyDeposits = monthlyTxns
      .filter((t) => t.type === "deposit")
      .reduce((sum, t) => sum + t.amount, 0);

    const monthlyWithdrawals = monthlyTxns
      .filter((t) => t.type === "withdrawal")
      .reduce((sum, t) => sum + t.amount, 0);

    const totalBalance = accounts.reduce((sum, a) => sum + a.balance, 0);

    const recentTransactions = [...allTxns]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);

    return HttpResponse.json(
      {
        user,
        stats: {
          totalBalance,
          currentBalance: accounts[0]?.balance ?? 0,
          monthlyDeposits,
          monthlyWithdrawals,
          currency: "GBP",
        },
        recentTransactions,
        accounts,
      },
      { status: 200 }
    );
  }),
];

export const profileHandlers = [
  http.get("/api/profile", async ({ request }) => {
    await delay(400);

    const userId = getUserIdFromToken(request.headers.get("Authorization"));
    if (!userId) {
      return HttpResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = profileStore.find((u) => u.id === userId);
    if (!user) {
      return HttpResponse.json({ message: "User not found" }, { status: 404 });
    }

    return HttpResponse.json(user, { status: 200 });
  }),

  http.put("/api/profile", async ({ request }) => {
    await delay(600);

    const userId = getUserIdFromToken(request.headers.get("Authorization"));
    if (!userId) {
      return HttpResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json()) as {
      fullName: string;
      email: string;
      phone: string;
      address: string;
    };

    const idx = profileStore.findIndex((u) => u.id === userId);
    if (idx === -1) {
      return HttpResponse.json({ message: "User not found" }, { status: 404 });
    }

    profileStore[idx] = { ...profileStore[idx], ...body };
    return HttpResponse.json(profileStore[idx], { status: 200 });
  }),
];

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
