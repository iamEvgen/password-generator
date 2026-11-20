import React, { CSSProperties, useEffect, useState } from 'react';
import { TbAdjustments, TbInfoCircle } from 'react-icons/tb';
import { ISettings } from '../../interfaces/interfaces';
import { getMaxLength } from '../../utils/passwords';
import './Settings.scss';

interface PropTypes {
  settings: ISettings;
  setSettings: (settings: ISettings) => void;
  lengthAdjusted: boolean;
}

const options = [
  { key: 'hasLowercase', label: 'Строчные буквы', example: 'a–z', sample: 'a' },
  { key: 'hasUppercase', label: 'Заглавные буквы', example: 'A–Z', sample: 'A' },
  { key: 'hasNumbers', label: 'Цифры', example: '0–9', sample: '7' },
  { key: 'hasSymbols', label: 'Спецсимволы', example: '# $ % &', sample: '#' },
] as const;

function Settings({ settings, setSettings, lengthAdjusted }: PropTypes) {
  const [lengthInput, setLengthInput] = useState(String(settings.lenght));
  const maxLength = getMaxLength(settings);
  useEffect(() => setLengthInput(String(settings.lenght)), [settings.lenght]);

  function commitLength() {
    const parsed = Number(lengthInput);
    const lenght = lengthInput.trim() && Number.isFinite(parsed)
      ? Math.max(5, Math.min(maxLength, Math.round(parsed))) : settings.lenght;
    setLengthInput(String(lenght));
    if (lenght !== settings.lenght) setSettings({ ...settings, lenght });
  }

  return (
    <section className="settings panel" aria-labelledby="settings-title">
      <div className="section-heading">
        <h2 id="settings-title"><TbAdjustments aria-hidden="true" /> Настройки</h2>
      </div>
      <div className="length-control">
        <div className="length-control__heading">
          <label htmlFor="password-length">Длина пароля</label>
          <div className="length-input">
            <input id="password-length" type="number" inputMode="numeric" min={5} max={maxLength} step={1} value={lengthInput} onChange={event => {
              const value = event.target.value;
              setLengthInput(value);
              const parsed = Number(value);
              if (value !== '' && Number.isInteger(parsed) && parsed >= 5 && parsed <= maxLength) setSettings({ ...settings, lenght: parsed });
            }} onBlur={commitLength} onKeyDown={event => {
              if (event.key === 'Enter') event.currentTarget.blur();
            }} aria-describedby="length-hint" />
            <span aria-hidden="true">знаков</span>
          </div>
        </div>
        <input className="length-slider" type="range" min={5} max={maxLength} value={settings.lenght} onChange={event => {
          setLengthInput(event.target.value);
          setSettings({ ...settings, lenght: Number(event.target.value) });
        }} aria-label="Длина пароля" style={{ '--range-progress': `${((settings.lenght - 5) / (maxLength - 5)) * 100}%` } as CSSProperties} />
        <div className="range-labels" aria-hidden="true"><span>5</span><span>{maxLength}</span></div>
      </div>

      <p className="settings__label">ИСПОЛЬЗОВАТЬ В ПАРОЛЕ</p>
      <div className="settings__options">
        {options.map(option => <label className="setting-row" key={option.key}>
          <span className={`setting-row__sample setting-row__sample--${option.key}`} aria-hidden="true">{option.sample}</span>
          <span className="setting-row__text">{option.label}<span>{option.example}</span></span>
          <input className="switch-input" type="checkbox" checked={settings[option.key]} onChange={event => setSettings({ ...settings, [option.key]: event.target.checked })} />
          <span className="switch" aria-hidden="true" />
        </label>)}
      </div>

      <label className="setting-row setting-row--similar">
        <span className="setting-row__text">Без похожих символов<span>Исключить l, I, O, 1 и 0</span></span>
        <input className="switch-input" type="checkbox" checked={settings.deleteSimilar} onChange={event => setSettings({ ...settings, deleteSimilar: event.target.checked })} />
        <span className="switch" aria-hidden="true" />
      </label>
      <p className="settings__hint" id="length-hint"><TbInfoCircle aria-hidden="true" /><span>{maxLength < 20 || lengthAdjusted ? `В этом наборе доступно до ${maxLength} разных символов. Длина ограничена размером набора.` : 'Настройки сохраняются автоматически.'}</span></p>
    </section>
  );
}

export default Settings;
