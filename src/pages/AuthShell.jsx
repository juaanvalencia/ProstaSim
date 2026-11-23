import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff, LockKeyhole } from "lucide-react";

import Logo from "../components/brand/Logo.jsx";
import "./Auth.css";

/** Shared layout for the sign-in and sign-up pages (design "NV_Acceso"). */
export default function AuthShell({ title, subtitle, children, footer }) {
  return (
    <div className="auth-page">
      <div className="auth-panel">
        <header className="auth-topbar">
          <Link to="/" className="auth-back">
            <ArrowLeft size={16} aria-hidden="true" />
            Volver al inicio
          </Link>
        </header>

        <main className="auth-main">
          <section className="auth-card">
            <Logo variant="horizontal" size={40} className="auth-logo" />

            <div className="auth-heading">
              <h1>{title}</h1>
              <p>{subtitle}</p>
            </div>

            {children}

            <div className="auth-footer">{footer}</div>
          </section>
        </main>
      </div>
    </div>
  );
}

/** Password input with a show/hide toggle. */
export function PasswordField({ id, label, ...inputProps }) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="auth-field">
      <label htmlFor={id}>{label}</label>
      <div className="auth-input">
        <LockKeyhole size={18} aria-hidden="true" />
        <input id={id} type={visible ? "text" : "password"} {...inputProps} />
        <button
          type="button"
          className="auth-toggle"
          onClick={() => setVisible((value) => !value)}
          aria-label={visible ? "Ocultar contraseña" : "Mostrar contraseña"}
          aria-pressed={visible}
          aria-controls={id}
        >
          {visible ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </div>
  );
}

/** Text/email input with a leading icon. */
export function TextField({ id, label, icon: Icon, ...inputProps }) {
  return (
    <div className="auth-field">
      <label htmlFor={id}>{label}</label>
      <div className="auth-input">
        <Icon size={18} aria-hidden="true" />
        <input id={id} {...inputProps} />
      </div>
    </div>
  );
}
