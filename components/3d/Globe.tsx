"use client";

import { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, Line, useTexture } from '@react-three/drei';
import * as THREE from 'three';

// ── Helpers ──────────────────────────────────────────────────────
function latLngToVector3(lat: number, lng: number, radius: number = 1): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -(radius * Math.sin(phi) * Math.cos(theta)),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

// ── Travel Data ──────────────────────────────────────────────────
const DESTINATIONS = [
  { name: "New York",   lat: 40.7128,  lng: -74.006   },
  { name: "London",     lat: 51.5074,  lng: -0.1278   },
  { name: "Tokyo",      lat: 35.6762,  lng: 139.6503  },
  { name: "Dubai",      lat: 25.2048,  lng: 55.2708   },
  { name: "Paris",      lat: 48.8566,  lng: 2.3522    },
  { name: "Sydney",     lat: -33.8688, lng: 151.2093  },
  { name: "Singapore",  lat: 1.3521,   lng: 103.8198  },
  { name: "Los Angeles",lat: 34.0522,  lng: -118.2437 },
  { name: "Mumbai",     lat: 19.076,   lng: 72.8777   },
  { name: "Rio",        lat: -22.9068, lng: -43.1729  },
  { name: "Cape Town",  lat: -33.9249, lng: 18.4241   },
  { name: "Bali",       lat: -8.3405,  lng: 115.092   },
];

const ROUTES: [number, number][] = [
  [0, 1],  // NYC → London
  [1, 4],  // London → Paris
  [1, 3],  // London → Dubai
  [3, 6],  // Dubai → Singapore
  [6, 2],  // Singapore → Tokyo
  [2, 7],  // Tokyo → LA
  [7, 0],  // LA → NYC
  [3, 8],  // Dubai → Mumbai
  [8, 6],  // Mumbai → Singapore
  [0, 9],  // NYC → Rio
  [1, 10], // London → Cape Town
  [6, 11], // Singapore → Bali
  [5, 11], // Sydney → Bali
  [6, 5],  // Singapore → Sydney
];

