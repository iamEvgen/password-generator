import { ISettings } from '../interfaces/interfaces';

const lowerLetters = 'abcdefghijklmnopqrstuvwxyz';
const upperLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const numbers = '0123456789';
const symbols = '#$%&*,.:;!?([{}])-+_';

export const defaultSettings: ISettings = {
  lenght: 15,
  hasLowercase: true,
  hasUppercase: true,
  hasNumbers: true,
  hasSymbols: true,
  deleteSimilar: true,
};

export function getCharacters(settings: ISettings): string[] {
  let allCharacters = '';
  if (settings.hasLowercase) allCharacters += lowerLetters;
  if (settings.hasUppercase) allCharacters += upperLetters;
  if (settings.hasNumbers) allCharacters += numbers;
  if (settings.hasSymbols) allCharacters += symbols;
  const characters = allCharacters.split('');
  return settings.deleteSimilar ? characters.filter(character => !'lIO10'.includes(character)) : characters;
}

export function getMaxLength(settings: ISettings): number {
  return Math.min(20, getCharacters(settings).length || 20);
}

export function normalizeSettings(value: unknown): ISettings {
  const settings = { ...defaultSettings };
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return settings;
  const saved = value as Record<string, unknown>;
  const booleanKeys = ['hasLowercase', 'hasUppercase', 'hasNumbers', 'hasSymbols', 'deleteSimilar'] as const;
  booleanKeys.forEach(key => {
    if (typeof saved[key] === 'boolean') settings[key] = saved[key] as boolean;
  });
  const length = typeof saved.lenght === 'number' && Number.isFinite(saved.lenght) ? Math.round(saved.lenght) : settings.lenght;
  settings.lenght = Math.max(5, Math.min(getMaxLength(settings), length));
  return settings;
}

function shuffle(array: string[]): string[] {
  let currentIndex = array.length;
  while (currentIndex !== 0) {
    const randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
}

function checkPassword(password: string, settings: ISettings): boolean {
  return (!settings.hasLowercase || password.split('').some(character => lowerLetters.includes(character)))
    && (!settings.hasUppercase || password.split('').some(character => upperLetters.includes(character)))
    && (!settings.hasNumbers || password.split('').some(character => numbers.includes(character)))
    && (!settings.hasSymbols || password.split('').some(character => symbols.includes(character)));
}

export function generatePasswords(settings: ISettings): string[] {
  const characters = getCharacters(settings);
  if (characters.length === 0) return [];
  const passwords: string[] = [];
  // Preserve the original shuffle, slice and category check. Iteration replaces
  // recursive retries so rejected candidates never grow the call stack.
  while (passwords.length < 5) {
    const password = shuffle([...characters]).slice(0, settings.lenght).join('');
    if (checkPassword(password, settings)) passwords.push(password);
  }
  return passwords;
}
