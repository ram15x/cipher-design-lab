import {
  Canvas,
  useFrame,
} from "@react-three/fiber";

import {
  Line,
  Sparkles,
} from "@react-three/drei";

import {
  useMemo,
  useRef,
  useState,
} from "react";

import * as THREE from "three";

type Position =
  [number, number, number];

interface ArchitectureNodeProps {
  position: Position;
  color: string;
  scale?: number;
  speed?: number;
}

function ArchitectureNode({
  position,
  color,
  scale = 1,
  speed = 1,
}: ArchitectureNodeProps) {
  const groupRef =
    useRef<THREE.Group>(null);

  const [
    hovered,
    setHovered,
  ] = useState(false);

  useFrame(
    (state) => {
      if (!groupRef.current) {
        return;
      }

      const time =
        state.clock.elapsedTime;

      groupRef.current.position.y =
        position[1] +
        Math.sin(
          time * speed +
            position[0]
        ) *
          0.08;

      groupRef.current.rotation.y =
        Math.sin(
          time * 0.35
        ) * 0.15;

      const targetScale =
        hovered
          ? scale * 1.15
          : scale;

      groupRef.current.scale.lerp(
        new THREE.Vector3(
          targetScale,
          targetScale,
          targetScale
        ),
        0.08
      );
    }
  );

  return (
    <group
      ref={groupRef}
      position={position}
      onPointerEnter={() =>
        setHovered(true)
      }
      onPointerLeave={() =>
        setHovered(false)
      }
    >
      <mesh>
        <boxGeometry
          args={[
            0.56,
            0.32,
            0.14,
          ]}
        />

        <meshStandardMaterial
          color="#090510"
          emissive={color}
          emissiveIntensity={
            hovered
              ? 1.6
              : 0.7
          }
          metalness={0.8}
          roughness={0.22}
        />
      </mesh>

      <mesh
        scale={[
          1.05,
          1.09,
          1.08,
        ]}
      >
        <boxGeometry
          args={[
            0.56,
            0.32,
            0.14,
          ]}
        />

        <meshBasicMaterial
          color={color}
          wireframe
          transparent
          opacity={
            hovered
              ? 0.9
              : 0.48
          }
        />
      </mesh>

      <mesh
        position={[
          -0.2,
          0,
          0.09,
        ]}
      >
        <sphereGeometry
          args={[
            0.027,
            12,
            12,
          ]}
        />

        <meshBasicMaterial
          color={color}
        />
      </mesh>

      <pointLight
        color={color}
        intensity={
          hovered
            ? 5
            : 2
        }
        distance={1.5}
      />
    </group>
  );
}

function ReactorRing({
  radius,
  color,
  speed,
  rotation,
}: {
  radius: number;
  color: string;
  speed: number;
  rotation: Position;
}) {
  const ref =
    useRef<THREE.Mesh>(null);

  useFrame(
    (_, delta) => {
      if (!ref.current) {
        return;
      }

      ref.current.rotation.z +=
        delta * speed;
    }
  );

  return (
    <mesh
      ref={ref}
      rotation={rotation}
    >
      <torusGeometry
        args={[
          radius,
          0.012,
          12,
          100,
        ]}
      />

      <meshBasicMaterial
        color={color}
        transparent
        opacity={0.55}
      />
    </mesh>
  );
}

