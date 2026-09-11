import {
  Canvas,
  useFrame,
} from "@react-three/fiber";

import {
  Float,
  Line,
  OrbitControls,
} from "@react-three/drei";

import {
  useRef,
} from "react";

import * as THREE from "three";

interface NodeProps {
  position:
    [number, number, number];

  size?: number;

  color?: string;
}

function Node({
  position,
  size = 0.55,
  color = "#9b5cff",
}: NodeProps) {
  const meshRef =
    useRef<THREE.Mesh>(
      null
    );

  useFrame(
    (
      state,
      delta
    ) => {
      if (!meshRef.current) {
        return;
      }

      meshRef.current.rotation.x +=
        delta * 0.12;

      meshRef.current.rotation.y +=
        delta * 0.18;

      meshRef.current.position.y =
        position[1] +
        Math.sin(
          state.clock.elapsedTime +
            position[0]
        ) *
          0.07;
    }
  );

  return (
    <Float
      speed={1.4}
      rotationIntensity={0.25}
      floatIntensity={0.5}
    >
      <mesh
        ref={meshRef}
        position={position}
      >
        <icosahedronGeometry
          args={[
            size,
            1,
          ]}
        />

        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={1.4}
          roughness={0.2}
          metalness={0.7}
        />
      </mesh>
    </Float>
  );
}

function Network() {
  return (
    <>
      <ambientLight
        intensity={0.6}
      />

      <pointLight
        position={[
          3,
          4,
          4,
        ]}
        intensity={24}
        color="#9d55ff"
      />

      <pointLight
        position={[
          -4,
          -2,
          3,
        ]}
        intensity={20}
        color="#42e8ff"
      />

      <Node
        position={[
          0,
          0,
          0,
        ]}
        size={0.85}
      />

      <Node
        position={[
          -2,
          1.4,
          -0.5,
        ]}
        color="#4be7ff"
      />

      <Node
        position={[
          2,
          1.1,
          -0.4,
        ]}
        size={0.65}
      />

      <Node
        position={[
          -2,
          -1.3,
          0.1,
        ]}
        size={0.5}
      />

      <Node
        position={[
          2.1,
          -1.2,
          0.15,
        ]}
        size={0.53}
        color="#4be7ff"
      />

      <Line
        points={[
          [-2, 1.4, -0.5],
          [0, 0, 0],
        ]}
        color="#4be7ff"
        transparent
        opacity={0.5}
        lineWidth={1}
      />

      <Line
        points={[
          [0, 0, 0],
          [2, 1.1, -0.4],
        ]}
        color="#9b5cff"
        transparent
        opacity={0.55}
        lineWidth={1}
      />

      <Line
        points={[
          [0, 0, 0],
          [-2, -1.3, 0.1],
        ]}
        color="#9b5cff"
        transparent
        opacity={0.5}
        lineWidth={1}
      />

      <Line
        points={[
          [0, 0, 0],
          [2.1, -1.2, 0.15],
        ]}
        color="#4be7ff"
        transparent
        opacity={0.5}
        lineWidth={1}
      />

      <OrbitControls
        enablePan={false}
        enableZoom={false}
        autoRotate
        autoRotateSpeed={0.45}
      />
    </>
  );
}

export function HeroScene() {
  return (
    <div className="hero-scene">
      <div className="hero-scene__orb" />

      <Canvas
        camera={{
          position: [
            0,
            0,
            6,
          ],
          fov: 45,
        }}
        dpr={[
          1,
          1.5,
        ]}
      >
        <Network />
      </Canvas>

      <div className="floating-label floating-label--one">
        <span />
        ParkingLot
      </div>

      <div className="floating-label floating-label--two">
        <span />
        ParkingStrategy
      </div>

      <div className="floating-label floating-label--three">
        <span />
        FeeCalculator
      </div>
    </div>
  );
}