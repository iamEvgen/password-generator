import React, { useEffect, useState } from 'react';
import './Passwords.scss';
import { TbCopy } from 'react-icons/tb';
import { ISettings } from '../../interfaces/interfaces';

interface PropTypes {
  fillPasswordList: () => void;
  passwordList: string[];
  settings: ISettings;
  saveSettingsToLocalStorage: () => void;
}

const Passwords: React.FC<PropTypes> = ({
  settings,
  fillPasswordList,
  passwordList,
  saveSettingsToLocalStorage,
}) => {
  const [copied, setCopied] = useState('');

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const copyToClipboard = async (event: any) => {
    const text = event.target.innerText;
    if ('clipboard' in navigator) {
      await navigator.clipboard.writeText(text);
    } else {
      document.execCommand('copy', true, text);
    }
    setCopied(text);
    setTimeout(() => setCopied(''), 1000);
  };

  const renderPasswords = passwordList.map((password) => {
    return (
      <li
        onClick={(event) => copyToClipboard(event)}
        className="passwordContainer__password"
        key={password}
      >
        {password} <TbCopy />
      </li>
    );
  });

  useEffect(fillPasswordList, [settings]);

  return (
    <div className="passwordContainer">
      {copied.length > 0 && (
        <div className="passwordContainer__copied">
          <span>{copied}</span> скопирован!
        </div>
      )}
      <button
        onClick={() => {
          fillPasswordList();
          saveSettingsToLocalStorage();
        }}
        className="passwordContainer__generateButton"
      >
        Придумать!
      </button>
      {passwordList.length > 0 && (
        <ul className="passwordContainer__passwords">{renderPasswords}</ul>
      )}
      {passwordList.length === 0 && (
        <div className="passwordContainer__alert">
          Невозможно сделать <br />
          пароль из ничего 🥲
        </div>
      )}
    </div>
  );
};

export default Passwords;
