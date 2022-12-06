import React from 'react';
import { ISettings } from '../../interfaces/interfaces';
import './Settings.scss';

interface PropTypes {
  settings: ISettings;
  setSettings: (settings: ISettings) => void;
  fillPasswordList: () => void;
}

const Settings: React.FC<PropTypes> = ({ settings, setSettings }) => {
  return (
    <div className="settingsContainer">
      <label>
        Длина
        <input
          type="number"
          min={6}
          max={30}
          value={settings.lenght}
          onChange={(event) => {
            setSettings({ ...settings, lenght: +event.target.value });
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
            setSettings({ ...settings, hasLowercase: event.target.checked });
          }}
        />
      </label>
      <label>
        Заглавные A-Z
        <input
          type="checkbox"
          checked={settings.hasUppercase}
          onChange={(event) => {
            setSettings({ ...settings, hasUppercase: event.target.checked });
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
            setSettings({ ...settings, deleteSimilar: event.target.checked });
          }}
        />
      </label>
    </div>
  );
};

export default Settings;
