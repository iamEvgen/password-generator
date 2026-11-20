import React, { useState } from 'react';
import { ISettings } from '../../interfaces/interfaces';
import './Settings.scss';

interface PropTypes {
  settings: ISettings;
  setSettings: (settings: ISettings) => void;
  fillPasswordList: () => void;
  saveSettingsToLocalStorage: () => void;
}

const Settings: React.FC<PropTypes> = ({
  settings,
  setSettings,
  saveSettingsToLocalStorage,
}) => {
  const [showSettings, setShowSettings] = useState(false);

  return (
    <>
      {!showSettings && (
        <div className="settingsContainer">
          <button
            onClick={() => setShowSettings(true)}
            className="passwordContainer__generateButton"
          >
            Настройки
          </button>
        </div>
      )}
      {showSettings && (
        <div className="settingsContainer">
          <label>
            Длина
            <input
              type="number"
              min={5}
              max={20}
              value={settings.lenght}
              onChange={(event) => {
                if (+event.target.value >= 5 && +event.target.value <= 20) {
                  setSettings({ ...settings, lenght: +event.target.value });
                }
              }}
              name="isFriendly"
            />
          </label>
          <label>
            Строчные a-z
            <input
              type="checkbox"
              checked={settings.hasLowercase}
              onChange={(event) => {
                setSettings({
                  ...settings,
                  hasLowercase: event.target.checked,
                });
              }}
            />
          </label>
          <label>
            Заглавные A-Z
            <input
              type="checkbox"
              checked={settings.hasUppercase}
              onChange={(event) => {
                setSettings({
                  ...settings,
                  hasUppercase: event.target.checked,
                });
              }}
            />
          </label>
          <label>
            Цифры 0-9
            <input
              type="checkbox"
              checked={settings.hasNumbers}
              onChange={(event) => {
                setSettings({ ...settings, hasNumbers: event.target.checked });
              }}
            />
          </label>
          <label>
            {`Символы #@$%&`}
            <input
              type="checkbox"
              checked={settings.hasSymbols}
              onChange={(event) => {
                setSettings({ ...settings, hasSymbols: event.target.checked });
              }}
            />
          </label>
          <label>
            Удалить похожие 0Ol1
            <input
              type="checkbox"
              checked={settings.deleteSimilar}
              onChange={(event) => {
                setSettings({
                  ...settings,
                  deleteSimilar: event.target.checked,
                });
              }}
            />
          </label>
          <button
            onClick={() => {
              setShowSettings(false);
              saveSettingsToLocalStorage();
            }}
            className="passwordContainer__generateButton"
            style={{ marginTop: '20px' }}
          >
            Сохранить
          </button>
        </div>
      )}
    </>
  );
};

export default Settings;
