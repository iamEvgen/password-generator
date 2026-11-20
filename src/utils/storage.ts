import { IHistoryEntry, Theme } from '../interfaces/interfaces';

export function normalizeTheme(value: unknown): Theme {
  if (value === 'light' || value === 'dark') return value;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function normalizeHistory(value: unknown): IHistoryEntry[] {
  if (!Array.isArray(value)) return [];
  const seen = new Set<string>();
  return value.filter((entry): entry is IHistoryEntry =>
    typeof entry === 'object' && entry !== null
    && typeof entry.password === 'string' && entry.password.length >= 5 && entry.password.length <= 20
    && /^[a-zA-Z0-9#$%&*,.:;!?([\]{})\-+_]+$/.test(entry.password)
    && typeof entry.copiedAt === 'number' && Number.isFinite(entry.copiedAt)
    && entry.copiedAt > 0 && entry.copiedAt <= Date.now()
  ).map(({ password, copiedAt }) => ({ password, copiedAt })).sort((a, b) => b.copiedAt - a.copiedAt).filter(entry => {
    if (seen.has(entry.password)) return false;
    seen.add(entry.password);
    return true;
  }).slice(0, 25);
}
