import { http, HttpResponse } from "msw";
import { mockUsers } from "../data/users";
import { getUserIdFromToken } from "../utils/token";
import { toSafeUser } from "../utils/user";
import { upsertProfileUser } from "./dashboard-profile";
import type { User } from "@/types";

// In-memory store for registered users during the session
const registeredUsers = [...mockUsers];

export const authHandlers = [
  // POST /api/auth/login
  http.post("/api/auth/login", async ({ request }) => {
    const body = (await request.json()) as { email: string; password: string };

    await delay(600);

    const user = registeredUsers.find(
      (u) => u.email === body.email && u.passwordHash === body.password
    );

    if (!user) {
      return HttpResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    const safeUser = toSafeUser(user);
    return HttpResponse.json(
      { user: safeUser, token: `mock_token_${user.id}_${Date.now()}` },
      { status: 200 }
    );
  }),

  // POST /api/auth/register
  http.post("/api/auth/register", async ({ request }) => {
    const body = (await request.json()) as {
      fullName: string;
      email: string;
      password: string;
      phone: string;
    };

    await delay(800);

    const existing = registeredUsers.find((u) => u.email === body.email);
    if (existing) {
      return HttpResponse.json(
        { message: "An account with this email already exists" },
        { status: 409 }
      );
    }

    const newUser: User & { passwordHash: string } = {
      id: `usr_${Date.now()}`,
      email: body.email,
      fullName: body.fullName,
      phone: body.phone,
      address: "",
      avatar: `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(body.fullName)}`,
      createdAt: new Date().toISOString(),
      passwordHash: body.password,
    };

    registeredUsers.push(newUser);

    const safeUser = toSafeUser(newUser);
    upsertProfileUser(safeUser);
    return HttpResponse.json(
      { user: safeUser, token: `mock_token_${newUser.id}_${Date.now()}` },
      { status: 201 }
    );
  }),

  // POST /api/auth/logout
  http.post("/api/auth/logout", async () => {
    await delay(300);
    return HttpResponse.json({ success: true }, { status: 200 });
  }),

  // GET /api/auth/me
  http.get("/api/auth/me", async ({ request }) => {
    await delay(400);

    const userId = getUserIdFromToken(request.headers.get("Authorization"));
    if (!userId) {
      return HttpResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = registeredUsers.find((u) => u.id === userId);

    if (!user) {
      return HttpResponse.json({ message: "User not found" }, { status: 404 });
    }

    return HttpResponse.json(toSafeUser(user), { status: 200 });
  }),
];

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
