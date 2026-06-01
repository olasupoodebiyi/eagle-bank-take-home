import type { User } from "@/types";

export const mockUsers: (User & { passwordHash: string })[] = [
  {
    id: "usr_001",
    email: "alex.morgan@example.com",
    fullName: "Alex Morgan",
    phone: "+44 7700 900123",
    address: "12 Financial Street, London, EC2V 8RF",
    avatar: "https://api.dicebear.com/9.x/initials/svg?seed=Alex%20Morgan",
    createdAt: "2024-01-15T10:00:00Z",
    passwordHash: "password123", // plain text for mock purposes only
  },
  {
    id: "usr_002",
    email: "sam.carter@example.com",
    fullName: "Sam Carter",
    phone: "+44 7700 900456",
    address: "45 Canary Wharf, London, E14 5AB",
    avatar: "https://api.dicebear.com/9.x/initials/svg?seed=Sam%20Carter",
    createdAt: "2024-02-20T09:00:00Z",
    passwordHash: "password123",
  },
];
