"use client";

import { useEffect, useState, ReactNode } from "react";
import { Canvas } from "@react-three/fiber";
import { PerformanceMonitor } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";
import SceneSetup from "./SceneSetup";

interface SceneEngineProps {
  children: ReactNode;
}

export default function SceneEngine({ children }: SceneEngineProps) {
  const [mounted, setMounted] = useState(false);
  const [dpr, setDpr] = useState<number>(1.5);
  const [performanceLow, setPerformanceLow] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="fixed inset-0 z-0 bg-[#020617] flex items-center justify-center">
        {/* Simple dark backdrop loading spinner */}
        <div className="w-8 h-8 rounded-full border-2 border-gold-500/20 border-t-gold-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-0 w-full h-full pointer-events-none bg-[#020617]">
      <Canvas
        camera={{ fov: 45, near: 0.1, far: 1000, position: [0, 0, 10] }}
        gl={{
          antialias: !performanceLow,
          alpha: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2
        }}
        dpr={dpr}
        style={{ width: "100%", height: "100%", position: "absolute", top: 0, left: 0 }}
      >
        {/* Dynamic Performance Monitor to adjust DPR & anti-aliasing */}
        <PerformanceMonitor
          onIncline={() => setDpr(2.0)}
          onDecline={() => {
            setDpr(1.0);
            setPerformanceLow(true);
          }}
        >
          <SceneSetup />
          
          {children}

          {/* Post Processing: Emissive Neon Bloom Effect */}
          {!performanceLow && (
            <EffectComposer>
              <Bloom
                intensity={1.5}
                luminanceThreshold={0.2}
                luminanceSmoothing={0.9}
                mipmapBlur
              />
            </EffectComposer>
          )}
        </PerformanceMonitor>
      </Canvas>
    </div>
  );
}
