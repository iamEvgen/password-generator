import { useCallback, useEffect, useRef, useState } from 'react';

interface Feedback {
  type: 'success' | 'error';
  message: string;
}

function fallbackCopy(text: string): boolean {
  const activeElement = document.activeElement;
  const selection = window.getSelection();
  const ranges = selection ? Array.from({ length: selection.rangeCount }, (_, index) => selection.getRangeAt(index).cloneRange()) : [];
  const field = document.createElement('textarea');
  field.value = text;
  field.readOnly = true;
  field.setAttribute('aria-label', 'Копируемый пароль');
  field.style.cssText = 'position:fixed;top:0;left:0;width:1px;height:1px;padding:0;border:0;opacity:0;font-size:16px;';
  document.body.appendChild(field);
  try {
    field.focus({ preventScroll: true });
    field.select();
    field.setSelectionRange(0, text.length);
    return document.execCommand('copy');
  } catch {
    return false;
  } finally {
    field.remove();
    if (activeElement instanceof HTMLElement) activeElement.focus({ preventScroll: true });
    if (selection) {
      selection.removeAllRanges();
      ranges.forEach(range => selection.addRange(range));
    }
  }
}

export function useClipboard(onCopied: (password: string) => void) {
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [copiedPassword, setCopiedPassword] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>();
  const request = useRef(0);
  const historyVersion = useRef(0);
  const mounted = useRef(false);

  const dismiss = useCallback(() => {
    request.current += 1;
    clearTimeout(timer.current);
    setFeedback(null);
    setCopiedPassword(null);
  }, []);

  const cancelPending = useCallback(() => {
    historyVersion.current += 1;
    dismiss();
  }, [dismiss]);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      request.current += 1;
      clearTimeout(timer.current);
    };
  }, []);

  const copy = useCallback(async (password: string, saveToHistory = true) => {
    const currentRequest = ++request.current;
    const currentHistoryVersion = historyVersion.current;
    clearTimeout(timer.current);
    setFeedback(null);
    setCopiedPassword(null);
    let success = false;
    try {
      if (window.isSecureContext && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(password);
        success = true;
      }
    } catch {
      // Try the synchronous fallback if the browser rejects Clipboard API access.
    }
    // A copy that was already awaiting permission must not restore cleared history.
    if (!mounted.current || historyVersion.current !== currentHistoryVersion) return;
    // An older rejected request must not overwrite a newer copy via the fallback.
    if (!success && request.current !== currentRequest) return;
    if (!success) success = fallbackCopy(password);
    if (success && saveToHistory) onCopied(password);
    if (request.current !== currentRequest) return;

    setCopiedPassword(success ? password : null);
    setFeedback(success
      ? { type: 'success', message: saveToHistory ? 'Пароль скопирован и добавлен в историю' : 'Пароль скопирован' }
      : { type: 'error', message: 'Не удалось скопировать. Выделите пароль и скопируйте вручную.' });
    timer.current = setTimeout(() => {
      setFeedback(null);
      setCopiedPassword(null);
    }, success ? 2600 : 7000);
  }, [onCopied]);

  return { copy, feedback, copiedPassword, dismiss, cancelPending };
}
