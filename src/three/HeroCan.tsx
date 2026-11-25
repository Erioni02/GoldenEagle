import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { journey, intro } from '../lib/journey';
import { stage, CAN_RADIUS } from './stage';

export const MODEL_URL = '/models/golden_eagle_can.glb';
/** rotation that turns the eagle artwork toward the camera */
export const FRONT_RY = 0;
const WHITE = new THREE.Color('#ffffff');

/**
 * The real-time Golden Eagle Classic — the project's own GLB, re-lit with
 * physically based aluminium + clear-coated printed label. A world-space clipping
 * plane lets it dissolve upward into the photographed editions.
 */
export function HeroCan() {
  const gltf = useGLTF(MODEL_URL);
  const clip = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 1, 0), 100), []);

  const parts = useMemo(() => {
    let label: THREE.Mesh | undefined;
    let alu: THREE.Mesh | undefined;
    gltf.scene.traverse((o) => {
      const m = o as THREE.Mesh;
      if (!m.isMesh) return;
      if ((m.material as THREE.Material).name === 'Label') label = m;
      else alu = m;
    });
    if (!label || !alu) throw new Error('Golden Eagle can: expected Label + Aluminium meshes');
    const srcLabel = label.material as THREE.MeshStandardMaterial;
    const srcAlu = alu.material as THREE.MeshStandardMaterial;
    const map = srcLabel.map!;
    map.anisotropy = 8;
    const labelMat = new THREE.MeshPhysicalMaterial({
      map,
      metalness: 0.55,
      roughness: 0.3,
      clearcoat: 1,
      clearcoatRoughness: 0.05,
      envMapIntensity: 1.1,
      clippingPlanes: [clip],
    });
    const aluMat = new THREE.MeshPhysicalMaterial({
      color: srcAlu.color.clone(),
      metalness: 1,
      roughness: 0.2,
      clearcoat: 0.5,
      clearcoatRoughness: 0.1,
      envMapIntensity: 1.3,
      clippingPlanes: [clip],
      side: THREE.DoubleSide,
    });
    return { labelGeo: label.geometry, aluGeo: alu.geometry, labelMat, aluMat };
  }, [gltf, clip]);

  useEffect(
    () => () => {
      parts.labelMat.dispose();
      parts.aluMat.dispose();
    },
    [parts],
  );

  const outer = useRef<THREE.Group>(null);
  const spin = useRef<THREE.Group>(null);
  const ring = useRef<THREE.Mesh>(null);
  const ringMat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: '#ffd987',
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        toneMapped: false,
      }),
    [],
  );

  useFrame(() => {
    const g = outer.current;
    const sp = spin.current;
    if (!g || !sp) return;
    const e = intro.p;
    const hidden = journey.reveal > 0.999;
    g.visible = !hidden;
    if (hidden) return;

    g.position.set(stage.x, stage.y, stage.z);
    g.rotation.set(journey.rx + stage.tiltX, 0, journey.rz - stage.tiltY * 0.12);
    sp.rotation.y = FRONT_RY + journey.ry + (1 - e) * -5.4 + stage.tiltY;
    g.scale.setScalar(stage.s);

    clip.constant = -stage.edgeY;

    if (ring.current) {
      const active = journey.reveal > 0.001 && journey.reveal < 0.999;
      ring.current.visible = active;
      if (active) {
        // ring lives in the outer group's local space
        ring.current.position.y = (stage.edgeY - stage.y) / stage.s;
        const rm = ring.current.material as THREE.MeshBasicMaterial;
        rm.color.set(journey.rim).lerp(WHITE, 0.35);
        rm.opacity = Math.sin(Math.PI * journey.reveal);
      }
    }
  });

  return (
    <group ref={outer}>
      <group ref={spin}>
        <mesh geometry={parts.aluGeo} material={parts.aluMat} />
        <mesh geometry={parts.labelGeo} material={parts.labelMat} />
      </group>
      <mesh ref={ring} rotation-x={Math.PI / 2} material={ringMat} visible={false}>
        <torusGeometry args={[CAN_RADIUS * 1.015, 0.0035, 8, 96]} />
      </mesh>
    </group>
  );
}

useGLTF.preload(MODEL_URL);
