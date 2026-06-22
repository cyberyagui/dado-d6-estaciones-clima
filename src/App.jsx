import { useCallback, useState } from "react";
import Dice3D from "./components/Dice3D.jsx";
import DiceResult from "./components/DiceResult.jsx";
import { diceFaces } from "./data/diceFaces.js";

function pickRandomFace(previousFace) {
  let nextFace = diceFaces[Math.floor(Math.random() * diceFaces.length)];

  if (diceFaces.length > 1) {
    while (previousFace?.id === nextFace.id) {
      nextFace = diceFaces[Math.floor(Math.random() * diceFaces.length)];
    }
  }

  return nextFace;
}

export default function App() {
  const [selectedFace, setSelectedFace] = useState(null);
  const [pendingFace, setPendingFace] = useState(null);
  const [rolling, setRolling] = useState(false);

  const rollDice = useCallback(() => {
    if (rolling) return;

    const nextFace = pickRandomFace(selectedFace);
    setPendingFace(nextFace);
    setRolling(true);

    window.setTimeout(() => {
      setSelectedFace(nextFace);
      setRolling(false);
      setPendingFace(null);
    }, 1250);
  }, [rolling, selectedFace]);

  return (
    <main className="app-shell">
      <section className="game-panel">
        <header className="app-header">
          <p>FungiTruco</p>
          <h1>Dado D6</h1>
        </header>

        <Dice3D selectedFace={pendingFace || selectedFace} rolling={rolling} />

        <button className="roll-button" type="button" onClick={rollDice} disabled={rolling}>
          {rolling ? "Girando..." : "Tirar dado"}
        </button>

        <DiceResult face={selectedFace} />
      </section>
    </main>
  );
}
