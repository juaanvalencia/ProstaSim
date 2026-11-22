import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Eye, EyeOff, Focus, Layers, RotateCcw } from "lucide-react";
import AnatomyScene from "./AnatomyScene";
import { DEFAULT_VISIBILITY, ORGANOS, VIEWS } from "./anatomyData";
import "./Anatomy3D.css";




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
