// Schematic prostate zones (McNeal), drawn in the prostate mesh's local space.
// The prostate mesh spans roughly x ±0.020, y ±0.015, z ±0.013 (+y base, -z posterior).
// Shapes are illustrative, not anatomical segmentations.

export const PROSTATE_CENTER = [0, -0.0002, 0.002];

export const PROSTATE_ZONES = [
  {
    id: "peripheral",
    name: "Zona periférica",
    color: "#ff8a65",
    description:
      "Rodea la parte posterior y lateral de la glándula. Es la más cercana al recto, por eso se palpa en el tacto rectal. Aquí se origina cerca del 70 % de los cánceres.",
    // Posterior shell: partial ellipsoid surface.
    shape: {
      type: "shell",
      radii: [0.0186, 0.0139, 0.0119],
      phiStart: Math.PI,
      phiLength: Math.PI,
      thetaStart: Math.PI * 0.3,
      thetaLength: Math.PI * 0.7,
    },
  },
  {
    id: "transition",
    name: "Zona de transición",
    color: "#ffd166",
    description:
      "Rodea la uretra en el centro de la glándula. Es la zona que crece en la hiperplasia prostática benigna y puede comprimir la uretra.",
    // Ring around the urethra, wider at the sides (the lateral lobes).
    // Torus axis is turned vertical: local x → width, y → depth, z → height.
    shape: {
      type: "ring",
      position: [0, -0.0005, 0.003],
      scale: [0.0056, 0.004, 0.011],
      tube: 0.55,
    },
  },
  {
    id: "central",
    name: "Zona central",
    color: "#b39ddb",
    description:
      "Se ubica en la base de la glándula, por detrás de la uretra, y rodea los conductos eyaculadores. Es poco frecuente que origine cáncer.",
    shape: {
      type: "lobes",
      radii: [0.0105, 0.005, 0.0055],
      positions: [[0, 0.0075, -0.0042]],
    },
  },
];
