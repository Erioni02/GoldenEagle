import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { journey, intro } from '../lib/journey';
import { stage } from './stage';

/** uniforms of the material actually bound to the object (never a stale memo copy) */
const live = (o: THREE.Mesh) => (o.material as THREE.ShaderMaterial).uniforms as Record<string, THREE.IUniform>;

const VERT = /* glsl */ `
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
`;

/**
 * Where the top light lands under the standing can: a soft warm-white pool with a
 * contact shadow at its centre. Shown only while the can stands in the opening and closing frames.
 */
export function FloorGlow() {
  const mesh = useRef<THREE.Mesh>(null);
  const uniforms = useMemo(() => ({ uOpacity: { value: 0 } }), []);
  useFrame(() => {
    if (!mesh.current) return;
    const o = journey.spot * intro.light;
    live(mesh.current).uOpacity.value = o;
    mesh.current.visible = o > 0.005;
    mesh.current.position.set(stage.x, stage.y - stage.s * 0.5 - 0.015, stage.z);
    const sc = stage.s * 1.6;
    mesh.current.scale.set(sc, sc, sc);
  });
  return (
    <mesh ref={mesh} rotation-x={-Math.PI / 2} renderOrder={-1}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        uniforms={uniforms}
        transparent
        premultipliedAlpha
        depthWrite={false}
        vertexShader={VERT}
        fragmentShader={/* glsl */ `
          uniform float uOpacity;
          varying vec2 vUv;
          void main() {
            vec2 p = (vUv - 0.5) * 2.0;
            float r = length(p);
            float pool = exp(-r * r * 6.0) * 0.16;
            float contact = smoothstep(0.26, 0.0, r);
            // light adds (alpha 0), the contact shadow occludes (alpha > 0)
            vec3 light = vec3(1.0, 0.95, 0.86) * pool * (1.0 - contact) * uOpacity;
            gl_FragColor = vec4(light, contact * 0.55 * uOpacity);
          }
        `}
      />
    </mesh>
  );
}

/** Soft ground shadow that only appears when the stage turns light (Beyond energy chapters). */
export function SoftShadow() {
  const mesh = useRef<THREE.Mesh>(null);
  const uniforms = useMemo(() => ({ uOpacity: { value: 0 } }), []);
  useFrame(() => {
    if (!mesh.current) return;
    const o = stage.lightness * Math.min(1, journey.reveal * 1.2);
    live(mesh.current).uOpacity.value = o;
    mesh.current.visible = o > 0.01;
    mesh.current.position.set(stage.x, stage.y - stage.s * 0.5 + 0.01, stage.z - 0.05);
    mesh.current.scale.set(stage.s * 0.9, stage.s * 0.16, 1);
  });
  return (
    <mesh ref={mesh} renderOrder={1} visible={false}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        uniforms={uniforms}
        transparent
        depthWrite={false}
        vertexShader={VERT}
        fragmentShader={/* glsl */ `
          uniform float uOpacity;
          varying vec2 vUv;
          void main() {
            vec2 p = (vUv - 0.5) * 2.0;
            float d = length(p);
            float a = exp(-d * d * 4.0) * 0.38 * uOpacity;
            gl_FragColor = vec4(vec3(0.08, 0.06, 0.03), a);
          }
        `}
      />
    </mesh>
  );
}
