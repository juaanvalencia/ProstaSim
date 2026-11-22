import * as THREE from "three";

/* 
   INFORMACIÓN DE LOS ÓRGANOS
*/

export const ORGANOS = [
  {
    id: "prostate",
    meshName: "Prostate",
    nombre: "Próstata",
    descripcion:
      "La próstata es una glándula situada debajo de la vejiga y alrededor de la porción inicial de la uretra. Contribuye a formar parte del líquido seminal y su relación con la uretra es importante para comprender la anatomía pélvica masculina.",
  },
  {
    id: "nodule",
    meshName: "Pathological_Nodule",
    nombre: "Nódulo patológico",
    descripcion:
      "Este nódulo azul es una representación educativa de una alteración localizada dentro de la próstata. Su presencia en el modelo permite estudiar relaciones espaciales y no representa por sí sola un diagnóstico específico.",
  },
  {
    id: "bladder",
    meshName: "Bladder",
    nombre: "Vejiga",
    descripcion:
      "La vejiga almacena temporalmente la orina antes de la micción. Se encuentra por encima de la próstata y continúa inferiormente con la uretra.",
  },
  {
    id: "urethra",
    meshName: "Urethra",
    nombre: "Uretra",
    descripcion:
      "La uretra conduce la orina desde la vejiga hacia el exterior. Una de sus porciones atraviesa la próstata, por lo que puede observarse mejor reduciendo la opacidad de las estructuras circundantes.",
  },
  {
    id: "rectum",
    meshName: "Rectum",
    nombre: "Recto",
    descripcion:
      "El recto corresponde al segmento final del intestino grueso y se sitúa detrás de la próstata. Esta proximidad anatómica es útil para comprender la orientación de las estructuras de la pelvis masculina.",
  },
  {
    id: "vesicles",
    meshName: "Seminal_Vesicles",
    nombre: "Vesículas seminales",
    descripcion:
      "Las vesículas seminales son glándulas pares ubicadas detrás de la vejiga y próximas a la próstata. Producen una parte importante del líquido que forma el semen.",
  },
  {
    id: "testes",
    meshName: "Testes_and_Epididymis",
    nombre: "Testículos y epidídimo",
    descripcion:
      "Los testículos producen espermatozoides y hormonas sexuales, mientras que el epidídimo participa en la maduración y almacenamiento de los espermatozoides. En el modelo se muestran juntos para facilitar la comprensión de su continuidad anatómica.",
  },
  {
    id: "vas",
    meshName: "Vas_Deferens",
    nombre: "Conductos deferentes",
    descripcion:
      "Los conductos deferentes transportan los espermatozoides desde el epidídimo hacia los conductos eyaculadores. Su recorrido conecta las estructuras escrotales con órganos situados más profundamente en la pelvis.",
  },
  {
    id: "penis",
    meshName: "Penis_Shaft_and_Glans",
    nombre: "Pene y glande",
    descripcion:
      "El pene es el órgano externo que contiene la porción final de la uretra. El glande constituye su extremo distal y forma parte de la anatomía del aparato genitourinario masculino.",
  },
];


export const ORGAN_NAMES = new Set(
  ORGANOS.map((organo) => organo.meshName)
);

export const DEFAULT_VISIBILITY = Object.fromEntries(
  ORGANOS.map((organo) => [organo.meshName, true])
);


/* 
   POSICIONES PREDEFINIDAS DE LA CÁMARA
*/

export const VIEWS = {
  frontal: new THREE.Vector3(0, 0.05, 0.55),
  sagital: new THREE.Vector3(0.55, 0.05, 0),
  posterior: new THREE.Vector3(0, 0.05, -0.55),
  reset: new THREE.Vector3(0.38, 0.2, 0.48),
};