function Core() {
  const coreRef =
    useRef<THREE.Mesh>(null);

  const shellRef =
    useRef<THREE.Mesh>(null);

  useFrame(
    (state, delta) => {
      if (
        !coreRef.current ||
        !shellRef.current
      ) {
        return;
      }

      const time =
        state.clock.elapsedTime;

      coreRef.current.rotation.x +=
        delta * 0.2;

      coreRef.current.rotation.y +=
        delta * 0.35;

      shellRef.current.rotation.x -=
        delta * 0.11;

      shellRef.current.rotation.y +=
        delta * 0.16;

      const pulse =
        1 +
        Math.sin(
          time * 2
        ) *
          0.035;

      coreRef.current.scale.setScalar(
        pulse
      );
    }
  );

  return (
    <group>
      <pointLight
        color="#9b5cff"
        intensity={18}
        distance={5}
      />

      <pointLight
        color="#4be7ff"
        intensity={8}
        distance={4}
        position={[
          0.5,
          0.4,
          0.5,
        ]}
      />

      <mesh ref={coreRef}>
        <icosahedronGeometry
          args={[
            0.46,
            3,
          ]}
        />

        <meshStandardMaterial
          color="#8d45ff"
          emissive="#8d45ff"
          emissiveIntensity={3}
          metalness={0.75}
          roughness={0.12}
        />
      </mesh>

      <mesh
        ref={shellRef}
        scale={1.34}
      >
        <icosahedronGeometry
          args={[
            0.46,
            2,
          ]}
        />

        <meshBasicMaterial
          color="#c78cff"
          wireframe
          transparent
          opacity={0.3}
        />
      </mesh>

      <ReactorRing
        radius={0.78}
        color="#9b5cff"
        speed={0.28}
        rotation={[
          1.15,
          0,
          0.3,
        ]}
      />

      <ReactorRing
        radius={0.95}
        color="#4be7ff"
        speed={-0.2}
        rotation={[
          0.3,
          1.1,
          0.6,
        ]}
      />

      <ReactorRing
        radius={1.12}
        color="#b46cff"
        speed={0.12}
        rotation={[
          1.4,
          0.5,
          0,
        ]}
      />
    </group>
  );
}

interface EnergyPulseProps {
  from: Position;
  to: Position;
  color: string;
  offset: number;
}

function EnergyPulse({
  from,
  to,
  color,
  offset,
}: EnergyPulseProps) {
  const ref =
    useRef<THREE.Mesh>(null);

  const start =
    useMemo(
      () =>
        new THREE.Vector3(
          ...from
        ),
      [from]
    );

  const end =
    useMemo(
      () =>
        new THREE.Vector3(
          ...to
        ),
      [to]
    );

  useFrame(
    (state) => {
      if (!ref.current) {
        return;
      }

      const progress =
        (
          state.clock
            .elapsedTime *
            0.23 +
          offset
        ) %
        1;

      ref.current.position.lerpVectors(
        start,
        end,
        progress
      );

      const pulse =
        0.8 +
        Math.sin(
          progress *
            Math.PI
        ) *
          0.8;

      ref.current.scale.setScalar(
        pulse
      );
    }
  );

  return (
    <mesh ref={ref}>
      <sphereGeometry
        args={[
          0.035,
          12,
          12,
        ]}
      />

      <meshBasicMaterial
        color={color}
      />

      <pointLight
        color={color}
        intensity={4}
        distance={0.8}
      />
    </mesh>
  );
}

function Connection({
  from,
  to,
  color,
  offset,
}: {
  from: Position;
  to: Position;
  color: string;
  offset: number;
}) {
  return (
    <>
      <Line
        points={[
          from,
          to,
        ]}
        color={color}
        transparent
        opacity={0.28}
        lineWidth={1}
      />

      <EnergyPulse
        from={from}
        to={to}
        color={color}
        offset={offset}
      />
    </>
  );
}

