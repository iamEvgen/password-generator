import React, { useState } from 'react';
import './App.scss';
import Passwords from './components/Passwords/Passwords';
import Settings from './components/Settings/Settings';

const lowerLetters = 'abcdefghijklmnopqrstuvwxyz';
const upperLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const numbers = '0123456789';
const symbols = '#$%&*,.:;!?([{}])-+_';

function App() {
  const [passwordList, setPasswordList] = useState<string[]>([]);
  const [settings, setSettings] = useState({
    lenght: 12,
    hasLowercase: true,
    hasUppercase: true,
    hasNumbers: true,
    hasSymbols: true,
    deleteSimilar: true,
  });

  function shuffle(array: string[]) {
    let currentIndex = array.length,
      randomIndex;
    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }
    return array;
  }

  function generatePassword(): string {
    let allCharacters = '';
    if (settings.hasLowercase) allCharacters += lowerLetters;
    if (settings.hasUppercase) allCharacters += upperLetters;
    if (settings.hasNumbers) allCharacters += numbers;
    if (settings.hasSymbols) allCharacters += symbols;
    let allCharactersArr = allCharacters.split('');
    if (settings.deleteSimilar) {
      allCharactersArr = allCharactersArr.filter(
        (character: string) => !'lIO10'.includes(character)
      );
    }
    const newPassword = shuffle(allCharactersArr)
      .slice(0, settings.lenght)
      .join('');
    if (checkPassword(newPassword)) {
      return newPassword;
    } else {
      return generatePassword();
    }
  }

  function checkPassword(password: string): boolean {
    let lowercaseCheck = false;
    let uppercaseCheck = false;
    let numbersCheck = false;
    let symbolsCheck = false;

    if (settings.hasLowercase) {
      password.split('').forEach((character) => {
        if (lowerLetters.includes(character)) {
          lowercaseCheck = true;
        }
      });
    } else {
      lowercaseCheck = true;
    }

    if (settings.hasUppercase) {
      password.split('').forEach((character) => {
        if (upperLetters.includes(character)) {
          uppercaseCheck = true;
        }
      });
    } else {
      uppercaseCheck = true;
    }

    if (settings.hasNumbers) {
      password.split('').forEach((character) => {
        if (numbers.includes(character)) {
          numbersCheck = true;
        }
      });
    } else {
      numbersCheck = true;
    }

    if (settings.hasSymbols) {
      password.split('').forEach((character) => {
        if (symbols.includes(character)) {
          symbolsCheck = true;
        }
      });
    } else {
      symbolsCheck = true;
    }
    return lowercaseCheck && uppercaseCheck && numbersCheck && symbolsCheck;
  }

  function fillPasswordList() {
    const newPasswords = [];
    for (let i = 0; i < 10; i++) {
      newPasswords.push(generatePassword());
    }
    setPasswordList(newPasswords);
  }

  return (
    <div className="app">
      <h1>Генератор паролей</h1>
      <div className="passwordGenerator">
        <Settings
          fillPasswordList={fillPasswordList}
          settings={settings}
          setSettings={setSettings}
        />
        <Passwords
          fillPasswordList={fillPasswordList}
          passwordList={passwordList}
        />
      </div>
    </div>
  );
}

export default App;
