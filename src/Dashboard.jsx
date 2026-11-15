
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Activity,
  BookOpen,
  Brain,
  ClipboardList,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Stethoscope,
  TrendingUp,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";

import { useAuth } from "./context/AuthContext";
import Learning from "./components/learning/Learning.jsx";
import "./Dashboard.css";

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

const navigation = [
  { name: "Inicio", icon: LayoutDashboard },
  { name: "Aprendizaje", icon: BookOpen },
  { name: "Anatomía 3D", icon: Activity },
  { name: "Casos clínicos", icon: Stethoscope },
  { name: "Tutor IA", icon: Brain },
  { name: "Evaluaciones", icon: ClipboardList },
  { name: "Mi progreso", icon: TrendingUp },
];

export default function Dashboard() {
  const { user, profile, logout } = useAuth();
  const navigate = useNavigate();

  const [activeSection, setActiveSection] = useState("Inicio");
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

  const selectSection = (section) => {
    setActiveSection(section);
    setSidebarOpen(false);
  };

  return (
    <div className="dashboard-layout">
      <aside className={`dashboard-sidebar ${sidebarOpen ? "sidebar-open" : ""}`}>
        <div className="dashboard-brand">
          <h2>PROSTA-SIM</h2>
          <p>Plataforma de simulación educativa</p>
        </div>

        <div className="dashboard-nav-title">MENÚ PRINCIPAL</div>

        <nav className="dashboard-nav">
          {navigation.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.name}
                className={activeSection === item.name ? "active" : ""}
                onClick={() => selectSection(item.name)}
              >
                <Icon size={19} />
                {item.name}
              </button>
            );
          })}
        </nav>

        <div className="dashboard-sidebar-footer">
          <div className="dashboard-sidebar-user">
            <div className="dashboard-avatar">{initials}</div>

            <div className="dashboard-user-info">
              <strong>{fullName}</strong>
              <span>Estudiante</span>
            </div>
          </div>

          <button className="dashboard-logout" onClick={handleLogout}>
            <LogOut size={17} />
            Cerrar sesión
          </button>
        </div>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-topbar">
          <div className="dashboard-topbar-heading">
            <button
              className="dashboard-menu-toggle"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Abrir menú"
            >
              {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

            <div>
              <h1>{activeSection}</h1>
              <p>Panel de aprendizaje PROSTA-SIM</p>
            </div>
          </div>

          <div className="dashboard-user">
            <div className="dashboard-user-info">
              <strong>{fullName}</strong>
              <span>Estudiante</span>
            </div>

            <div className="dashboard-avatar">{initials}</div>
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

        {activeSection === "Aprendizaje" && <Learning />}

        {activeSection !== "Inicio" &&
          activeSection !== "Aprendizaje" && (
            <section className="dashboard-placeholder">
              <div className="dashboard-placeholder-icon">
                {activeSection === "Anatomía 3D" && <Activity size={35} />}
                {activeSection === "Casos clínicos" && <Stethoscope size={35} />}
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
