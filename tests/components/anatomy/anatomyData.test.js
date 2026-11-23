import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

import { DEFAULT_VISIBILITY, ORGAN_NAMES, ORGANOS, VIEWS } from "../../../src/components/anatomy/anatomyData";

// Reads the node names stored in the JSON chunk of the binary glTF model.
function readModelNodeNames() {
  const file = readFileSync(new URL("../../../public/models/prostata.glb", import.meta.url));
  const jsonLength = file.readUInt32LE(12);
  const gltf = JSON.parse(file.subarray(20, 20 + jsonLength).toString("utf8"));

  return new Set(gltf.nodes.map((node) => node.name));
}

describe("anatomy organs", () => {
  it("describes the nine organs of the model with unique ids", () => {
    expect(ORGANOS).toHaveLength(9);
    expect(new Set(ORGANOS.map((organ) => organ.id)).size).toBe(9);
    expect(ORGAN_NAMES.size).toBe(9);
  });

  it("gives every organ a name and an educational description", () => {
    ORGANOS.forEach((organ) => {
      expect(organ.nombre.length).toBeGreaterThan(2);
      expect(organ.descripcion.length).toBeGreaterThan(50);
    });
  });

  it("matches every organ with a part of the 3D model", () => {
    const nodeNames = readModelNodeNames();

    ORGANOS.forEach((organ) => expect(nodeNames).toContain(organ.meshName));
  });

  it("shows every organ by default", () => {
    expect(Object.keys(DEFAULT_VISIBILITY).sort()).toEqual([...ORGAN_NAMES].sort());
    expect(Object.values(DEFAULT_VISIBILITY).every(Boolean)).toBe(true);
  });
});

describe("anatomy camera views", () => {
  it("offers the frontal, sagittal, posterior and reset views", () => {
    expect(Object.keys(VIEWS).sort()).toEqual(["frontal", "posterior", "reset", "sagital"]);
  });

  it("places each view at a different camera position", () => {
    const positions = Object.values(VIEWS).map((view) => view.toArray().join(","));

    expect(new Set(positions).size).toBe(positions.length);
  });

  it("puts the posterior view opposite to the frontal view", () => {
    expect(VIEWS.posterior.z).toBeCloseTo(-VIEWS.frontal.z);
    expect(VIEWS.posterior.x).toBeCloseTo(VIEWS.frontal.x);
  });
});
