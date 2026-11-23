import { Link } from "react-router-dom";
import {
  Activity,
  BookOpen,
  Brain,
  ClipboardList,
  ShieldCheck,
  Stethoscope,
  TrendingUp,
} from "lucide-react";

import Logo from "../brand/Logo.jsx";
import "./Welcome.css";

const AVAILABLE_MODULES = [
  {
    title: "Aprendizaje",
    description: "Consulta contenidos educativos sobre la próstata y sus patologías.",
    icon: BookOpen,
    color: "var(--m1)",
  },
  {
    title: "Anatomía 3D",
    description: "Explora en un modelo 3D las estructuras anatómicas de la próstata.",
    icon: Activity,
    color: "var(--m4)",
  },
  {
    title: "Casos clínicos",
    description: "Resuelve escenarios clínicos ficticios y analiza tus decisiones.",
    icon: Stethoscope,
    color: "var(--m2)",
  },
];

const UPCOMING_MODULES = [
  { title: "Tutor IA", icon: Brain },
  { title: "Evaluaciones", icon: ClipboardList },
  { title: "Mi progreso", icon: TrendingUp },
];

const STEPS = [
  {
    title: "Crea tu cuenta",
    text: "Regístrate con tu correo para acceder a la plataforma.",
  },
  {
    title: "Aprende los conceptos",
    text: "Repasa la anatomía y las patologías en el módulo de Aprendizaje.",
  },
  {
    title: "Explora en 3D",
    text: "Gira el modelo y ubica cada estructura de la próstata.",
  },
  {
    title: "Practica con casos",
    text: "Aplica lo aprendido en casos clínicos con pacientes ficticios.",
  },
];

function HeroVisual() {
  return (
    <div className="welcome-stage" aria-hidden="true">
      <svg className="welcome-organ" viewBox="0 0 320 300">
        <ellipse className="organ-bladder" cx="160" cy="70" rx="96" ry="50" />
        <path
          className="organ-gland"
          d="M160 108c34-18 100-18 120 36 18 52 0 104-50 126-26 12-50 14-70 14s-44-2-70-14c-50-22-68-74-50-126 20-54 86-54 120-36Z"
        />
        <path className="organ-urethra" d="M160 96v196" />
        <circle className="organ-spot" cx="208" cy="196" r="16" />
      </svg>

      <span className="welcome-tag tag-bladder">Vejiga</span>
      <span className="welcome-tag tag-urethra">Uretra</span>
      <span className="welcome-tag tag-zone">Zona periférica</span>

      <div className="welcome-chip">
        <Stethoscope size={16} />
        <span>
          <strong>Caso clínico</strong>
          Paciente ficticio
        </span>
      </div>
    </div>
  );
}

export default function Welcome() {
  return (
    <div className="welcome-page">
      <header className="welcome-header">
        <Link to="/" className="welcome-home" aria-label="PROSTA-SIM, inicio">
          <Logo variant="horizontal" size={36} />
        </Link>

        <nav className="welcome-nav" aria-label="Secciones">
          <a href="#modulos">Módulos</a>
          <a href="#como-funciona">Cómo funciona</a>
        </nav>

        <div className="welcome-header-actions">
          <Link to="/login" className="welcome-btn welcome-btn-ghost">
            Ingresar
          </Link>
        </div>
      </header>

      <main>
        <section className="welcome-hero">
          <div className="welcome-hero-text">
            <p className="welcome-eyebrow">Plataforma de simulación educativa</p>
            <h1>
              La ciencia de aprender <em>explorando.</em>
            </h1>
            <p className="welcome-lead">
              PROSTA-SIM es un simulador educativo sobre la próstata.
              Estudia los contenidos,
              explora la anatomía en 3D y practica con casos clínicos
              ficticios.
            </p>

            <div className="welcome-actions">
              <Link to="/register" className="welcome-btn welcome-btn-cta">
                Crear cuenta
              </Link>
            </div>

            <p className="welcome-note">
              <ShieldCheck size={16} aria-hidden="true" />
              Herramienta educativa. No diagnostica ni reemplaza a un profesional
              de la salud.
            </p>
          </div>

          <HeroVisual />
        </section>

        <section className="welcome-section" id="modulos" aria-labelledby="modulos-title">
          <p className="welcome-eyebrow">Módulos</p>
          <h2 id="modulos-title">Lo que puedes hacer hoy</h2>

          <ul className="welcome-modules">
            {AVAILABLE_MODULES.map(({ title, description, icon: Icon, color }) => (
              <li key={title} className="welcome-module" style={{ "--module": color }}>
                <span className="welcome-module-icon">
                  <Icon size={22} aria-hidden="true" />
                </span>
                <span className="welcome-badge">Disponible</span>
                <h3>{title}</h3>
                <p>{description}</p>
              </li>
            ))}
          </ul>

          <div className="welcome-upcoming">
            <p>En desarrollo</p>
            <ul>
              {UPCOMING_MODULES.map(({ title, icon: Icon }) => (
                <li key={title}>
                  <Icon size={16} aria-hidden="true" />
                  {title}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section
          className="welcome-section"
          id="como-funciona"
          aria-labelledby="como-funciona-title"
        >
          <p className="welcome-eyebrow">Cómo funciona</p>
          <h2 id="como-funciona-title">Cuatro pasos para empezar</h2>

          <ol className="welcome-steps">
            {STEPS.map(({ title, text }, index) => (
              <li key={title}>
                <span className="welcome-step-number">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3>{title}</h3>
                <p>{text}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="welcome-band" aria-labelledby="welcome-band-title">
          <div>
            <h2 id="welcome-band-title">Empieza a explorar.</h2>
            <p>Los casos y pacientes son ficticios, con fines educativos.</p>
          </div>
          <div className="welcome-band-actions">
            <Link to="/register" className="welcome-btn welcome-btn-light">
              Crear cuenta
            </Link>
          </div>
        </section>
      </main>

      <footer className="welcome-footer">
        <Logo variant="horizontal" size={28} />
        <p>Simulador educativo de próstata · Pacientes y datos ficticios con fines educativos</p>
      </footer>
    </div>
  );
}
