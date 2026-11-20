import { Dispatch, SetStateAction, useEffect, useState } from 'react';

export function useLocalStorage<T>(key: string, normalize: (value: unknown) => T): [T, Dispatch<SetStateAction<T>>, boolean] {
  const [initial] = useState(() => {
    let raw: string | null;
    try {
      raw = window.localStorage.getItem(key);
    } catch {
      return { value: normalize(null), unavailable: true };
    }
    let parsed: unknown = null;
    try {
      parsed = raw === null ? null : JSON.parse(raw);
    } catch {
      // Invalid JSON is replaced by validated defaults independently of storage availability.
    }
    return { value: normalize(parsed), unavailable: false };
  });
  const [value, setValue] = useState(initial.value);
  const [unavailable, setUnavailable] = useState(initial.unavailable);

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
      setUnavailable(false);
    } catch {
      setUnavailable(true);
    }
  }, [key, value]);

  return [value, setValue, unavailable];
}
