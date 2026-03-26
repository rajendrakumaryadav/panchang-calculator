export default function ControlPanel({
  dateTimeInput,
  setDateTimeInput,
  mode,
  setMode,
  speedDaysPerSecond,
  setSpeedDaysPerSecond,
  playing,
  setPlaying,
  stepDays,
  zoom,
  setZoom,
  rotation,
  setRotation,
  showFormulas,
  setShowFormulas,
}) {
  return (
    <section className="card">
      <h2>Simulation Controls</h2>

      <label>
        Date / Time (UTC)
        <input
          type="datetime-local"
          value={dateTimeInput}
          onChange={(event) => setDateTimeInput(event.target.value)}
        />
      </label>

      <label>
        Position Mode
        <select value={mode} onChange={(event) => setMode(event.target.value)}>
          <option value="true">True (Manda corrected)</option>
          <option value="mean">Mean longitude</option>
        </select>
      </label>

      <label>
        Speed (days per second): {speedDaysPerSecond.toFixed(2)}
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
        <button type="button" onClick={() => setPlaying(!playing)}>
          {playing ? 'Pause' : 'Play'}
        </button>
        <button type="button" onClick={() => stepDays(-1)}>Step -1 day</button>
        <button type="button" onClick={() => stepDays(1)}>Step +1 day</button>
      </div>

      <label>
        Zoom: {zoom.toFixed(2)}x
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
        Rotation: {rotation.toFixed(1)} deg
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
        Show formulas and explanations
      </label>
    </section>
  );
}
