import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Environment, RoundedBox, useTexture } from "@react-three/drei";
import { Physics } from "@react-three/cannon";
import * as THREE from "three";
import { diceFaces, faceRotations, facesById } from "../data/diceFaces.js";

const facePlanes = [
  {
    face: facesById.primavera,
    position: [0, 0, 1.226],
    rotation: [0, 0, 0],
  },
  {
    face: facesById.sequia,
    position: [0, 0, -1.226],
    rotation: [0, Math.PI, 0],
  },
  {
    face: facesById.verano,
    position: [1.226, 0, 0],
    rotation: [0, Math.PI / 2, 0],
  },
  {
    face: facesById.otono,
    position: [-1.226, 0, 0],
    rotation: [0, -Math.PI / 2, 0],
  },
  {
    face: facesById.invierno,
    position: [0, 1.226, 0],
    rotation: [-Math.PI / 2, 0, 0],
  },
  {
    face: facesById.lluvia,
    position: [0, -1.226, 0],
    rotation: [Math.PI / 2, 0, 0],
  },
];

function DiceFace({ face, position, rotation }) {
  const texture = useTexture(face.texture);

  useMemo(() => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 8;
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.magFilter = THREE.LinearFilter;
  }, [texture]);

  return (
    <group position={position} rotation={rotation}>
      <mesh castShadow receiveShadow>
        <planeGeometry args={[1.86, 2.18]} />
        <meshStandardMaterial
          map={texture}
          roughness={0.74}
          metalness={0.02}
          polygonOffset
          polygonOffsetFactor={-1}
        />
      </mesh>
      <mesh position={[0, 0, -0.006]}>
        <planeGeometry args={[2.02, 2.34]} />
        <meshStandardMaterial color="#d7ad72" roughness={0.82} metalness={0.02} />
      </mesh>
    </group>
  );
}

function DiceMesh({ selectedFace, rolling }) {
  const diceRef = useRef();
  const [targetRotation, setTargetRotation] = useState([0.45, -0.62, 0.15]);
  const spinRef = useRef(0);
  const rollClock = useRef(0);

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
      rollClock.current += delta;
      diceRef.current.position.y = 0.1 + Math.abs(Math.sin(rollClock.current * 8)) * 0.42;
      diceRef.current.rotation.x += delta * 8.2;
      diceRef.current.rotation.y += delta * 10.4;
      diceRef.current.rotation.z += delta * 6.1;
      return;
    }

    rollClock.current = 0;
    diceRef.current.position.y = THREE.MathUtils.lerp(diceRef.current.position.y, 0.1, 0.14);
    diceRef.current.rotation.x = THREE.MathUtils.lerp(diceRef.current.rotation.x, targetRotation[0], 0.1);
    diceRef.current.rotation.y = THREE.MathUtils.lerp(diceRef.current.rotation.y, targetRotation[1], 0.1);
    diceRef.current.rotation.z = THREE.MathUtils.lerp(diceRef.current.rotation.z, targetRotation[2], 0.1);
  });

  return (
    <group ref={diceRef} position={[0, 0.1, 0]}>
      <RoundedBox args={[2.5, 2.5, 2.5]} radius={0.22} smoothness={8} castShadow receiveShadow>
        <meshStandardMaterial color="#c99a61" roughness={0.72} metalness={0.03} />
      </RoundedBox>
      {facePlanes.map((plane) => (
        <DiceFace key={plane.face.id} {...plane} />
      ))}
    </group>
  );
}

export default function Dice3D({ selectedFace, rolling }) {
  return (
    <div className="dice-canvas" aria-label="Dado 3D de FungiTruco">
      <Canvas shadows camera={{ position: [3.4, 3.1, 5.4], fov: 42 }}>
        <ambientLight intensity={0.82} />
        <directionalLight position={[3.5, 4, 5]} intensity={1.8} castShadow />
        <pointLight position={[-3, 2, 2]} intensity={0.65} color="#ffdca3" />
        <Environment preset="apartment" />
        <Physics gravity={[0, -1, 0]}>
          <DiceMesh selectedFace={selectedFace || diceFaces[0]} rolling={rolling} />
        </Physics>
        <ContactShadows position={[0, -1.48, 0]} opacity={0.44} scale={7} blur={2.8} far={4} />
      </Canvas>
    </div>
  );
}
