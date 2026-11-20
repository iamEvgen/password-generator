import React, { useCallback, useEffect, useState } from 'react';
import {
  TbArrowUpRight,
  TbCheck,
  TbMoon,
  TbSun,
  TbX,
} from 'react-icons/tb';
import Passwords from './components/Passwords/Passwords';
import Settings from './components/Settings/Settings';
import History from './components/History/History';
import { useClipboard } from './hooks/useClipboard';
import { useLocalStorage } from './hooks/useLocalStorage';
import { generatePasswords, normalizeSettings } from './utils/passwords';
import { normalizeHistory, normalizeTheme } from './utils/storage';
import { IHistoryEntry, ISettings } from './interfaces/interfaces';
import './App.scss';

function App() {
  const [settings, setSettings, settingsStorageError] = useLocalStorage(
    'settings',
    normalizeSettings
  );
  const [theme, setTheme, themeStorageError] = useLocalStorage(
    'passgen-theme',
    normalizeTheme
  );
  const [history, setHistory, historyStorageError] = useLocalStorage(
    'passgen-history',
    normalizeHistory
  );
  const [passwordList, setPasswordList] = useState(() =>
    generatePasswords(settings)
  );
  const [lengthAdjusted, setLengthAdjusted] = useState(false);

  const rememberPassword = useCallback(
    (password: string) => {
      const entry: IHistoryEntry = { password, copiedAt: Date.now() };
      setHistory(previous =>
        [entry, ...previous.filter(item => item.password !== password)].slice(0, 25)
      );
    },
    [setHistory]
  );

  const { copy, feedback, copiedPassword, dismiss, cancelPending } =
    useClipboard(rememberPassword);

  const copyFromHistory = useCallback(
    (password: string) => copy(password, false),
    [copy]
  );

  const regenerate = useCallback(() => {
    dismiss();
    setPasswordList(generatePasswords(settings));
  }, [settings, dismiss]);

  useEffect(regenerate, [regenerate]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', theme === 'dark' ? '#121419' : '#f6f7f9');
  }, [theme]);

  function updateSettings(nextSettings: ISettings) {
    const normalized = normalizeSettings(nextSettings);
    setLengthAdjusted(normalized.lenght !== nextSettings.lenght);
    setSettings(normalized);
  }

  const storageError =
    settingsStorageError || themeStorageError || historyStorageError;

  return (
    <div className="app">
      <header className="header">
        <div className="header__title">
          <img
            className="header__logo"
            src={`${process.env.PUBLIC_URL}/favicon.svg`}
            width={32}
            height={32}
            alt=""
          />
          <h1>Генератор паролей</h1>
        </div>
        <button
          className="icon-button theme-toggle"
          type="button"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          aria-label={theme === 'dark' ? 'Включить светлую тему' : 'Включить тёмную тему'}
          title={theme === 'dark' ? 'Светлая тема' : 'Тёмная тема'}
        >
          {theme === 'dark' ? (
            <TbSun aria-hidden="true" />
          ) : (
            <TbMoon aria-hidden="true" />
          )}
        </button>
      </header>

      <main id="main">
        {storageError && (
          <p className="storage-notice" role="status">
            Браузер не разрешает сохранение. Настройки и история работают в этой
            вкладке, но могут не сохраниться после её закрытия.
          </p>
        )}

        <div className="generator-layout">
          <Settings
            settings={settings}
            setSettings={updateSettings}
            lengthAdjusted={lengthAdjusted}
          />
          <Passwords
            passwordList={passwordList}
            regenerate={regenerate}
            onCopy={copy}
            copiedPassword={copiedPassword}
          />
        </div>

        <History
          entries={history}
          onCopy={copyFromHistory}
          copiedPassword={copiedPassword}
          onClear={() => {
            cancelPending();
            setHistory([]);
          }}
        />
      </main>

      <div
        className={`toast${feedback ? ' toast--visible' : ''}${feedback?.type === 'error' ? ' toast--error' : ''}`}
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {feedback && (
          <>
            {feedback.type === 'success' ? (
              <TbCheck aria-hidden="true" />
            ) : (
              <TbArrowUpRight aria-hidden="true" />
            )}
            <span>{feedback.message}</span>
            <button
              className="icon-button"
              onClick={dismiss}
              type="button"
              aria-label="Закрыть уведомление"
            >
              <TbX aria-hidden="true" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
