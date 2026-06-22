import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Environment } from "@react-three/drei";
import { Physics } from "@react-three/cannon";
import * as THREE from "three";
import { diceFaces, faceRotations } from "../data/diceFaces.js";

const materialOrder = [
  diceFaces[1],
  diceFaces[2],
  diceFaces[3],
  diceFaces[4],
  diceFaces[0],
  diceFaces[5],
];

function createFaceTexture(face) {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");

  const gradient = ctx.createLinearGradient(0, 0, 512, 512);
  gradient.addColorStop(0, "#fff1c9");
  gradient.addColorStop(0.45, face.color);
  gradient.addColorStop(1, "#d4a165");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 512, 512);

  ctx.strokeStyle = "rgba(71, 42, 16, 0.52)";
  ctx.lineWidth = 18;
  ctx.strokeRect(16, 16, 480, 480);
  ctx.strokeStyle = "rgba(255, 247, 219, 0.48)";
  ctx.lineWidth = 6;
  ctx.strokeRect(36, 36, 440, 440);

  ctx.fillStyle = "rgba(43, 28, 16, 0.9)";
  ctx.font = "700 54px Georgia";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const words = face.label.toUpperCase().split(" ");
  words.forEach((word, index) => {
    const offset = (index - (words.length - 1) / 2) * 58;
    ctx.fillText(word, 256, 256 + offset);
  });

  ctx.fillStyle = face.accent;
  ctx.beginPath();
  ctx.arc(256, 366, 22, 0, Math.PI * 2);
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

function DiceMesh({ selectedFace, rolling }) {
  const diceRef = useRef();
  const [targetRotation, setTargetRotation] = useState([0.45, -0.62, 0.15]);
  const spinRef = useRef(0);

  const materials = useMemo(
    () =>
      materialOrder.map((face) => {
        const texture = createFaceTexture(face);
        return new THREE.MeshStandardMaterial({
          map: texture,
          roughness: 0.62,
          metalness: 0.02,
        });
      }),
    []
  );

  useEffect(() => {
    if (!selectedFace) return;
    const base = faceRotations[selectedFace.id];
    spinRef.current += 1;
    setTargetRotation([
      base[0] + Math.PI * 2 * spinRef.current,
      base[1] + Math.PI * 2 * (spinRef.current + 1),
      base[2] + Math.PI * 2 * (spinRef.current + 2),
    ]);
  }, [selectedFace]);

  useFrame((_, delta) => {
    if (!diceRef.current) return;

    if (rolling) {
      diceRef.current.rotation.x += delta * 7.5;
      diceRef.current.rotation.y += delta * 9;
      diceRef.current.rotation.z += delta * 5.5;
      return;
    }

    diceRef.current.rotation.x = THREE.MathUtils.lerp(diceRef.current.rotation.x, targetRotation[0], 0.09);
    diceRef.current.rotation.y = THREE.MathUtils.lerp(diceRef.current.rotation.y, targetRotation[1], 0.09);
    diceRef.current.rotation.z = THREE.MathUtils.lerp(diceRef.current.rotation.z, targetRotation[2], 0.09);
  });

  return (
    <group ref={diceRef} position={[0, 0.1, 0]}>
      <mesh castShadow receiveShadow material={materials}>
        <boxGeometry args={[2.4, 2.4, 2.4]} />
      </mesh>
    </group>
  );
}

export default function Dice3D({ selectedFace, rolling }) {
  return (
    <div className="dice-canvas" aria-label="Dado 3D de FungiTruco">
      <Canvas shadows camera={{ position: [3.4, 3.1, 5.4], fov: 42 }}>
        <ambientLight intensity={0.8} />
        <directionalLight position={[3.5, 4, 5]} intensity={1.7} castShadow />
        <Environment preset="apartment" />
        <Physics gravity={[0, -1, 0]}>
          <DiceMesh selectedFace={selectedFace} rolling={rolling} />
        </Physics>
        <ContactShadows position={[0, -1.45, 0]} opacity={0.42} scale={7} blur={2.8} far={4} />
      </Canvas>
    </div>
  );
}
