import React, { useEffect } from 'react';
import './Passwords.scss';

interface PropTypes {
  fillPasswordList: () => void;
  passwordList: string[];
}

const Passwords: React.FC<PropTypes> = ({ fillPasswordList, passwordList }) => {
  const renderPasswords = passwordList.map((password) => {
    return <li key={password}>{password}</li>;
  });

  useEffect(fillPasswordList, []);

  return (
    <div className="passwordContainer">
      <button
        onClick={fillPasswordList}
        className="passwordContainer__generateButton"
      >
        Создать!
      </button>
      {passwordList.length > 0 && (
        <ul className="passwordContainer__passwords">{renderPasswords}</ul>
      )}
      {passwordList.length < 10 && <div>Выбери из чего делать пароль</div>}
    </div>
  );
};

export default Passwords;
