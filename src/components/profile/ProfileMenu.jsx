import { useEffect, useId, useRef, useState } from "react";
import { ChevronDown, LogOut, Palette } from "lucide-react";

import ThemeSwitch from "../theme/ThemeSwitch.jsx";
import "./ProfileMenu.css";

export default function ProfileMenu({ fullName, initials, role = "Estudiante", onLogout }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);
  const panelId = useId();

  useEffect(() => {
    if (!open) return undefined;

    const closeOnOutsideClick = (event) => {
      if (!containerRef.current?.contains(event.target)) setOpen(false);
    };
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);

    return () => {
      document.removeEventListener("mousedown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  return (
    <div className="profile-menu" ref={containerRef}>
      <button
        type="button"
        className="profile-menu-trigger"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
      >
        <span className="profile-menu-info">
          <strong>{fullName}</strong>
          <span>{role}</span>
        </span>
        <span className="profile-menu-avatar">{initials}</span>
        <ChevronDown size={16} className="profile-menu-chevron" aria-hidden="true" />
      </button>

      {open && (
        <div id={panelId} className="profile-menu-panel" aria-label="Menú de perfil">
          <div className="profile-menu-header">
            <span className="profile-menu-avatar">{initials}</span>
            <span className="profile-menu-info">
              <strong>{fullName}</strong>
              <span>{role}</span>
            </span>
          </div>

          <div className="profile-menu-section">
            <span className="profile-menu-label">
              <Palette size={14} aria-hidden="true" /> Tema
            </span>
            <ThemeSwitch />
          </div>

          <button type="button" className="profile-menu-logout" onClick={onLogout}>
            <LogOut size={16} aria-hidden="true" />
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
}
