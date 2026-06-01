import type { User } from "@/types";

type StoredUser = User & { passwordHash: string };

/** Strip the password hash before returning a user over the (mock) wire. */
export function toSafeUser(user: StoredUser): User {
  const clone: Partial<StoredUser> = { ...user };
  delete clone.passwordHash;
  return clone as User;
}
