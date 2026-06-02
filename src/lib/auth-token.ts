import Cookies from "js-cookie";

const TOKEN_COOKIE = "eagle_bank_token";

/** Cookie stores the raw mock token; fetch expects `Bearer mock_token_<userId>_<timestamp>`. */
export function getAuthorizationHeader(): Record<string, string> {
  const raw = Cookies.get(TOKEN_COOKIE)?.trim();
  if (!raw) return {};

  const value = raw.startsWith("Bearer ") ? raw : `Bearer ${raw}`;
  return { Authorization: value };
}
