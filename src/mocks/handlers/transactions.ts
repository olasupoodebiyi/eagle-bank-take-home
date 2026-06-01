import { http, HttpResponse } from "msw";
import { mockTransactions } from "../data/transactions";
import { getUserIdFromToken } from "../utils/token";
import type { Transaction, TransactionType } from "@/types";

// Map userId -> accountIds (simplified: usr_001 owns acc_001, acc_002, acc_003)
const userAccountMap: Record<string, string[]> = {
  usr_001: ["acc_001", "acc_002", "acc_003"],
  usr_002: ["acc_004"],
};

export const transactionHandlers = [
  // GET /api/transactions
  http.get("/api/transactions", async ({ request }) => {
    await delay(600);

    const userId = getUserIdFromToken(request.headers.get("Authorization"));
    if (!userId) {
      return HttpResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const accountIds = userAccountMap[userId] ?? [];
    const url = new URL(request.url);

    const startDate = url.searchParams.get("startDate");
    const endDate = url.searchParams.get("endDate");
    const type = url.searchParams.get("type") as TransactionType | "all" | null;
    const sortBy = url.searchParams.get("sortBy") as "date" | "amount" | null;
    const sortOrder = url.searchParams.get("sortOrder") as "asc" | "desc" | null;
    const page = parseInt(url.searchParams.get("page") ?? "1");
    const limit = parseInt(url.searchParams.get("limit") ?? "10");

    let transactions: Transaction[] = mockTransactions.filter((t) =>
      accountIds.includes(t.accountId)
    );

    if (startDate) {
      transactions = transactions.filter(
        (t) => new Date(t.date) >= new Date(startDate)
      );
    }
    if (endDate) {
      transactions = transactions.filter(
        (t) => new Date(t.date) <= new Date(endDate)
      );
    }
    if (type && type !== "all") {
      transactions = transactions.filter((t) => t.type === type);
    }

    const sort = sortBy ?? "date";
    const order = sortOrder ?? "desc";
    transactions.sort((a, b) => {
      const valA = sort === "amount" ? a.amount : new Date(a.date).getTime();
      const valB = sort === "amount" ? b.amount : new Date(b.date).getTime();
      return order === "asc" ? valA - valB : valB - valA;
    });

    const total = transactions.length;
    const totalPages = Math.ceil(total / limit);
    const offset = (page - 1) * limit;
    const paginated = transactions.slice(offset, offset + limit);

    return HttpResponse.json(
      { data: paginated, total, page, limit, totalPages },
      { status: 200 }
    );
  }),

  // GET /api/transactions/:id
  http.get("/api/transactions/:id", async ({ request, params }) => {
    await delay(400);

    const userId = getUserIdFromToken(request.headers.get("Authorization"));
    if (!userId) {
      return HttpResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const accountIds = userAccountMap[userId] ?? [];
    const transaction = mockTransactions.find(
      (t) => t.id === params.id && accountIds.includes(t.accountId)
    );

    if (!transaction) {
      return HttpResponse.json(
        { message: "Transaction not found" },
        { status: 404 }
      );
    }

    return HttpResponse.json(transaction, { status: 200 });
  }),
];

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
