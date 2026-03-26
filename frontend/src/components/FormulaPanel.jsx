export default function FormulaPanel({ formulas }) {
  const entries = Object.entries(formulas || {});
  if (!entries.length) {
    return null;
  }

  return (
    <section className="card">
      <h2>Formula Layer</h2>
      {entries.map(([key, value]) => (
        <div key={key} className="formula-row">
          <h4>{key}</h4>
          <code>{value.en}</code>
          <code>{value.hi}</code>
          <code>{value.sa}</code>
        </div>
      ))}
    </section>
  );
}
