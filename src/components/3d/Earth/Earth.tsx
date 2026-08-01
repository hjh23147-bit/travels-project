import { useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { latLonToVector3 } from "@/utils/math";

// Custom Fresnel Glow Shaders for the Golden Atmosphere
const AtmosphereShader = {
  vertexShader: `
    varying vec3 vNormal;
    void main() {
      vNormal = normalize(normalMatrix * normal);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    varying vec3 vNormal;
    void main() {
      // Fresnel intensity glow on sphere silhouette
      float intensity = pow(0.75 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 3.5);
      // Golden light output matching Alnoor Travels brand aesthetic
      gl_FragColor = vec4(0.85, 0.65, 0.20, 1.0) * intensity * 1.8;
    }
  `
};

const cities = [
  { name: "Sana'a", lat: 15.3694, lon: 44.1910 },
  { name: "Cairo", lat: 30.0444, lon: 31.2357 },
  { name: "Dubai", lat: 25.2048, lon: 55.2708 },
  { name: "London", lat: 51.5074, lon: -0.1278 },
  { name: "Jakarta", lat: -6.2088, lon: 106.8456 }
];

const makkahCoords = { lat: 21.3891, lon: 39.8579 };

export default function Earth() {
  const earthRef = useRef<THREE.Group>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);
  const atmosphereRef = useRef<THREE.Mesh>(null);
  const [earthTexture, setEarthTexture] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    // 1. Asynchronously load the photorealistic Earth texture from Three.js CDN
    const loader = new THREE.TextureLoader();
    loader.load(
      "https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/land_ocean_ice_cloud_2048.jpg",
      (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace;
        setEarthTexture(texture);
      },
      undefined,
      (err) => {
        console.warn("Failed to fetch Earth texture, generating holographic fallback:", err);
        // 2. Fallback: Draw a gorgeous futuristic cyan grid layout on an HTML Canvas
        const canvas = document.createElement("canvas");
        canvas.width = 1024;
        canvas.height = 512;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          // Dark space-blue background
          ctx.fillStyle = "#050b1d";
          ctx.fillRect(0, 0, 1024, 512);

          // Grid coordinates lines
          ctx.strokeStyle = "rgba(6, 182, 212, 0.15)";
          ctx.lineWidth = 1.5;
          for (let i = 0; i <= 360; i += 15) {
            const x = (i * 1024) / 360;
            ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 512); ctx.stroke();
          }
          for (let i = 0; i <= 180; i += 15) {
            const y = (i * 512) / 180;
            ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(1024, y); ctx.stroke();
          }

          // Abstract glowing continents
          ctx.fillStyle = "rgba(0, 240, 255, 0.28)";
          // Asia & Europe
          ctx.beginPath(); ctx.arc(620, 180, 95, 0, Math.PI * 2); ctx.fill();
          ctx.beginPath(); ctx.arc(710, 210, 60, 0, Math.PI * 2); ctx.fill();
          // Africa
          ctx.beginPath(); ctx.arc(520, 290, 75, 0, Math.PI * 2); ctx.fill();
          // North America
          ctx.beginPath(); ctx.arc(280, 170, 85, 0, Math.PI * 2); ctx.fill();
          // South America
          ctx.beginPath(); ctx.arc(320, 340, 70, 0, Math.PI * 2); ctx.fill();
        }
        
        const fallbackTex = new THREE.CanvasTexture(canvas);
        setEarthTexture(fallbackTex);
      }
    );
  }, []);

  useFrame(({ clock }) => {
    const elapsed = clock.getElapsedTime();

    // 1. Smooth slow auto-rotation for the Earth globe
    if (earthRef.current) {
      earthRef.current.rotation.y = elapsed * 0.04;
    }

    // 2. Rotate clouds slightly faster for atmospheric depth
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y = elapsed * 0.055;
      cloudsRef.current.rotation.x = elapsed * 0.01;
    }
  });

  // Calculate cartesian coordinates on sphere for city markers
  const GLOBE_RADIUS = 2.5;

  return (
    <group>
      {/* A. Atmosphere Outer Fresnel Glow Mesh */}
      <mesh ref={atmosphereRef} scale={1.08}>
        <sphereGeometry args={[GLOBE_RADIUS, 64, 64]} />
        <shaderMaterial
          vertexShader={AtmosphereShader.vertexShader}
          fragmentShader={AtmosphereShader.fragmentShader}
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
          transparent
        />
      </mesh>

      {/* Earth Group containing Core and Markers */}
      <group ref={earthRef}>
        {/* B. Core Earth Sphere (Luxury Deep Metallic Blue) */}
        <mesh castShadow receiveShadow>
          <sphereGeometry args={[GLOBE_RADIUS, 64, 64]} />
          <meshStandardMaterial
            color="#081026"
            roughness={0.45}
            metalness={0.85}
            emissive="#010410"
            bumpScale={0.05}
            map={earthTexture || undefined}
          />
        </mesh>

        {/* C. Cloud Layer (Semi-transparent additive sphere) */}
        <mesh ref={cloudsRef} scale={1.015}>
          <sphereGeometry args={[GLOBE_RADIUS, 64, 64]} />
          <meshStandardMaterial
            color="#ffffff"
            transparent
            opacity={0.15}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>

        {/* D. Glowing City Nodes (Sub-markers) */}
        {cities.map((city) => {
          const pos = latLonToVector3(city.lat, city.lon, GLOBE_RADIUS);
          return (
            <group key={city.name} position={pos}>
              {/* Outer Pulsing Ring */}
              <mesh>
                <ringGeometry args={[0.04, 0.07, 16]} />
                <meshBasicMaterial color="#00f0ff" side={THREE.DoubleSide} transparent opacity={0.6} />
              </mesh>
              {/* Inner Core Point */}
              <mesh>
                <sphereGeometry args={[0.025, 8, 8]} />
                <meshBasicMaterial color="#00ffff" />
              </mesh>
            </group>
          );
        })}

        {/* E. Main Destination Makkah Marker with a Glowing Vertical Light Pillar */}
        {(() => {
          const makkahPos = latLonToVector3(makkahCoords.lat, makkahCoords.lon, GLOBE_RADIUS);
          
          // Calculate normal vector pointing out from the sphere center to align the light pillar
          const upVector = new THREE.Vector3(0, 1, 0);
          const alignRotation = new THREE.Quaternion().setFromUnitVectors(upVector, makkahPos.clone().normalize());

          return (
            <group position={makkahPos} quaternion={alignRotation}>
              {/* Pulsing golden rings */}
              <mesh rotation={[-Math.PI / 2, 0, 0]}>
                <ringGeometry args={[0.06, 0.12, 16]} />
                <meshBasicMaterial color="#d4af37" side={THREE.DoubleSide} transparent opacity={0.7} />
              </mesh>
              <mesh>
                <sphereGeometry args={[0.04, 12, 12]} />
                <meshBasicMaterial color="#f59e0b" />
              </mesh>
              
              {/* Vertical Light Pillar pointing outward into space */}
              <mesh position={[0, 0.5, 0]}>
                <cylinderGeometry args={[0.015, 0.05, 1.0, 8, 1, true]} />
                <meshBasicMaterial
                  color="#d4af37"
                  transparent
                  opacity={0.35}
                  blending={THREE.AdditiveBlending}
                  side={THREE.DoubleSide}
                />
              </mesh>
            </group>
          );
        })()}
      </group>
    </group>
  );
}
