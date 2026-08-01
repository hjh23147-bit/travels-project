"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo } from "react";
import * as THREE from "three";
import { useAppStore } from "@/store/useAppStore";

export function useScrollAnim() {
  const { activeSection, setActiveSection } = useAppStore();

  const targetPos = useMemo(() => new THREE.Vector3(0, 0, 6.2), []);
  const targetLook = useMemo(() => new THREE.Vector3(0, 0, 0), []);
  const currentLook = useMemo(() => new THREE.Vector3(0, 0, 0), []);

  useFrame((state) => {
    if (typeof window === "undefined") return;

    const scrollY = window.scrollY;
    const height = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollY / (height || 1);

    // Calculate camera target position and lookAt point based on scroll progress:
    if (progress < 0.35) {
      // 1. Hero View: Close up Earth horizon
      targetPos.set(0, 0, 5.8);
      targetLook.set(0, 0, 0);
      if (activeSection !== "hero") {
        setActiveSection("hero");
      }
    } else if (progress < 0.72) {
      // 2. Packages View: Zoom out and shift left to show floating Drei HTML cards
      targetPos.set(-2.2, 0.4, 8.2);
      targetLook.set(1.2, 0, 0);
      if (activeSection !== "packages") {
        setActiveSection("packages");
      }
    } else {
      // 3. Mission Control View: Zoom out and shift right to align with dashboard telemetry
      targetPos.set(2.8, -0.6, 7.8);
      targetLook.set(-1.5, 0.3, 0);
      if (activeSection !== "mission-control") {
        setActiveSection("mission-control");
      }
    }

    // Smoothly interpolate camera positions (spring physics/lerp)
    state.camera.position.lerp(targetPos, 0.045);

    // Smoothly interpolate the camera lookAt target vector
    currentLook.lerp(targetLook, 0.045);
    state.camera.lookAt(currentLook);
  });
}
