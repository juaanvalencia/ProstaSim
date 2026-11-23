import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { ChevronDown, Focus, Layers, ScanSearch } from "lucide-react";

import AnatomyScene from "../../anatomy/AnatomyScene";
import { DEFAULT_VISIBILITY, ORGANOS } from "../../anatomy/anatomyData";
import ProstateZones from "./ProstateZones";
import { PROSTATE_CENTER, PROSTATE_ZONES } from "../data/prostateZones";

// Posterior surface of the prostate (-z faces the rectum): reached by the DRE.
const PALPATION_POINT = [PROSTATE_CENTER[0], PROSTATE_CENTER[1], -0.011];

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

// "Capas" menu: groups the see-through and zones toggles in one toolbar control.
function LayersMenu({ seeThrough, showZones, onSeeThrough, onShowZones }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const triggerRef = useRef(null);
  const menuId = useId();

  useEffect(() => {
    if (!open) return undefined;

    const closeOutside = (event) => {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    };
    const closeOnEscape = (event) => {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };

    document.addEventListener("pointerdown", closeOutside);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOutside);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  return (
    <div className="case-viewer-layers" ref={rootRef}>
      <button
        ref={triggerRef}
        type="button"
        className={open ? "active" : ""}
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((value) => !value)}
        title="Capas del modelo"
      >
        <Layers size={13} />
        Capas
        <ChevronDown size={13} aria-hidden="true" />
      </button>

      {open && (
        <div className="case-viewer-layers-menu" id={menuId} role="group" aria-label="Capas del modelo">
          <label>
            <input
              type="checkbox"
              checked={seeThrough}
              onChange={(event) => onSeeThrough(event.target.checked)}
            />
            Transparencia
          </label>
          <label className={seeThrough ? "" : "disabled"}>
            <input
              type="checkbox"
              checked={showZones && seeThrough}
              disabled={!seeThrough}
              onChange={(event) => onShowZones(event.target.checked)}
            />
            Zonas
          </label>
        </div>
      )}
    </div>
  );
}

export default function CaseModelViewer({
  model,
  revealed,
  examActive = false,
  showHotspot = false,
  onPalpate,
  stageRef,
}) {
  const [view, setView] = useState("reset");
  const [viewRequest, setViewRequest] = useState(0);
  const [examWasActive, setExamWasActive] = useState(false);

  // When the physical exam starts, turn the model to show its posterior face.
  if (examActive !== examWasActive) {
    setExamWasActive(examActive);
    if (examActive) {
      setView("posterior");
      setViewRequest((request) => request + 1);
    }
  }
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
    <div className="case-viewer" ref={stageRef}>
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

            {showHotspot && (
              <Html position={PALPATION_POINT} center zIndexRange={[20, 0]}>
                <button
                  type="button"
                  className="case-viewer-hotspot"
                  aria-label="Palpar la cara posterior de la próstata"
                  title="Palpar la cara posterior de la próstata"
                  onClick={onPalpate}
                >
                  <span aria-hidden="true" />
                </button>
              </Html>
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
          <LayersMenu
            seeThrough={seeThrough}
            showZones={showZones}
            onSeeThrough={setSeeThrough}
            onShowZones={setShowZones}
          />
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