function ArchitectureSystem() {
  const systemRef =
    useRef<THREE.Group>(null);

  const nodes:
    {
      position: Position;
      color: string;
      scale?: number;
    }[] = [
      {
        position: [
          -2.15,
          1.35,
          -0.3,
        ],
        color: "#4be7ff",
      },
      {
        position: [
          2.15,
          1.2,
          -0.4,
        ],
        color: "#b46cff",
      },
      {
        position: [
          -2.25,
          -1.25,
          -0.1,
        ],
        color: "#9b5cff",
      },
      {
        position: [
          0,
          -2,
          -0.25,
        ],
        color: "#4be7ff",
      },
      {
        position: [
          2.25,
          -1.2,
          -0.1,
        ],
        color: "#b46cff",
      },
    ];

  useFrame(
    (state) => {
      if (!systemRef.current) {
        return;
      }

      const pointer =
        state.pointer;

      systemRef.current.rotation.y =
        THREE.MathUtils.lerp(
          systemRef.current
            .rotation.y,
          pointer.x * 0.1,
          0.03
        );

      systemRef.current.rotation.x =
        THREE.MathUtils.lerp(
          systemRef.current
            .rotation.x,
          -pointer.y * 0.07,
          0.03
        );
    }
  );

  return (
    <group ref={systemRef}>
      <Core />

      {nodes.map(
        (
          node,
          index
        ) => (
          <ArchitectureNode
            key={index}
            position={
              node.position
            }
            color={node.color}
            scale={
              node.scale
            }
            speed={
              0.7 +
              index * 0.08
            }
          />
        )
      )}

      {nodes.map(
        (
          node,
          index
        ) => (
          <Connection
            key={`connection-${index}`}
            from={[
              0,
              0,
              0,
            ]}
            to={
              node.position
            }
            color={
              node.color
            }
            offset={
              index * 0.18
            }
          />
        )
      )}
    </group>
  );
}

function Scene() {
  return (
    <>
      <ambientLight
        intensity={0.18}
      />

      <directionalLight
        position={[
          4,
          5,
          5,
        ]}
        intensity={1.8}
        color="#d8c2ff"
      />

      <Sparkles
        count={80}
        scale={[
          7,
          6,
          4,
        ]}
        size={1.7}
        speed={0.25}
        opacity={0.45}
        color="#b78aff"
      />

      <Sparkles
        count={30}
        scale={[
          6,
          5,
          3,
        ]}
        size={1}
        speed={0.15}
        opacity={0.4}
        color="#4be7ff"
      />

      <ArchitectureSystem />
    </>
  );
}

export function HeroScene() {
  return (
    <div className="hero-scene hero-scene--reactor">
      <div className="hero-scene__orb" />

      <div className="reactor-grid" />

      <div className="reactor-topbar">
        <div>
          <span className="reactor-live-dot" />
          DESIGN GRAPH
        </div>

        <span>
          LIVE
        </span>
      </div>

      <Canvas
        camera={{
          position: [
            0,
            0,
            6.7,
          ],
          fov: 44,
        }}
        dpr={[
          1,
          1.5,
        ]}
        gl={{
          antialias: true,
          alpha: true,
        }}
      >
        <Scene />
      </Canvas>

      <div className="architecture-label architecture-label--vehicle">
        <span className="architecture-label__dot architecture-label__dot--cyan" />

        <div>
          <small>
            CLASS
          </small>

          <strong>
            Vehicle
          </strong>
        </div>
      </div>

      <div className="architecture-label architecture-label--strategy">
        <span className="architecture-label__dot" />

        <div>
          <small>
            INTERFACE
          </small>

          <strong>
            ParkingStrategy
          </strong>
        </div>
      </div>

      <div className="architecture-label architecture-label--ticket">
        <span className="architecture-label__dot" />

        <div>
          <small>
            ENTITY
          </small>

          <strong>
            Ticket
          </strong>
        </div>
      </div>

      <div className="architecture-label architecture-label--spot">
        <span className="architecture-label__dot architecture-label__dot--cyan" />

        <div>
          <small>
            CLASS
          </small>

          <strong>
            ParkingSpot
          </strong>
        </div>
      </div>

      <div className="architecture-label architecture-label--fee">
        <span className="architecture-label__dot" />

        <div>
          <small>
            SERVICE
          </small>

          <strong>
            FeeCalculator
          </strong>
        </div>
      </div>

      <div className="reactor-core-label">
        <span>
          ARCHITECTURE
        </span>

        <strong>
          DESIGN CORE
        </strong>

        <small>
          relationships active
        </small>
      </div>

      <div className="reactor-status">
        <span>
          05 NODES
        </span>

        <span>
          05 LINKS
        </span>

        <span className="reactor-status__healthy">
          ● HEALTHY
        </span>
      </div>
    </div>
  );
}