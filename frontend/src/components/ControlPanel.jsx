import { LOCALES, t } from '../lib/i18n';

export default function ControlPanel({
  dateTimeInput,
  setDateTimeInput,
  locale,
  setLocale,
  mode,
  setMode,
  speedDaysPerSecond,
  setSpeedDaysPerSecond,
  playing,
  setPlaying,
  visualizationMode,
  setVisualizationMode,
  stepDays,
  zoom,
  setZoom,
  rotation,
  setRotation,
  showFormulas,
  setShowFormulas,
}) {
  const onPlayPauseClick = () => {
    if (!playing) {
      stepDays(1);
    }
    setPlaying(!playing);
  };

  return (
    <section className="card">
      <h2>{t(locale, 'simulationControls')}</h2>

      <label>
        {t(locale, 'language')}
        <select value={locale} onChange={(event) => setLocale(event.target.value)}>
          {LOCALES.map((item) => (
            <option key={item} value={item}>{item.toUpperCase()}</option>
          ))}
        </select>
      </label>

      <label>
        {t(locale, 'dateTime')}
        <input
          type="datetime-local"
          value={dateTimeInput}
          onChange={(event) => setDateTimeInput(event.target.value)}
        />
      </label>

      <label>
        {t(locale, 'positionMode')}
        <select value={mode} onChange={(event) => setMode(event.target.value)}>
          <option value="true">{t(locale, 'modeTrue')}</option>
          <option value="mean">{t(locale, 'modeMean')}</option>
        </select>
      </label>

      <label>
        {t(locale, 'visualizationMode')}
        <select value={visualizationMode} onChange={(event) => setVisualizationMode(event.target.value)}>
          <option value="2d">{t(locale, 'wheel2d')}</option>
          <option value="3d">{t(locale, 'wheel3d')}</option>
        </select>
      </label>

      <label>
        {t(locale, 'speed')}: {speedDaysPerSecond.toFixed(2)}
        <input
          type="range"
          min="0.05"
          max="4"
          step="0.05"
          value={speedDaysPerSecond}
          onChange={(event) => setSpeedDaysPerSecond(Number(event.target.value))}
        />
      </label>

      <div className="row">
        <button type="button" onClick={onPlayPauseClick}>
          {playing ? t(locale, 'pause') : t(locale, 'play')}
        </button>
        <button type="button" onClick={() => stepDays(-1)}>{t(locale, 'stepMinus')}</button>
        <button type="button" onClick={() => stepDays(1)}>{t(locale, 'stepPlus')}</button>
      </div>

      <label>
        {t(locale, 'zoom')}: {zoom.toFixed(2)}x
        <input
          type="range"
          min="0.65"
          max="1.25"
          step="0.01"
          value={zoom}
          onChange={(event) => setZoom(Number(event.target.value))}
        />
      </label>

      <label>
        {t(locale, 'rotation')}: {rotation.toFixed(1)} deg
        <input
          type="range"
          min="0"
          max="360"
          step="0.5"
          value={rotation}
          onChange={(event) => setRotation(Number(event.target.value))}
        />
      </label>

      <label className="toggle">
        <input
          type="checkbox"
          checked={showFormulas}
          onChange={(event) => setShowFormulas(event.target.checked)}
        />
        {t(locale, 'showFormulas')}
      </label>
    </section>
  );
}
