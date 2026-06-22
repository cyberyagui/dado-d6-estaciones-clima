export default function DiceResult({ face }) {
  if (!face) {
    return (
      <section className="result-card result-card--empty" aria-live="polite">
        <p className="result-kicker">FungiTruco</p>
        <h2>Listo para tirar</h2>
        <p>El resultado aparecerá acá después de lanzar el dado.</p>
      </section>
    );
  }

  const kind = face.type === "reward" ? "Recompensa" : "Penalización";

  return (
    <section className={`result-card result-card--${face.type}`} aria-live="polite">
      <p className="result-kicker">Resultado</p>
      <h2>{face.label}</h2>
      <p className="result-kind">
        {kind} {face.intensity}
      </p>
      <p>{face.description}</p>
    </section>
  );
}
