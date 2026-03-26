import { t } from '../lib/i18n';

export default function FormulaPanel({ formulas, locale }) {
  const entries = Object.entries(formulas || {});
  if (!entries.length) {
    return null;
  }

  return (
    <section className="card">
      <h2>{t(locale, 'formulaLayer')}</h2>
      {entries.map(([key, value]) => (
        <div key={key} className="formula-row">
          <h4>{key}</h4>
          <code>{value[locale] || value.en}</code>
        </div>
      ))}
    </section>
  );
}
