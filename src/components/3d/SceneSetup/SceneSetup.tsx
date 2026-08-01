"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function SceneSetup() {
  const dirLightRef = useRef<THREE.DirectionalLight>(null);

  useFrame(({ clock }) => {
    if (dirLightRef.current) {
      // Slowly rotate the directional light to simulate changing sun positions
      const time = clock.getElapsedTime() * 0.05;
      dirLightRef.current.position.x = 10 * Math.cos(time);
      dirLightRef.current.position.z = 10 * Math.sin(time);
    }
  });

  return (
    <>
      {/* 1. Base ambient deep-blue light to prevent pitch-black shadows */}
      <ambientLight intensity={0.3} color="#0d172d" />

      {/* 2. Main sun light casting realistic highlights on Earth terrain */}
      <directionalLight
        ref={dirLightRef}
        position={[10, 5, 10]}
        intensity={2.0}
        color="#ffffff"
        castShadow
        shadow-mapSize={[1024, 1024]}
      />

      {/* 3. Glowing cyan neon point light representing global networks */}
      <pointLight position={[-5, 3, 4]} intensity={2.5} color="#00e5ff" distance={15} />

      {/* 4. Glowing luxury gold neon point light representing Alnoor branding */}
      <pointLight position={[5, -3, 4]} intensity={2.5} color="#f59e0b" distance={15} />
    </>
  );
}
