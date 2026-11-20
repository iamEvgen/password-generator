import React from 'react';
import { TbCheck, TbCopy } from 'react-icons/tb';

interface PropTypes {
  password: string;
  index: number;
  onCopy: (password: string) => Promise<void>;
  copied: boolean;
  copiedAt?: number;
}

const dateFormatter = new Intl.DateTimeFormat('ru-RU', {
  day: 'numeric',
  month: 'short',
  hour: '2-digit',
  minute: '2-digit',
});

function PasswordRow({ password, index, onCopy, copied, copiedAt }: PropTypes) {
  return (
    <li className="password-list__item">
      <button
        className={`password-row${copied ? ' password-row--copied' : ''}`}
        type="button"
        onClick={() => onCopy(password)}
        aria-label={`Скопировать пароль ${index + 1}${copiedAt !== undefined ? ' из истории' : ''}: ${password}`}
        title={copied ? 'Скопировано' : 'Скопировать пароль'}
      >
        <span className="password-row__index" aria-hidden="true">
          {(index + 1).toString().padStart(2, '0')}
        </span>
        <span className="password-row__content">
          <code className="password-value" dir="ltr">
            {password.split('').map((character, characterIndex) => (
              <span
                key={characterIndex}
                className={
                  /[0-9]/.test(character)
                    ? 'character-number'
                    : /[^a-zA-Z0-9]/.test(character)
                      ? 'character-symbol'
                      : undefined
                }
              >
                {character}
              </span>
            ))}
          </code>
          {copiedAt !== undefined && (
            <time dateTime={new Date(copiedAt).toISOString()}>
              {dateFormatter.format(copiedAt)}
            </time>
          )}
        </span>
        <span className="copy-indicator" aria-hidden="true">
          {copied ? <TbCheck /> : <TbCopy />}
        </span>
      </button>
    </li>
  );
}

export default PasswordRow;
