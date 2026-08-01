"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import * as THREE from "three";

export default function SpaceBg() {
  const starsRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (starsRef.current) {
      // Very slow rotation of the galaxy background
      starsRef.current.rotation.y = clock.getElapsedTime() * 0.005;
      starsRef.current.rotation.x = clock.getElapsedTime() * 0.002;
    }
  });

  return (
    <group ref={starsRef}>
      <Stars
        radius={120}
        depth={60}
        count={6000}
        factor={6}
        saturation={0.5}
        fade
        speed={1}
      />
    </group>
  );
}
