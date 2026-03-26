import { formatDegrees, moonPhaseFraction, remainingTimeLabel } from '../lib/math';
import { localizeName, t } from '../lib/i18n';

function Row({ label, title, value }) {
  return (
    <div className="element-row" title={title}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

export default function PanchangPanel({ data, locale }) {
  if (!data) {
    return (
      <section className="card">
        <h2>{t(locale, 'panchangDetails')}</h2>
        <p>{t(locale, 'waitingData')}</p>
      </section>
    );
  }

  const { elements, positions } = data;
  const sun = positions.sun.selectedLongitude;
  const moon = positions.moon.selectedLongitude;
  const phase = moonPhaseFraction(moon, sun);

  return (
    <section className="card">
      <h2>{t(locale, 'panchangDetails')}</h2>
      <Row label={t(locale, 'ahargana')} title="Days elapsed from selected epoch." value={data.ahargana.toFixed(4)} />
      <Row label={t(locale, 'sunLongitude')} title="Selected mode longitude for the Sun." value={formatDegrees(sun)} />
      <Row label={t(locale, 'moonLongitude')} title="Selected mode longitude for the Moon." value={formatDegrees(moon)} />

      <Row
        label={t(locale, 'tithi')}
        title="Tithi is based on Moon-Sun angular separation in 12-degree segments."
        value={`${elements.tithi.index}. ${localizeName(elements.tithi.names, locale)}`}
      />
      <Row
        label={t(locale, 'nakshatra')}
        title="Nakshatra is Moon longitude divided into 27 equal sectors."
        value={`${elements.nakshatra.index}. ${localizeName(elements.nakshatra.names, locale)}`}
      />
      <Row
        label={t(locale, 'yoga')}
        title="Yoga uses the sum of Sun and Moon longitudes in 27 sectors."
        value={`${elements.yoga.index}. ${localizeName(elements.yoga.names, locale)}`}
      />
      <Row
        label={t(locale, 'karana')}
        title="Karana is half a Tithi, each spanning 6 degrees."
        value={`${elements.karana.index}. ${localizeName(elements.karana.names, locale)}`}
      />
      <Row label={t(locale, 'vaar')} title="Weekday from selected datetime." value={localizeName(elements.vaar.names, locale)} />
      <Row label={t(locale, 'paksha')} title="Waxing (Shukla) or waning (Krishna) half." value={localizeName(elements.paksha.names, locale)} />

      <h3>{t(locale, 'nextChange')}</h3>
      <Row label={t(locale, 'tithi')} title="Estimated from angular velocity." value={remainingTimeLabel(elements.tithi.remainingHours)} />
      <Row
        label={t(locale, 'nakshatra')}
        title="Estimated from Moon sidereal speed."
        value={remainingTimeLabel(elements.nakshatra.remainingHours)}
      />
      <Row label={t(locale, 'yoga')} title="Estimated from Sun+Moon combined speed." value={remainingTimeLabel(elements.yoga.remainingHours)} />
      <Row label={t(locale, 'karana')} title="Estimated from Moon-Sun separation speed." value={remainingTimeLabel(elements.karana.remainingHours)} />

      <h3>{t(locale, 'moonPhase')}</h3>
      <div className="phase-bar">
        <div className="phase-fill" style={{ width: `${(phase * 100).toFixed(1)}%` }} />
      </div>
      <p className="muted">{(phase * 100).toFixed(1)}% {t(locale, 'cyclePercent')}</p>
    </section>
  );
}
