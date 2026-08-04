const USERNAME_PATTERN = /^[a-z0-9][a-z0-9_-]*(?:\.[a-z0-9_-]+)*$/;
const INTERNAL_ACCOUNT_DOMAIN = "accounts.careready.invalid";

export function normalizeUsername(value: string) {
  return value.trim().toLowerCase();
}

export function isValidUsername(value: string) {
  const username = normalizeUsername(value);
  return username.length >= 3 && username.length <= 30 && USERNAME_PATTERN.test(username);
}

export function usernameToInternalEmail(value: string) {
  return `${normalizeUsername(value)}@${INTERNAL_ACCOUNT_DOMAIN}`;
}
