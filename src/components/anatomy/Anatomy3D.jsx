import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Html, OrbitControls, useGLTF } from "@react-three/drei";
import { Eye, EyeOff, Focus, Layers, RotateCcw } from "lucide-react";
import * as THREE from "three";
import "./Anatomy3D.css";


/* 
   INFORMACIÓN DE LOS ÓRGANOS
*/

const ORGANOS = [
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


const ORGAN_NAMES = new Set(
  ORGANOS.map((organo) => organo.meshName)
);

const DEFAULT_VISIBILITY = Object.fromEntries(
  ORGANOS.map((organo) => [organo.meshName, true])
);


/* 
   POSICIONES PREDEFINIDAS DE LA CÁMARA
*/

const VIEWS = {
  frontal: new THREE.Vector3(0, 0.05, 0.55),
  sagital: new THREE.Vector3(0.55, 0.05, 0),
  posterior: new THREE.Vector3(0, 0.05, -0.55),
  reset: new THREE.Vector3(0.38, 0.2, 0.48),
};


/* 
   BUSCAR EL ÓRGANO AL QUE PERTENECE UNA MALLA
*/

function findOrgan(object) {
  let current = object;

  while (current) {
    if (ORGAN_NAMES.has(current.name)) {
      return current.name;
    }

    current = current.parent;
  }

  return null;
}


/* 
   MODELO 3D
*/

function Model({
  visibility,
  opacity,
  selected,
  onSelect,
}) {
  const { scene } = useGLTF("/models/prostata.glb");

  const model = useMemo(() => scene.clone(true), [scene]);

  const originalMaterials = useRef(new Map());


  /* 
     Clonar materiales para no modificar los originales del GLB
  */

  useEffect(() => {
    model.traverse((object) => {
      if (!object.isMesh) return;

      const materials = Array.isArray(object.material)
        ? object.material
        : [object.material];

      const clones = materials.map((material) =>
        material.clone()
      );

      originalMaterials.current.set(
        object.uuid,
        clones.map((material) => material.clone())
      );

      object.material = Array.isArray(object.material)
        ? clones
        : clones[0];
    });


    return () => {
      model.traverse((object) => {
        if (!object.isMesh) return;

        const materials = Array.isArray(object.material)
          ? object.material
          : [object.material];

        materials.forEach((material) => {
          material.dispose();
        });
      });
    };
  }, [model]);


  /* 
  Visibilidad, opacidad y selección
  */

  useEffect(() => {
    model.traverse((object) => {
      if (!object.isMesh) return;

      const organName = findOrgan(object);

      if (!organName) return;


      /* VISIBILIDAD */

      object.visible =
        visibility[organName] !== false;


      /* MATERIALES */

      const currentMaterials = Array.isArray(object.material)
        ? object.material
        : [object.material];

      const originals =
        originalMaterials.current.get(object.uuid) || [];


      currentMaterials.forEach((material, index) => {
        const source = originals[index];

        if (source) {
          material.copy(source);
        }


        const isSelected =
          organName === selected;

        const isNodule =
          organName === "Pathological_Nodule";


        /* OPACIDAD */

        material.transparent =
          opacity < 1 &&
          !isSelected &&
          !isNodule;

        material.opacity =
          isSelected || isNodule
            ? 1
            : opacity;

        material.depthWrite =
          material.opacity > 0.85;


        /* RESALTADO DEL ÓRGANO SELECCIONADO */

        if (
          isSelected &&
          "emissive" in material
        ) {
          material.emissive =
            new THREE.Color("#42d6b0");

          material.emissiveIntensity =
            0.28;
        }


        material.needsUpdate = true;
      });
    });
  }, [
    model,
    visibility,
    opacity,
    selected,
  ]);


  return (
    <primitive
      object={model}
      onClick={(event) => {
        event.stopPropagation();

        const organName =
          findOrgan(event.object);

        if (organName) {
          onSelect(organName);
        }
      }}
    />
  );
}


/* 
   CONTROL AUTOMÁTICO DE CÁMARA

   IMPORTANTE:
   Solo controla la cámara cuando pulsamos:
   - Frontal
   - Sagital
   - Posterior
   - Reset

   Cuando termina la animación se desactiva y OrbitControls
   queda completamente libre.
*/

function CameraRig({
  view,
  viewRequest,
  controlsRef,
}) {
  const { camera } = useThree();

  const targetPosition = useRef(
    VIEWS.reset.clone()
  );

  const targetLookAt = useRef(
    new THREE.Vector3(0, 0.02, 0)
  );

  const isAnimating = useRef(false);


  /* 
  Iniciar una nueva animación solamente cuando el usuario
   presiona uno de los botones de vista.
  */

  useEffect(() => {
    targetPosition.current.copy(
      VIEWS[view] || VIEWS.reset
    );

    targetLookAt.current.set(
      0,
      0.02,
      0
    );

    isAnimating.current = true;
  }, [view, viewRequest]);


  /*
   Animación
  */

  useFrame(() => {
    /*
      ESTA LÍNEA ES LA CLAVE.

      Si la animación terminó, CameraRig deja de modificar
      completamente la cámara.
    */

    if (!isAnimating.current) {
      return;
    }


    /* Mover posición */

    camera.position.lerp(
      targetPosition.current,
      0.1
    );


    /* Mover punto de enfoque */

    if (controlsRef.current) {
      controlsRef.current.target.lerp(
        targetLookAt.current,
        0.1
      );

      controlsRef.current.update();
    }


     
      /*Comprobar si ya llegamos*/
   
    const cameraFinished =
      camera.position.distanceTo(
        targetPosition.current
      ) < 0.002;


    const targetFinished =
      !controlsRef.current ||
      controlsRef.current.target.distanceTo(
        targetLookAt.current
      ) < 0.002;


    
     /*Liberar la cámara*/
     

    if (
      cameraFinished &&
      targetFinished
    ) {
      camera.position.copy(
        targetPosition.current
      );


      if (controlsRef.current) {
        controlsRef.current.target.copy(
          targetLookAt.current
        );

        controlsRef.current.update();
      }


      /*
        Desde aquí CameraRig deja de intervenir.

        OrbitControls toma el control completo.
      */

      isAnimating.current = false;
    }
  });


  return null;
}


 
/*ESCENA 3D */


function AnatomyScene({
  visibility,
  opacity,
  selected,
  onSelect,
  view,
  viewRequest,
}) {
  const controlsRef = useRef();


  return (
    <>
      {/* ILUMINACIÓN */}

      <ambientLight intensity={0.7} />

      <directionalLight
        position={[2, 3, 4]}
        intensity={1.5}
      />

      <directionalLight
        position={[-3, 1, -2]}
        intensity={0.9}
      />


      {/* MODELO */}

      <Suspense
        fallback={
          <Html center>
            <div className="anatomy-loading">
              Cargando modelo…
            </div>
          </Html>
        }
      >
        <Model
          visibility={visibility}
          opacity={opacity}
          selected={selected}
          onSelect={onSelect}
        />
      </Suspense>


      {/* VISTAS AUTOMÁTICAS */}

      <CameraRig
        view={view}
        viewRequest={viewRequest}
        controlsRef={controlsRef}
      />


      {/* ===================================================
          CONTROLES LIBRES DE CÁMARA
      =================================================== */}

      <OrbitControls
        ref={controlsRef}
        makeDefault

        /* Movimiento suave */
        enableDamping
        dampingFactor={0.04}

        /* Rotación */
        enableRotate
        rotateSpeed={0.9}

        /* Zoom */
        enableZoom
        zoomSpeed={1.1}

        /* Movimiento lateral */
        enablePan
        panSpeed={0.9}
        screenSpacePanning

        /* Zoom permitido */
        minDistance={0.08}
        maxDistance={2.5}

        /*
          Permite prácticamente una vuelta vertical completa.
        */
        minPolarAngle={0}
        maxPolarAngle={Math.PI}
      />
    </>
  );
}


/* =========================================================
   COMPONENTE PRINCIPAL
========================================================= */

export default function Anatomy3D() {

  /* ---------------------------------------------------------
     ESTADOS
  --------------------------------------------------------- */

  const [selected, setSelected] =
    useState("Prostate");


  const [visibility, setVisibility] =
    useState(DEFAULT_VISIBILITY);


  const [opacity, setOpacity] =
    useState(1);


  const [view, setView] =
    useState("reset");


  /*
    Este contador permite presionar Reset varias veces.

    Por ejemplo:

    Reset
    → mover manualmente
    → Reset otra vez

    Aunque "view" siga siendo "reset", viewRequest cambia.
  */

  const [viewRequest, setViewRequest] =
    useState(0);


  const selectedInfo =
    ORGANOS.find(
      (organo) =>
        organo.meshName === selected
    );


  /* =========================================================
     CAMBIAR VISTA
  ========================================================= */

  const changeView = (newView) => {
    setView(newView);

    setViewRequest(
      (current) => current + 1
    );
  };


  /* =========================================================
     MOSTRAR / OCULTAR ÓRGANO
  ========================================================= */

  const toggleVisibility = (meshName) => {
    setVisibility((current) => ({
      ...current,

      [meshName]:
        !current[meshName],
    }));
  };


  /* =========================================================
     SOLO PRÓSTATA
  ========================================================= */

  const soloProstate = () => {
    setVisibility(
      Object.fromEntries(
        ORGANOS.map((organo) => [
          organo.meshName,

          organo.meshName ===
            "Prostate",
        ])
      )
    );

    setSelected("Prostate");
  };


  /* =========================================================
     MOSTRAR TODO
  ========================================================= */

  const showAll = () => {
    setVisibility({
      ...DEFAULT_VISIBILITY,
    });
  };


  /* =========================================================
     INTERFAZ
  ========================================================= */

  return (
    <section className="anatomy-container">

      {/* =====================================================
          ENCABEZADO
      ===================================================== */}

      <header className="anatomy-header">

        <span className="anatomy-eyebrow">
          EXPLORACIÓN INTERACTIVA
        </span>

        <h2>
          Anatomía pélvica masculina en 3D
        </h2>

        <p>
          Explora el modelo, selecciona estructuras y
          modifica su visibilidad para comprender sus
          relaciones anatómicas.
        </p>

      </header>


      {/* =====================================================
          BARRA DE HERRAMIENTAS
      ===================================================== */}

      <div className="anatomy-toolbar">

        <div
          className="anatomy-view-buttons"
          aria-label="Vistas anatómicas"
        >

          <button
            onClick={() =>
              changeView("frontal")
            }
          >
            <Focus size={16} />
            Frontal
          </button>


          <button
            onClick={() =>
              changeView("sagital")
            }
          >
            <Focus size={16} />
            Sagital
          </button>


          <button
            onClick={() =>
              changeView("posterior")
            }
          >
            <Focus size={16} />
            Posterior
          </button>


          <button
            onClick={() =>
              changeView("reset")
            }
          >
            <RotateCcw size={16} />
            Reset
          </button>

        </div>


        <div className="anatomy-view-buttons">

          <button
            onClick={soloProstate}
          >
            <Layers size={16} />
            Solo próstata
          </button>


          <button
            onClick={showAll}
          >
            <Eye size={16} />
            Mostrar todo
          </button>

        </div>

      </div>


      {/* =====================================================
          ÁREA PRINCIPAL
      ===================================================== */}

      <div className="anatomy-workspace">


        {/* ===================================================
            PANEL IZQUIERDO
        =================================================== */}

        <aside className="anatomy-panel">

          <div className="anatomy-panel-heading">

            <div>
              <span>
                ESTRUCTURAS
              </span>

              <h3>
                Órganos
              </h3>
            </div>


            <small>
              {
                Object.values(
                  visibility
                ).filter(Boolean).length
              }
              /
              {ORGANOS.length}
            </small>

          </div>


          {/* LISTA DE ÓRGANOS */}

          <div className="anatomy-organ-list">

            {ORGANOS.map((organo) => {

              const visible =
                visibility[
                  organo.meshName
                ];


              return (
                <div
                  className={
                    `anatomy-organ-row ${
                      selected ===
                      organo.meshName
                        ? "is-selected"
                        : ""
                    }`
                  }
                  key={organo.id}
                >

                  <button
                    className="anatomy-organ-select"
                    onClick={() =>
                      setSelected(
                        organo.meshName
                      )
                    }
                  >
                    {organo.nombre}
                  </button>


                  <button
                    className="anatomy-visibility"
                    onClick={() =>
                      toggleVisibility(
                        organo.meshName
                      )
                    }
                    aria-label={
                      `${
                        visible
                          ? "Ocultar"
                          : "Mostrar"
                      } ${organo.nombre}`
                    }
                  >

                    {visible ? (
                      <Eye size={17} />
                    ) : (
                      <EyeOff size={17} />
                    )}

                  </button>

                </div>
              );
            })}

          </div>


          {/* =================================================
              OPACIDAD
          ================================================= */}

          <div className="anatomy-opacity">

            <div>

              <label htmlFor="anatomy-opacity">
                Opacidad contextual
              </label>

              <span>
                {Math.round(
                  opacity * 100
                )}
                %
              </span>

            </div>


            <input
              id="anatomy-opacity"
              type="range"
              min="0.15"
              max="1"
              step="0.05"
              value={opacity}
              onChange={(event) =>
                setOpacity(
                  Number(
                    event.target.value
                  )
                )
              }
            />


            <small>
              Reduce la opacidad para observar
              estructuras internas.
            </small>

          </div>

        </aside>


        {/* ===================================================
            VISOR 3D
        =================================================== */}

        <div
          className="anatomy-viewer"
          onDoubleClick={() =>
            changeView("reset")
          }
        >

          <Canvas
            camera={{
              position:
                VIEWS.reset.toArray(),

              fov: 40,

              near: 0.01,

              far: 100,
            }}

            dpr={[1, 2]}

            onPointerMissed={() =>
              setSelected(null)
            }
          >

            <AnatomyScene
              visibility={visibility}
              opacity={opacity}
              selected={selected}
              onSelect={setSelected}
              view={view}
              viewRequest={viewRequest}
            />

          </Canvas>


          <div className="anatomy-viewer-hint">
            Arrastra para rotar · Rueda para acercar ·
            Clic derecho para mover
          </div>

        </div>


        {/* ===================================================
            PANEL DERECHO
        =================================================== */}

        <aside className="anatomy-info-panel">

          {selectedInfo ? (

            <div className="anatomy-info-card">

              <span>
                ESTRUCTURA SELECCIONADA
              </span>

              <h3>
                {selectedInfo.nombre}
              </h3>

              <p>
                {selectedInfo.descripcion}
              </p>

            </div>

          ) : (

            <div className="anatomy-info-card">

              <span>
                EXPLORACIÓN
              </span>

              <h3>
                Selecciona una estructura
              </h3>

              <p>
                Haz clic sobre una estructura del
                modelo o utiliza la lista para
                consultar su información.
              </p>

            </div>

          )}


          <div className="anatomy-tip">

            <Layers size={19} />

            <p>
              Combina la opacidad con los controles
              de visibilidad para estudiar la uretra
              y otras relaciones internas.
            </p>

          </div>

        </aside>

      </div>


      {/* =====================================================
          AVISO
      ===================================================== */}

      <footer className="anatomy-notice">
        Modelo educativo estilizado. No sustituye la
        evaluación ni el diagnóstico médico.
      </footer>

    </section>
  );
}


/* =========================================================
   PRECARGAR MODELO
========================================================= */

useGLTF.preload("/models/prostata.glb");