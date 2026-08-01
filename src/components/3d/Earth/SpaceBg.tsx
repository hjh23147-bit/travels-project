import { useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import * as THREE from "three";

export default function SpaceBg() {
  const starsRef = useRef<THREE.Group>(null);
  const [starCount, setStarCount] = useState(6000);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setStarCount(window.innerWidth < 768 ? 2000 : 6000);
    }
  }, []);

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
        count={starCount}
        factor={6}
        saturation={0.5}
        fade
        speed={1}
      />
    </group>
  );
}
