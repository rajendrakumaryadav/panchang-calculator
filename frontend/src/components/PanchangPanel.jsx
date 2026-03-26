import { formatDegrees, moonPhaseFraction, remainingTimeLabel } from '../lib/math';

function formatNames(names) {
  if (!names) {
    return '-';
  }
  return `${names.en} | ${names.hi} | ${names.sa}`;
}

function Row({ label, title, value }) {
  return (
    <div className="element-row" title={title}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

export default function PanchangPanel({ data }) {
  if (!data) {
    return (
      <section className="card">
        <h2>Panchang Details</h2>
        <p>Waiting for calculation data...</p>
      </section>
    );
  }

  const { elements, positions } = data;
  const sun = positions.sun.selectedLongitude;
  const moon = positions.moon.selectedLongitude;
  const phase = moonPhaseFraction(moon, sun);

  return (
    <section className="card">
      <h2>Panchang Details</h2>
      <Row label="Ahargana" title="Days elapsed from selected epoch." value={data.ahargana.toFixed(4)} />
      <Row label="Sun Longitude" title="Selected mode longitude for the Sun." value={formatDegrees(sun)} />
      <Row label="Moon Longitude" title="Selected mode longitude for the Moon." value={formatDegrees(moon)} />

      <Row
        label="Tithi"
        title="Tithi is based on Moon-Sun angular separation in 12-degree segments."
        value={`${elements.tithi.index}. ${formatNames(elements.tithi.names)}`}
      />
      <Row
        label="Nakshatra"
        title="Nakshatra is Moon longitude divided into 27 equal sectors."
        value={`${elements.nakshatra.index}. ${formatNames(elements.nakshatra.names)}`}
      />
      <Row
        label="Yoga"
        title="Yoga uses the sum of Sun and Moon longitudes in 27 sectors."
        value={`${elements.yoga.index}. ${formatNames(elements.yoga.names)}`}
      />
      <Row
        label="Karana"
        title="Karana is half a Tithi, each spanning 6 degrees."
        value={`${elements.karana.index}. ${formatNames(elements.karana.names)}`}
      />
      <Row label="Vaar" title="Weekday from selected datetime." value={formatNames(elements.vaar.names)} />
      <Row label="Paksha" title="Waxing (Shukla) or waning (Krishna) half." value={formatNames(elements.paksha.names)} />

      <h3>Time Until Next Change</h3>
      <Row label="Tithi" title="Estimated from angular velocity." value={remainingTimeLabel(elements.tithi.remainingHours)} />
      <Row
        label="Nakshatra"
        title="Estimated from Moon sidereal speed."
        value={remainingTimeLabel(elements.nakshatra.remainingHours)}
      />
      <Row label="Yoga" title="Estimated from Sun+Moon combined speed." value={remainingTimeLabel(elements.yoga.remainingHours)} />
      <Row label="Karana" title="Estimated from Moon-Sun separation speed." value={remainingTimeLabel(elements.karana.remainingHours)} />

      <h3>Moon Phase Fraction</h3>
      <div className="phase-bar">
        <div className="phase-fill" style={{ width: `${(phase * 100).toFixed(1)}%` }} />
      </div>
      <p className="muted">{(phase * 100).toFixed(1)}% of synodic cycle</p>
    </section>
  );
}
