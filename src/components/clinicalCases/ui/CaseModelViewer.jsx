import { useMemo, useState } from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { Eye, Focus, Layers, ScanSearch } from "lucide-react";

import AnatomyScene from "../../anatomy/AnatomyScene";
import { DEFAULT_VISIBILITY, ORGANOS } from "../../anatomy/anatomyData";
import ProstateZones from "./ProstateZones";
import { PROSTATE_ZONES } from "../data/prostateZones";

// Closer than the anatomy module: cases focus on the prostate, not the whole pelvis.
const CAMERA_POSITIONS = {
  target: new THREE.Vector3(0, 0.002, 0.002),
  frontal: new THREE.Vector3(0, 0.005, 0.13),
  sagital: new THREE.Vector3(0.13, 0.005, 0.002),
  posterior: new THREE.Vector3(0, 0.005, -0.13),
  reset: new THREE.Vector3(0.085, 0.05, 0.1),
};

const CASE_VIEWS = [
  { id: "frontal", label: "Frontal" },
  { id: "sagital", label: "Sagital" },
  { id: "posterior", label: "Posterior" },
];

const CASE_VISIBILITY = {
  ...DEFAULT_VISIBILITY,
  Penis_Shaft_and_Glans: false,
  Testes_and_Epididymis: false,
};

export default function CaseModelViewer({ model, revealed }) {
  const [view, setView] = useState("reset");
  const [viewRequest, setViewRequest] = useState(0);
  const [selectedOrgan, setSelectedOrgan] = useState(null);
  const [selectedZone, setSelectedZone] = useState(null);
  const [seeThrough, setSeeThrough] = useState(true);
  const [showZones, setShowZones] = useState(true);

  const showNodule = revealed && Boolean(model.nodule);
  const prostateScale = revealed ? model.prostateScale : 1;
  const highlightedZone = revealed ? model.zone : null;

  const visibility = useMemo(
    () => ({ ...CASE_VISIBILITY, Pathological_Nodule: showNodule }),
    [showNodule]
  );

  const transforms = useMemo(() => {
    if (!revealed) return null;

    return {
      Prostate: { scale: model.prostateScale },
      ...(model.nodule && {
        Pathological_Nodule: {
          position: model.nodule.position,
          scale: model.nodule.scale,
        },
      }),
    };
  }, [model, revealed]);

  const organInfo = ORGANOS.find((organ) => organ.meshName === selectedOrgan);
  const zoneInfo = PROSTATE_ZONES.find((zone) => zone.id === selectedZone);

  const changeView = (nextView) => {
    setView(nextView);
    setViewRequest((request) => request + 1);
  };

  const selectOrgan = (organName) => {
    setSelectedOrgan(organName);
    setSelectedZone(null);
  };

  const selectZone = (zoneId) => {
    setSelectedZone((current) => (current === zoneId ? null : zoneId));
    setSelectedOrgan(null);
  };

  const clearSelection = () => {
    setSelectedOrgan(null);
    setSelectedZone(null);
  };

  return (
    <div className="case-viewer">
      <div className="case-viewer-canvas">
        <Canvas
          camera={{
            position: CAMERA_POSITIONS.reset.toArray(),
            fov: 40,
            near: 0.01,
            far: 100,
          }}
          dpr={[1, 2]}
          onPointerMissed={clearSelection}
        >
          <AnatomyScene
            visibility={visibility}
            opacity={seeThrough ? 0.35 : 1}
            selected={selectedOrgan}
            onSelect={selectOrgan}
            view={view}
            viewRequest={viewRequest}
            transforms={transforms}
            views={CAMERA_POSITIONS}
          >
            {showZones && seeThrough && (
              <ProstateZones
                scale={prostateScale}
                highlightedZone={highlightedZone}
                selectedZone={selectedZone}
                onSelectZone={selectZone}
              />
            )}
          </AnatomyScene>
        </Canvas>

        <div className="case-viewer-toolbar">
          {CASE_VIEWS.map((item) => (
            <button
              key={item.id}
              className={view === item.id ? "active" : ""}
              onClick={() => changeView(item.id)}
            >
              <Focus size={13} />
              {item.label}
            </button>
          ))}
          <button
            className={seeThrough ? "active" : ""}
            onClick={() => setSeeThrough((value) => !value)}
            title="Ver estructuras internas"
          >
            <Eye size={13} />
            Transparencia
          </button>
          <button
            className={showZones && seeThrough ? "active" : ""}
            disabled={!seeThrough}
            onClick={() => setShowZones((value) => !value)}
            title="Mostrar zonas de la próstata"
          >
            <Layers size={13} />
            Zonas
          </button>
        </div>

        {(organInfo || zoneInfo) && (
          <div className="case-viewer-label">
            <strong>{zoneInfo?.name ?? organInfo.nombre}</strong>
            {zoneInfo && <p>{zoneInfo.description}</p>}
          </div>
        )}
      </div>

      {showZones && seeThrough && (
        <div className="case-viewer-zones">
          {PROSTATE_ZONES.map((zone) => (
            <button
              key={zone.id}
              className={`${selectedZone === zone.id ? "active" : ""} ${
                highlightedZone === zone.id ? "affected" : ""
              }`}
              onClick={() => selectZone(zone.id)}
            >
              <span style={{ background: zone.color }} />
              {zone.name}
              {highlightedZone === zone.id && <em>afectada</em>}
            </button>
          ))}
        </div>
      )}

      <div className={`case-viewer-finding ${revealed ? "revealed" : ""}`}>
        <ScanSearch size={16} />
        <p>
          {revealed
            ? model.finding
            : "Modelo de referencia con las zonas de la próstata. Solicita las pruebas adecuadas para ver los hallazgos del caso."}
        </p>
      </div>
    </div>
  );
}