// ── Realistic Earth ─────────────────────────────────────────────
function RealisticEarth() {
  const earthRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const markersRef = useRef<THREE.Group>(null);

  // Load locally-hosted textures for reliability
  const [colorMap, bumpMap] = useTexture([
    '/textures/earth-dark.jpg',
    '/textures/earth-topology.png',
  ]);

  // Pre-calculate route arcs
  const routeCurves = useMemo(() => {
    return ROUTES.map(([fromIdx, toIdx]) => {
      const from = DESTINATIONS[fromIdx];
      const to = DESTINATIONS[toIdx];
      const start = latLngToVector3(from.lat, from.lng, 1.005);
      const end = latLngToVector3(to.lat, to.lng, 1.005);

      // Push midpoint outward for a nice arc
      const mid = start.clone().lerp(end, 0.5);
      const dist = start.distanceTo(end);
      mid.normalize().multiplyScalar(1 + dist * 0.35);

      const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
      return curve.getPoints(64);
    });
  }, []);

  // Pre-calculate marker positions
  const markerPositions = useMemo(() => {
    return DESTINATIONS.map(d => latLngToVector3(d.lat, d.lng, 1.008));
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    // Slow auto-rotation
    if (earthRef.current) earthRef.current.rotation.y += 0.0006;

    // Mouse parallax
    if (groupRef.current) {
      const tx = (state.pointer.x * Math.PI) / 14;
      const ty = (state.pointer.y * Math.PI) / 14;
      groupRef.current.rotation.y += 0.04 * (tx - groupRef.current.rotation.y);
      groupRef.current.rotation.x += 0.04 * (ty - groupRef.current.rotation.x);
    }

    // Pulse markers
    if (markersRef.current) {
      markersRef.current.children.forEach((marker, i) => {
        const s = 1 + 0.4 * Math.sin(t * 2.5 + i * 0.7);
        marker.scale.setScalar(s);
      });
    }
  });

  const S = 2; // Globe scale

  return (
    <group ref={groupRef}>
      {/* ── Atmosphere Layers ── */}
      <mesh scale={S * 1.12}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshBasicMaterial color="#00bbff" transparent opacity={0.025} side={THREE.BackSide} />
      </mesh>
      <mesh scale={S * 1.06}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshBasicMaterial color="#0066ff" transparent opacity={0.05} side={THREE.BackSide} />
      </mesh>

      {/* ── Main Earth ── */}
      <mesh ref={earthRef} scale={S}>
        <sphereGeometry args={[1, 128, 128]} />
        <meshPhongMaterial
          map={colorMap}
          bumpMap={bumpMap}
          bumpScale={0.015}
          specular={new THREE.Color('#0a1a3a')}
          shininess={8}
          emissive={new THREE.Color('#001020')}
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* ── Travel Routes ── */}
      <group scale={S}>
        {routeCurves.map((pts, i) => (
          <Line
            key={`route-${i}`}
            points={pts}
            color="#00ffff"
            lineWidth={1.3}
            transparent
            opacity={0.4}
          />
        ))}

        {/* Route endpoint glow nodes */}
        {ROUTES.map(([fromIdx, toIdx], i) => {
          const startPos = latLngToVector3(DESTINATIONS[fromIdx].lat, DESTINATIONS[fromIdx].lng, 1.005);
          const endPos = latLngToVector3(DESTINATIONS[toIdx].lat, DESTINATIONS[toIdx].lng, 1.005);
          return (
            <group key={`endpoints-${i}`}>
              <mesh position={startPos}>
                <sphereGeometry args={[0.006, 8, 8]} />
                <meshBasicMaterial color="#ffffff" />
              </mesh>
              <mesh position={endPos}>
                <sphereGeometry args={[0.006, 8, 8]} />
                <meshBasicMaterial color="#ffffff" />
              </mesh>
            </group>
          );
        })}
      </group>

      {/* ── Destination Markers (Pulsing) ── */}
      <group ref={markersRef} scale={S}>
        {markerPositions.map((pos, i) => (
          <group key={`marker-${i}`} position={pos}>
            {/* Core dot */}
            <mesh>
              <sphereGeometry args={[0.012, 12, 12]} />
              <meshBasicMaterial color="#00ffff" />
            </mesh>
            {/* Glow ring */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <ringGeometry args={[0.018, 0.028, 32]} />
              <meshBasicMaterial color="#00ffff" transparent opacity={0.35} side={THREE.DoubleSide} />
            </mesh>
            {/* Outer pulse ring */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <ringGeometry args={[0.03, 0.035, 32]} />
              <meshBasicMaterial color="#00ffff" transparent opacity={0.12} side={THREE.DoubleSide} />
            </mesh>
          </group>
        ))}
      </group>

      {/* ── Orbit Rings ── */}
      <mesh rotation={[Math.PI / 3, 0, 0]} scale={S}>
        <torusGeometry args={[1.3, 0.0015, 16, 128]} />
        <meshBasicMaterial color="#00ffff" transparent opacity={0.15} />
      </mesh>
      <mesh rotation={[-Math.PI / 4.5, Math.PI / 5, 0]} scale={S}>
        <torusGeometry args={[1.42, 0.001, 16, 128]} />
        <meshBasicMaterial color="#0055ff" transparent opacity={0.1} />
      </mesh>
      <mesh rotation={[Math.PI / 2.2, Math.PI / 8, Math.PI / 6]} scale={S}>
        <torusGeometry args={[1.55, 0.0008, 16, 128]} />
        <meshBasicMaterial color="#0033aa" transparent opacity={0.07} />
      </mesh>
    </group>
  );
}

// ── Star Field ──────────────────────────────────────────────────
function StarField() {
  const count = 2500;
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3]     = (Math.random() - 0.5) * 25;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 25;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 25;
    }
    return arr;
  }, []);

  const ref = useRef<THREE.Points>(null);
  useFrame(() => { if (ref.current) ref.current.rotation.y -= 0.00012; });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        size={0.012}
        color="#88ccff"
        transparent
        opacity={0.5}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  );
}

// ── Loading Fallback (wireframe placeholder) ────────────────────
function GlobeLoadingFallback() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(() => { if (ref.current) ref.current.rotation.y += 0.003; });
  return (
    <mesh ref={ref} scale={2}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshBasicMaterial color="#002b4d" wireframe transparent opacity={0.3} />
    </mesh>
  );
}

// ── Main Export ─────────────────────────────────────────────────
export default function Globe() {
  return (
    <div className="w-full h-full relative pointer-events-auto">
      <Canvas camera={{ position: [0, 0.3, 5], fov: 45 }} dpr={[1, 2]}>
        {/* Lighting */}
        <ambientLight intensity={0.25} />
        <directionalLight position={[5, 3, 5]} intensity={1.4} color="#ffffff" />
        <pointLight position={[-6, -4, -5]} intensity={0.7} color="#0044ff" />
        <pointLight position={[4, 5, -3]} intensity={0.4} color="#00ccff" />

        {/* Earth Scene */}
        <Suspense fallback={<GlobeLoadingFallback />}>
          <Float speed={0.8} rotationIntensity={0.12} floatIntensity={0.25}>
            <RealisticEarth />
          </Float>
        </Suspense>

        {/* Background Stars */}
        <StarField />

        {/* Controls */}
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.15}
          maxPolarAngle={Math.PI / 1.4}
          minPolarAngle={Math.PI / 3.5}
        />
      </Canvas>
    </div>
  );
}
