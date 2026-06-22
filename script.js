const dice = document.querySelector("#dice");
const rollButton = document.querySelector("#rollButton");
const resultCard = document.querySelector("#resultCard");
const resultTitle = document.querySelector("#result-title");
const resultVisual = document.querySelector("#resultVisual");
const resultKind = document.querySelector("#resultKind");
const resultText = document.querySelector("#resultText");

const faces = [
  {
    id: 1,
    name: "Primavera",
    image: "assets/dado-primavera.png",
    kind: "Recompensa",
    effect: "Roba 2 cartas de hongo.",
    transform: "rotateX(0deg) rotateY(0deg)",
  },
  {
    id: 2,
    name: "Verano",
    image: "assets/dado-verano.png",
    kind: "Recompensa",
    effect: "Gana 1 punto por cada hongo de Pastizal que tengas.",
    transform: "rotateX(0deg) rotateY(-90deg)",
  },
  {
    id: 3,
    name: "Otoño",
    image: "assets/dado-otono.png",
    kind: "Recompensa",
    effect: "Avanza 2 casillas.",
    transform: "rotateX(0deg) rotateY(-180deg)",
  },
  {
    id: 4,
    name: "Invierno",
    image: "assets/dado-invierno.png",
    kind: "Penalización",
    effect: "Descarta 1 carta de tu mano.",
    transform: "rotateX(0deg) rotateY(90deg)",
  },
  {
    id: 5,
    name: "Temporada de lluvias",
    image: "assets/dado-temporada-de-lluvias.png",
    kind: "Recompensa",
    effect: "Todos los jugadores roban 1 carta de hongo.",
    transform: "rotateX(-90deg) rotateY(0deg)",
  },
  {
    id: 6,
    name: "Temporada de sequía",
    image: "assets/dado-temporada-de-sequia.png",
    kind: "Penalización",
    effect: "Retrocede 2 casillas.",
    transform: "rotateX(90deg) rotateY(0deg)",
  },
];

let lastFace = null;
let extraTurns = 0;

function chooseFace() {
  let nextFace = faces[Math.floor(Math.random() * faces.length)];

  if (faces.length > 1) {
    while (nextFace.id === lastFace) {
      nextFace = faces[Math.floor(Math.random() * faces.length)];
    }
  }

  lastFace = nextFace.id;
  return nextFace;
}

function setResult(face) {
  resultCard.className = `result-card theme-${face.id}`;
  resultTitle.textContent = face.name;
  resultVisual.src = face.image;
  resultVisual.alt = face.name;
  resultVisual.removeAttribute("aria-hidden");
  resultKind.textContent = face.kind;
  resultText.textContent = face.effect;
}

function rollDice() {
  const face = chooseFace();

  rollButton.disabled = true;
  rollButton.textContent = "Lanzando...";
  dice.classList.add("rolling");

  window.setTimeout(() => {
    extraTurns += 4;
    dice.classList.remove("rolling");
    dice.style.transform = `${face.transform} rotateZ(${extraTurns * 360}deg)`;
    setResult(face);
    rollButton.disabled = false;
    rollButton.textContent = "Lanzar dado";
  }, 1100);
}

rollButton.addEventListener("click", rollDice);
