"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import * as THREE from "three";
import { latLonToVector3 } from "@/utils/math";

interface RouteProps {
  startLat: number;
  startLon: number;
  endLat: number;
  endLon: number;
  color: string;
}

function FlightRoute({ startLat, startLon, endLat, endLon, color }: RouteProps) {
  const lineRef = useRef<any>(null);
  const GLOBE_RADIUS = 2.5;

  const points = useMemo(() => {
    const start = latLonToVector3(startLat, startLon, GLOBE_RADIUS);
    const end = latLonToVector3(endLat, endLon, GLOBE_RADIUS);

    // Calculate control points for a 3D Bezier curve arching over the Earth sphere
    const midPoint = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
    const distance = start.distanceTo(end);
    
    // Extend the midpoint outward from the Earth's center based on travel distance
    const heightFactor = 1.0 + (distance * 0.15); // height varies with length of route
    const midPointOut = midPoint.clone().normalize().multiplyScalar(GLOBE_RADIUS * heightFactor);

    // Set control points to construct the arch
    const control1 = new THREE.Vector3().addVectors(start, midPointOut).multiplyScalar(0.5);
    const control2 = new THREE.Vector3().addVectors(end, midPointOut).multiplyScalar(0.5);

    const curve = new THREE.CubicBezierCurve3(start, control1, control2, end);
    // Generate points along the curve
    return curve.getPoints(50);
  }, [startLat, startLon, endLat, endLon]);

  useFrame(({ clock }) => {
    if (lineRef.current?.material) {
      // Slide the dashes along the curve to simulate airplane flight pulses
      lineRef.current.material.dashOffset = -clock.getElapsedTime() * 0.4;
    }
  });

  return (
    <Line
      ref={lineRef}
      points={points}
      color={color}
      lineWidth={1.8}
      dashed
      dashScale={30}
      dashSize={0.6}
    />
  );
}

const routesData = [
  { startLat: 15.3694, startLon: 44.1910, color: "#d4af37" }, // Sana'a -> Makkah (Gold)
  { startLat: 30.0444, startLon: 31.2357, color: "#00f0ff" }, // Cairo -> Makkah (Teal)
  { startLat: 25.2048, startLon: 55.2708, color: "#d4af37" }, // Dubai -> Makkah (Gold)
  { startLat: 51.5074, startLon: -0.1278, color: "#00f0ff" }, // London -> Makkah (Teal)
  { startLat: -6.2088, startLon: 106.8456, color: "#d4af37" } // Jakarta -> Makkah (Gold)
];

const makkahCoords = { lat: 21.3891, lon: 39.8579 };

export default function Routes() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      // Rotate the lines matching the Earth rotation (rotation.y = elapsed * 0.04)
      groupRef.current.rotation.y = clock.getElapsedTime() * 0.04;
    }
  });

  return (
    <group ref={groupRef}>
      {routesData.map((route, idx) => (
        <FlightRoute
          key={idx}
          startLat={route.startLat}
          startLon={route.startLon}
          endLat={makkahCoords.lat}
          endLon={makkahCoords.lon}
          color={route.color}
        />
      ))}
    </group>
  );
}
