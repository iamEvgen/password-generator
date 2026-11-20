import React from 'react';
import { TbRefresh } from 'react-icons/tb';
import PasswordRow from '../PasswordRow/PasswordRow';
import './Passwords.scss';

interface PropTypes {
  passwordList: string[];
  regenerate: () => void;
  onCopy: (password: string) => Promise<void>;
  copiedPassword: string | null;
}

function Passwords({ passwordList, regenerate, onCopy, copiedPassword }: PropTypes) {
  return (
    <section className="passwords panel" aria-labelledby="passwords-title">
      <div className="section-heading">
        <h2 id="passwords-title">Пароли</h2>
        <span className="count-badge" aria-label="Количество паролей">{passwordList.length}</span>
      </div>
      {passwordList.length > 0 ? <ol className="password-list">
        {passwordList.map((password, index) => <PasswordRow key={index} password={password} index={index} onCopy={onCopy} copied={copiedPassword === password} />)}
      </ol> : <div className="empty-state passwords__empty">
        <p>Выберите хотя бы одну категорию символов.</p>
      </div>}
      <button type="button" className="generate-button" onClick={regenerate} disabled={!passwordList.length}><TbRefresh aria-hidden="true" /> Сгенерировать</button>
    </section>
  );
}

export default Passwords;
