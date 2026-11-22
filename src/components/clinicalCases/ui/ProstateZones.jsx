import * as THREE from "three";

import { PROSTATE_CENTER, PROSTATE_ZONES } from "../data/prostateZones";

function ZoneMaterial({ color, emphasis }) {
  const opacity = { highlighted: 0.85, normal: 0.4, dimmed: 0.12 }[emphasis];

  return (
    <meshStandardMaterial
      color={color}
      emissive={color}
      emissiveIntensity={emphasis === "highlighted" ? 0.45 : 0.08}
      transparent
      opacity={opacity}
      depthWrite={emphasis === "highlighted"}
      side={THREE.DoubleSide}
    />
  );
}

function ZoneShape({ zone, emphasis, onSelect }) {
  const { shape } = zone;

  const handleClick = (event) => {
    event.stopPropagation();
    onSelect(zone.id);
  };

  if (shape.type === "shell") {
    return (
      <mesh scale={shape.radii} onClick={handleClick}>
        <sphereGeometry
          args={[
            1,
            48,
            32,
            shape.phiStart,
            shape.phiLength,
            shape.thetaStart,
            shape.thetaLength,
          ]}
        />
        <ZoneMaterial color={zone.color} emphasis={emphasis} />
      </mesh>
    );
  }

  if (shape.type === "ring") {
    return (
      <mesh
        position={shape.position}
        rotation={[Math.PI / 2, 0, 0]}
        scale={shape.scale}
        onClick={handleClick}
      >
        <torusGeometry args={[1, shape.tube, 24, 64]} />
        <ZoneMaterial color={zone.color} emphasis={emphasis} />
      </mesh>
    );
  }

  return shape.positions.map((position) => (
    <mesh
      key={position.join(",")}
      position={position}
      scale={shape.radii}
      onClick={handleClick}
    >
      <sphereGeometry args={[1, 32, 24]} />
      <ZoneMaterial color={zone.color} emphasis={emphasis} />
    </mesh>
  ));
}

export default function ProstateZones({
  scale = 1,
  highlightedZone,
  selectedZone,
  onSelectZone,
}) {
  const focusZone = selectedZone ?? highlightedZone;

  return (
    <group position={PROSTATE_CENTER} scale={scale}>
      {PROSTATE_ZONES.map((zone) => {
        let emphasis = "normal";

        if (focusZone) {
          emphasis = zone.id === focusZone ? "highlighted" : "dimmed";
        }

        return (
          <ZoneShape
            key={zone.id}
            zone={zone}
            emphasis={emphasis}
            onSelect={onSelectZone}
          />
        );
      })}
    </group>
  );
}
