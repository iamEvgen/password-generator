export interface ISettings {
  lenght: number;
  hasLowercase: boolean;
  hasUppercase: boolean;
  hasNumbers: boolean;
  hasSymbols: boolean;
  deleteSimilar: boolean;
}

export interface IHistoryEntry {
  password: string;
  copiedAt: number;
}

export type Theme = 'light' | 'dark';
