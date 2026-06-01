/** Parse user id from `Bearer mock_token_<userId>_<timestamp>` */
export function getUserIdFromToken(auth: string | null): string | null {
  if (!auth?.startsWith("Bearer mock_token_")) return null;

  const payload = auth.slice("Bearer mock_token_".length);
  const lastSeparator = payload.lastIndexOf("_");
  if (lastSeparator <= 0) return null;

  const timestamp = payload.slice(lastSeparator + 1);
  if (!/^\d+$/.test(timestamp)) return null;

  return payload.slice(0, lastSeparator);
}
