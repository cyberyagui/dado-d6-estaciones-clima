const effectConfig = {
  primavera: { className: "effect-petal", count: 18 },
  otono: { className: "effect-leaf", count: 16 },
  invierno: { className: "effect-snow", count: 22 },
  verano: { className: "effect-sunray", count: 14 },
  lluvia: { className: "effect-drop", count: 20 },
  sequia: { className: "effect-dust", count: 16 },
};

export default function ResultEffect({ face, effectKey }) {
  if (!face) return null;

  const config = effectConfig[face.id];
  if (!config) return null;

  return (
    <div className={`result-effect result-effect--${face.id}`} aria-hidden="true" key={`${face.id}-${effectKey}`}>
      {Array.from({ length: config.count }).map((_, index) => (
        <span
          className={config.className}
          key={index}
          style={{
            "--i": index,
            "--x": `${8 + ((index * 17) % 84)}%`,
            "--delay": `${(index % 8) * 0.09}s`,
            "--duration": `${1.5 + (index % 6) * 0.16}s`,
            "--scale": `${0.72 + (index % 5) * 0.12}`,
          }}
        />
      ))}
    </div>
  );
}
