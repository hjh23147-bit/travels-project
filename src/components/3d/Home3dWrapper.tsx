"use client";

import SceneEngine from "./SceneSetup/SceneEngine";
import SpaceBg from "./Earth/SpaceBg";
import Earth from "./Earth/Earth";
import Routes from "./Routes/Routes";
import PackageCards from "./FloatingCards/PackageCards";
import CameraController from "./SceneSetup/CameraController";

export default function Home3dWrapper() {
  return (
    <SceneEngine>
      <CameraController />
      <SpaceBg />
      <Earth />
      <Routes />
      <PackageCards />
    </SceneEngine>
  );
}
