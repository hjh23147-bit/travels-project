"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo } from "react";
import * as THREE from "three";
import { useAppStore } from "@/store/useAppStore";

export function useScrollAnim() {
  const { activeSection, setActiveSection } = useAppStore();

  const targetPos = useMemo(() => new THREE.Vector3(0, 0, 5.8), []);
  const targetLook = useMemo(() => new THREE.Vector3(0, 0, 0), []);
  const currentLook = useMemo(() => new THREE.Vector3(0, 0, 0), []);

  useFrame((state) => {
    if (typeof window === "undefined") return;

    const scrollY = window.scrollY;
    const height = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollY / (height || 1);

    // Get responsive screen aspect ratio (width / height)
    const aspect = state.size.width / (state.size.height || 1);
    
    // Zoom out the camera on narrow portrait screen viewports (mobile/tablet) to fit the globe & cards
    const distanceMultiplier = aspect < 1.0 ? Math.min(1.7, 1.32 / aspect) : 1.0;
    
    // Dampen horizontal camera panning on narrow viewports to avoid pushing the globe off-screen
    const horizontalPanScale = aspect < 1.0 ? aspect * 0.45 : 1.0;

    // Calculate camera target position and lookAt point based on scroll progress:
    if (progress < 0.35) {
      // 1. Hero View: Close up Earth horizon
      targetPos.set(0, 0, 5.8 * distanceMultiplier);
      targetLook.set(0, 0, 0);
      if (activeSection !== "hero") {
        setActiveSection("hero");
      }
    } else if (progress < 0.72) {
      // 2. Packages View: Zoom out and shift left to show floating cards
      targetPos.set(-2.2 * horizontalPanScale, 0.4, 8.2 * distanceMultiplier);
      targetLook.set(1.2 * horizontalPanScale, 0, 0);
      if (activeSection !== "packages") {
        setActiveSection("packages");
      }
    } else {
      // 3. Mission Control View: Zoom out and shift right to align with dashboard telemetry
      targetPos.set(2.8 * horizontalPanScale, -0.6, 7.8 * distanceMultiplier);
      targetLook.set(-1.5 * horizontalPanScale, 0.3, 0);
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
