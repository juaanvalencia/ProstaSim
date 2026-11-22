import { Suspense, useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Html, OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { ORGAN_NAMES, VIEWS } from "./anatomyData";
import "./Anatomy3D.css";


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
  transforms,
}) {
  const { scene } = useGLTF("/models/prostata.glb");

  const model = useMemo(() => scene.clone(true), [scene]);


  /*
     Optional per-organ adjustments (used by clinical cases),
     e.g. { Prostate: { scale: 1.3 }, Pathological_Nodule: { position: [x, y, z] } }
  */

  useEffect(() => {
    if (!transforms) return undefined;

    const touched = Object.entries(transforms)
      .map(([name, transform]) => {
        const object = model.getObjectByName(name);

        if (!object) return null;

        const original = {
          position: object.position.clone(),
          scale: object.scale.clone(),
        };

        if (transform.position) {
          object.position.fromArray(transform.position);
        }

        if (transform.scale) {
          object.scale.copy(original.scale).multiplyScalar(transform.scale);
        }

        return { object, original };
      })
      .filter(Boolean);

    return () => {
      touched.forEach(({ object, original }) => {
        object.position.copy(original.position);
        object.scale.copy(original.scale);
      });
    };
  }, [model, transforms]);

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
  views = VIEWS,
}) {
  const { camera } = useThree();

  const targetPosition = useRef(
    views.reset.clone()
  );

  const targetLookAt = useRef(
    views.target?.clone() ?? new THREE.Vector3(0, 0.02, 0)
  );

  const isAnimating = useRef(false);


  /* 
  Iniciar una nueva animación solamente cuando el usuario
   presiona uno de los botones de vista.
  */

  useEffect(() => {
    targetPosition.current.copy(
      views[view] || views.reset
    );

    if (views.target) {
      targetLookAt.current.copy(views.target);
    } else {
      targetLookAt.current.set(
        0,
        0.02,
        0
      );
    }

    isAnimating.current = true;
  }, [view, viewRequest, views]);


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


export default function AnatomyScene({
  visibility,
  opacity,
  selected,
  onSelect,
  view,
  viewRequest,
  transforms,
  views,
  children,
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
          transforms={transforms}
        />

        {children}
      </Suspense>


      {/* VISTAS AUTOMÁTICAS */}

      <CameraRig
        view={view}
        viewRequest={viewRequest}
        controlsRef={controlsRef}
        views={views}
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

useGLTF.preload("/models/prostata.glb");
