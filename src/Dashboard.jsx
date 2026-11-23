
import { Suspense, lazy, useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Evaluation from "./components/evaluations/Evaluation";

import {
  Activity,
  BookOpen,
  Brain,
  ClipboardList,
  GraduationCap,
  LayoutDashboard,
  PanelLeftClose,
  PanelLeftOpen,
  Stethoscope,
  TrendingUp,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";

import { useAuth } from "./context/AuthContext";
import Logo from "./components/brand/Logo.jsx";
import ProfileMenu from "./components/profile/ProfileMenu.jsx";
import Learning from "./components/learning/Learning.jsx";
import ClinicalCases from "./components/clinicalCases/ui/ClinicalCases.jsx";
import "./Dashboard.css";

// The 3D module (Three.js) is heavy: load it only when the section is opened.
const Anatomy3D = lazy(() => import("./components/anatomy/Anatomy3D.jsx"));

const modules = [
  {
    title: "Aprendizaje",
    description: "Consulta contenidos educativos sobre la próstata y sus patologías.",
    icon: BookOpen,
    section: "Aprendizaje",
  },
  {
    title: "Anatomía 3D",
    description: "Explora las estructuras anatómicas de la próstata.",
    icon: Activity,
    section: "Anatomía 3D",
  },
  {
    title: "Casos clínicos",
    description: "Resuelve escenarios clínicos ficticios y analiza tus decisiones.",
    icon: Stethoscope,
    section: "Casos clínicos",
  },
  {
    title: "Tutor IA",
    description: "Refuerza tus conocimientos mediante acompañamiento educativo.",
    icon: Brain,
    section: "Tutor IA",
  },
];

// Phones in portrait: the sidebar is a drawer opened from the top bar.
const MOBILE_QUERY = "(max-width: 480px)";
// Narrow windows (high zoom, tablets, phones in landscape): the sidebar stays
// visible as the icon rail instead of disappearing.
const RAIL_ONLY_QUERY = "(min-width: 481px) and (max-width: 700px)";

// Sidebar groups. `soon` marks modules not built yet (they open a placeholder).
const navigationGroups = [
  {
    title: "Aprender",
    items: [
      { name: "Inicio", icon: LayoutDashboard },
      { name: "Aprendizaje", icon: BookOpen },
      { name: "Anatomía 3D", icon: Activity },
    ],
  },
  {
    title: "Practicar",
    items: [
      { name: "Casos clínicos", icon: Stethoscope },
      { name: "Evaluaciones", icon: ClipboardList, soon: true },
    ],
  },
  {
    title: "Acompañamiento",
    items: [
      { name: "Tutor IA", icon: Brain, soon: true },
      { name: "Mi progreso", icon: TrendingUp, soon: true },
    ],
  },
];

const isTypingTarget = (element) =>
  element instanceof HTMLElement &&
  (element.isContentEditable ||
    element.closest("input, textarea, select, [contenteditable]") !== null);

export default function Dashboard() {
  const { user, profile, logout } = useAuth();
  const navigate = useNavigate();

  const [activeSection, setActiveSection] = useState("Inicio");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(
    () => localStorage.getItem("prostasim:sidebar-collapsed") === "true"
  );

  const [forcedRail, setForcedRail] = useState(
    () => window.matchMedia(RAIL_ONLY_QUERY).matches
  );

  useEffect(() => {
    const query = window.matchMedia(RAIL_ONLY_QUERY);
    const handleChange = (event) => setForcedRail(event.matches);
    query.addEventListener("change", handleChange);
    return () => query.removeEventListener("change", handleChange);
  }, []);

  const toggleSidebar = useCallback(() => {
    if (window.matchMedia(RAIL_ONLY_QUERY).matches) return;

    if (window.matchMedia(MOBILE_QUERY).matches) {
      setSidebarOpen((open) => !open);
      return;
    }

    setSidebarCollapsed((collapsed) => {
      localStorage.setItem("prostasim:sidebar-collapsed", String(!collapsed));
      return !collapsed;
    });
  }, []);

  // Ctrl+B (Cmd+B on macOS) toggles the sidebar, except while typing.
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (
        !(event.ctrlKey || event.metaKey) ||
        event.altKey ||
        event.shiftKey ||
        event.key.toLowerCase() !== "b" ||
        isTypingTarget(event.target)
      ) {
        return;
      }

      event.preventDefault();
      toggleSidebar();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleSidebar]);

  const fullName =
    profile?.full_name ||
    user?.user_metadata?.full_name ||
    user?.email ||
    "Estudiante";

  const initials = fullName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

  const handleLogout = async () => {
    const { error } = await logout();

    if (error) {
      console.error("Error al cerrar sesión:", error.message);
      return;
    }

    navigate("/login");
  };

  // In the icon rail, labels are fixed-position tooltips so the scrollable nav does not clip them.
  const placeRailTooltip = (event) => {
    const button = event.target.closest?.("button");
    if (!button) return;
    const rect = button.getBoundingClientRect();
    button.style.setProperty("--tip-y", `${rect.top + rect.height / 2}px`);
  };

  const selectSection = (section) => {
    setActiveSection(section);
    setSidebarOpen(false);
  };

  return (
    <div
      className={`dashboard-layout ${
        sidebarCollapsed || forcedRail ? "sidebar-collapsed" : ""} ${forcedRail ? "sidebar-forced-rail" : ""
      }`}
    >
      <aside
        onMouseOver={placeRailTooltip}
        onFocus={placeRailTooltip}
        className={`dashboard-sidebar ${sidebarOpen ? "sidebar-open" : ""}`}>
        <div className="dashboard-brand">
          <h2>
            <span className="dashboard-brand-full">
              <Logo variant="horizontal" size={36} />
            </span>
            <span className="dashboard-brand-icon">
              <Logo variant="icon" size={40} />
            </span>
          </h2>
          <p>Plataforma de simulación educativa</p>
        </div>

        <nav className="dashboard-nav" aria-label="Menú principal">
          {navigationGroups.map((group) => (
            <div
              key={group.title}
              className="dashboard-nav-group"
              role="group"
              aria-label={group.title}
            >
              <div className="dashboard-nav-title" aria-hidden="true">
                {group.title}
              </div>

              {group.items.map((item) => {
                const Icon = item.icon;
                const classes = [
                  activeSection === item.name ? "active" : "",
                  item.soon ? "is-soon" : "",
                ]
                  .filter(Boolean)
                  .join(" ");

                return (
                  <button
                    key={item.name}
                    className={classes}
                    onClick={() => selectSection(item.name)}
                    aria-label={item.soon ? `${item.name} (pronto)` : item.name}
                    aria-current={activeSection === item.name ? "page" : undefined}
                  >
                    <Icon size={19} aria-hidden="true" />
                    <span className="dashboard-nav-label">{item.name}</span>
                    {item.soon && (
                      <span className="dashboard-soon" aria-hidden="true">
                        Pronto
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        <div className="dashboard-sidebar-footer">
          <button
            className="dashboard-collapse"
            onClick={toggleSidebar}
            aria-expanded={!sidebarCollapsed}
            aria-keyshortcuts="Control+B Meta+B"
            aria-label={sidebarCollapsed ? "Expandir menú" : "Colapsar menú"}
          >
            {sidebarCollapsed ? (
              <PanelLeftOpen size={19} aria-hidden="true" />
            ) : (
              <PanelLeftClose size={19} aria-hidden="true" />
            )}
            <span className="dashboard-nav-label">
              {sidebarCollapsed ? "Expandir menú" : "Colapsar menú"}
            </span>
            <kbd className="dashboard-kbd" aria-hidden="true">Ctrl+B</kbd>
          </button>
        </div>
      </aside>

      {sidebarOpen && (
        <button
          className="dashboard-backdrop"
          aria-label="Cerrar menú"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <main className="dashboard-main">
        <header className="dashboard-topbar">
          <div className="dashboard-topbar-heading">
            <button
              className="dashboard-menu-toggle"
              onClick={toggleSidebar}
              aria-label="Mostrar u ocultar menú"
              title="Mostrar u ocultar menú"
            >
              {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

            <div>
              <h1>{activeSection}</h1>
              <p>Panel de aprendizaje PROSTA-SIM</p>
            </div>
          </div>

          <div className="dashboard-topbar-actions">
            <ProfileMenu
              fullName={fullName}
              initials={initials}
              onLogout={handleLogout}
            />
          </div>
        </header>

        {activeSection === "Inicio" && (
          <>
            <section className="dashboard-welcome">
              <div>
                <span className="dashboard-eyebrow">
                  PLATAFORMA EDUCATIVA
                </span>

                <h2>¡Bienvenido, {fullName.split(" ")[0]}!</h2>

                <p>
                  Continúa explorando, aprendiendo y fortaleciendo
                  tus conocimientos sobre la próstata.
                </p>
              </div>
            </section>

            <section className="dashboard-stats">
              <article className="dashboard-stat">
                <div className="dashboard-stat-header">
                  Módulos disponibles
                  <BookOpen className="dashboard-stat-icon" size={21} />
                </div>
                <h3>4</h3>
                <small>Módulos educativos planificados</small>
              </article>

              <article className="dashboard-stat">
                <div className="dashboard-stat-header">
                  Actividades completadas
                  <ClipboardList className="dashboard-stat-icon" size={21} />
                </div>
                <h3>0</h3>
                <small>Actividades registradas</small>
              </article>

              <article className="dashboard-stat">
                <div className="dashboard-stat-header">
                  Progreso académico
                  <TrendingUp className="dashboard-stat-icon" size={21} />
                </div>
                <h3>0%</h3>
                <small>Progreso inicial</small>
              </article>
            </section>

            <section className="dashboard-modules-section">
              <div className="dashboard-section-title">
                <div>
                  <h2>Explora PROSTA-SIM</h2>
                  <p>Selecciona el módulo que deseas consultar.</p>
                </div>
              </div>

              <div className="dashboard-modules">
                {modules.map((module) => {
                  const Icon = module.icon;

                  return (
                    <article
                      key={module.title}
                      className="dashboard-module"
                      onClick={() => selectSection(module.section)}
                    >
                      <div className="dashboard-module-icon">
                        <Icon size={25} />
                      </div>

                      <h3>{module.title}</h3>
                      <p>{module.description}</p>

                      <span>
                        Explorar módulo
                        <ChevronRight size={15} />
                      </span>
                    </article>
                  );
                })}
              </div>
            </section>

            <section className="dashboard-information">
              <div className="dashboard-information-icon">
                <GraduationCap size={24} />
              </div>

              <div>
                <h3>Aprendizaje interactivo</h3>
                <p>
                  PROSTA-SIM es una herramienta educativa diseñada
                  para facilitar el estudio de la anatomía prostática,
                  el análisis de escenarios ficticios y la evaluación
                  de conocimientos.
                </p>
              </div>
            </section>
          </>
        )}

        
        {activeSection === "Evaluaciones" && <Evaluation />}  

        {activeSection === "Anatomía 3D" && (
          <Suspense fallback={<div className="dashboard-loading">Cargando modelo 3D…</div>}>
            <Anatomy3D />
          </Suspense>
        )}

        {activeSection === "Casos clínicos" && <ClinicalCases />}

        {activeSection !== "Inicio" &&
          activeSection !== "Aprendizaje" &&
          activeSection !== "Evaluaciones" &&
          activeSection !== "Anatomía 3D" &&
          activeSection !== "Casos clínicos" && (
            <section className="dashboard-placeholder">
              <div className="dashboard-placeholder-icon">
                {activeSection === "Tutor IA" && <Brain size={35} />}
                {activeSection === "Evaluaciones" && <ClipboardList size={35} />}
                {activeSection === "Mi progreso" && <TrendingUp size={35} />}
              </div>

              <span className="dashboard-eyebrow">PROSTA-SIM</span>
              <h2>{activeSection}</h2>

              <p>
                Este módulo se encuentra en fase de desarrollo.
                Próximamente estará disponible con sus funcionalidades
                educativas e interactivas.
              </p>

              <button
                className="dashboard-back-button"
                onClick={() => selectSection("Inicio")}
              >
                Volver al inicio
              </button>
            </section>
          )}

        <footer className="dashboard-footer">
          PROSTA-SIM · Plataforma de aprendizaje y simulación educativa
        </footer>
      </main>
    </div>
  );
}
