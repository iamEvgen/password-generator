import React, { useEffect, useRef, useState } from 'react';
import { TbClock, TbTrash } from 'react-icons/tb';
import { IHistoryEntry } from '../../interfaces/interfaces';
import PasswordRow from '../PasswordRow/PasswordRow';
import './History.scss';

interface PropTypes {
  entries: IHistoryEntry[];
  onCopy: (password: string) => Promise<void>;
  copiedPassword: string | null;
  onClear: () => void;
}

function History({ entries, onCopy, copiedPassword, onClear }: PropTypes) {
  const [confirmClear, setConfirmClear] = useState(false);
  const cancelButton = useRef<HTMLButtonElement>(null);
  const clearButton = useRef<HTMLButtonElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const wasConfirming = useRef(false);

  useEffect(() => {
    if (confirmClear) cancelButton.current?.focus();
    else if (wasConfirming.current) {
      if (entries.length > 0) clearButton.current?.focus();
      else heading.current?.focus();
    }
    wasConfirming.current = confirmClear;
  }, [confirmClear, entries.length]);

  function cancelClear() {
    setConfirmClear(false);
  }

  return (
    <section className="history panel" aria-labelledby="history-title">
      <div className="section-heading history__heading">
        <h2 id="history-title" ref={heading} tabIndex={-1}>
          <TbClock aria-hidden="true" /> История скопированных{' '}
          <span className="history__count">
            {entries.length}
            <span> / 25</span>
          </span>
        </h2>
        <button
          className="text-button"
          type="button"
          ref={clearButton}
          onClick={() => setConfirmClear(true)}
          disabled={entries.length === 0 || confirmClear}
        >
          <TbTrash aria-hidden="true" /> Очистить
        </button>
      </div>
      <p className="history__description">
        Последние 25 скопированных паролей. Хранятся только в этом браузере.
      </p>
      {confirmClear && (
        <div
          className="history__confirmation"
          role="group"
          aria-label="Подтверждение очистки истории"
          onKeyDown={(event) => {
            if (event.key === 'Escape') cancelClear();
          }}
        >
          <p>Удалить все пароли из истории?</p>
          <div>
            <button
              className="text-button"
              ref={cancelButton}
              type="button"
              onClick={cancelClear}
            >
              Отмена
            </button>
            <button
              className="text-button text-button--danger"
              type="button"
              onClick={() => {
                onClear();
                setConfirmClear(false);
              }}
            >
              Удалить всё
            </button>
          </div>
        </div>
      )}
      {entries.length > 0 ? (
        <ol className="password-list history__list">
          {entries.map((entry, index) => (
            <PasswordRow
              key={entry.password}
              password={entry.password}
              index={index}
              copiedAt={entry.copiedAt}
              onCopy={onCopy}
              copied={copiedPassword === entry.password}
            />
          ))}
        </ol>
      ) : (
        <div className="empty-state history__empty">
          <p>История пуста.</p>
        </div>
      )}
    </section>
  );
}

export default History;
