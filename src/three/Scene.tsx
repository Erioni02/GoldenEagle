import { Component, Suspense, useEffect, useRef, type ReactNode } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Lightformer } from '@react-three/drei';
import { journey, intro, pointer, layout, FOV } from '../lib/journey';
import { stage } from './stage';
import { HeroCan } from './HeroCan';
import { FloorGlow, SoftShadow } from './Atmosphere';

const damp = THREE.MathUtils.damp;
const tmp = new THREE.Color();

/** Derives the shared stage pose once per frame, before every other frame callback. */
function StageDriver() {
  useFrame((state, dt) => {
    const t = state.clock.elapsedTime;
    stage.time = t;
    const k = layout.mobile ? 0.45 : 1;
    const live = intro.p;
    stage.tiltX = damp(stage.tiltX, pointer.y * 0.14 * k * live, 3, dt);
    stage.tiltY = damp(stage.tiltY, pointer.x * 0.3 * k * live, 3, dt);
    stage.x = journey.x;
    stage.y = journey.y + (1 - live) * -2.6;
    stage.z = journey.z;
    stage.s = journey.s * (0.86 + 0.14 * live);

    const margin = 0.05 * stage.s;
    const bottom = stage.y - stage.s / 2 - margin;
    const top = stage.y + stage.s / 2 + margin;
    stage.edgeY = journey.reveal <= 0.0005 ? -100 : bottom + journey.reveal * (top - bottom);

    tmp.set(journey.bg);
    const l = 0.2126 * tmp.r + 0.7152 * tmp.g + 0.0722 * tmp.b;
    stage.lightness = THREE.MathUtils.smoothstep(l, 0.25, 0.7);
  }, -2);
  return null;
}

function CameraRig() {
  const { camera } = useThree();
  const look = useRef(new THREE.Vector3());
  useFrame((_, dt) => {
    const px = pointer.x * 0.07 * intro.p;
    const py = pointer.y * 0.045 * intro.p;
    camera.position.x = damp(camera.position.x, px, 2.5, dt);
    camera.position.y = damp(camera.position.y, py, 2.5, dt);
    camera.position.z = journey.camZ;
    look.current.set(0, 0, 0);
    camera.lookAt(look.current);
  }, -1);
  return null;
}

function Lights() {
  const rimL = useRef<THREE.DirectionalLight>(null);
  const rimR = useRef<THREE.DirectionalLight>(null);
  const key = useRef<THREE.SpotLight>(null);
  useFrame(() => {
    rimL.current?.color.set(journey.rim);
    rimR.current?.color.set(journey.rim);
    if (key.current) key.current.intensity = 34 + 40 * journey.spot * intro.light;
  });
  return (
    <>
      <ambientLight intensity={0.18} />
      <spotLight ref={key} position={[1.6, 4.6, 4.2]} angle={0.42} penumbra={1} decay={2} intensity={60} color="#fff1d6" />
      <directionalLight ref={rimL} position={[-4.5, 1.8, -2.5]} intensity={2.6} />
      <directionalLight ref={rimR} position={[4.5, 2.4, -2.5]} intensity={2.2} />
      <directionalLight position={[0, -2.5, 5]} intensity={0.35} color="#ffe6c0" />
    </>
  );
}

/** Procedural studio: soft boxes and strip lights rendered once into the environment map. */
function Studio() {
  return (
    <Environment resolution={256} frames={1}>
      <color attach="background" args={['#070605']} />
      <Lightformer form="rect" intensity={2.2} position={[0, 5, 1]} rotation-x={Math.PI / 2} scale={[8, 3, 1]} color="#fff6e6" />
      <Lightformer form="rect" intensity={5} position={[-3.2, 0.4, 1.6]} rotation-y={Math.PI / 2.4} scale={[0.55, 7, 1]} color="#ffffff" />
      <Lightformer form="rect" intensity={3.4} position={[3.2, 0.4, 1.2]} rotation-y={-Math.PI / 2.4} scale={[0.35, 7, 1]} color="#fff2dc" />
      <Lightformer form="rect" intensity={1.6} position={[0, 0.6, 5]} scale={[2.2, 5, 1]} color="#f6e3bd" />
      <Lightformer form="ring" intensity={2.2} position={[0, 1.2, -6]} scale={5} color="#d9a948" />
      <Lightformer form="rect" intensity={0.9} position={[0, -4, 1]} rotation-x={-Math.PI / 2} scale={[10, 4, 1]} color="#5a4626" />
    </Environment>
  );
}

/** Pause the GPU while an opaque chapter fully covers the stage. */
function FrameGate({ active }: { active: boolean }) {
  const setFrameloop = useThree((s) => s.setFrameloop);
  useEffect(() => {
    setFrameloop(active ? 'always' : 'never');
  }, [active, setFrameloop]);
  return null;
}

class WebGLBoundary extends Component<{ fallback: ReactNode; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(err: unknown) {
    console.warn('[golden-eagle] WebGL stage disabled:', err);
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

export function webglAvailable() {
  try {
    const c = document.createElement('canvas');
    return !!c.getContext('webgl2');
  } catch {
    return false;
  }
}

export function Scene({ active, fallback }: { active: boolean; fallback: ReactNode }) {
  return (
    <WebGLBoundary fallback={fallback}>
      <div className="webgl" aria-hidden="true">
        <Canvas
          dpr={[1, 1.75]}
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance', stencil: false }}
          camera={{ fov: FOV, near: 0.1, far: 60, position: [0, 0, 4.4] }}
          onCreated={({ gl }) => {
            gl.setClearColor(0x000000, 0);
            gl.toneMapping = THREE.NeutralToneMapping;
            gl.toneMappingExposure = 1.02;
            gl.localClippingEnabled = true;
          }}
        >
          <FrameGate active={active} />
          <StageDriver />
          <CameraRig />
          <Lights />
          <Suspense fallback={null}>
            <Studio />
            <FloorGlow />
            <SoftShadow />
            <HeroCan />
          </Suspense>
        </Canvas>
      </div>
    </WebGLBoundary>
  );
}
