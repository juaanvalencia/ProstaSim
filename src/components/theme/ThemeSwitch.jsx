import { Monitor, Moon, Sun } from "lucide-react";

import { useTheme } from "../../context/useTheme.js";
import "./ThemeSwitch.css";

const OPTIONS = [
  { value: "light", label: "Claro", icon: Sun },
  { value: "dark", label: "Oscuro", icon: Moon },
  { value: "system", label: "Sistema", icon: Monitor },
];

export default function ThemeSwitch({ className = "" }) {
  const { theme, setTheme } = useTheme();

  const handleKeyDown = (event) => {
    const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[event.key];
    if (!step) return;

    event.preventDefault();
    const index = OPTIONS.findIndex((option) => option.value === theme);
    const next = OPTIONS[(index + step + OPTIONS.length) % OPTIONS.length];
    setTheme(next.value);
    event.currentTarget
      .querySelector(`[data-value="${next.value}"]`)
      ?.focus();
  };

  return (
    <div
      className={`theme-switch ${className}`.trim()}
      role="radiogroup"
      aria-label="Tema de color"
      onKeyDown={handleKeyDown}
    >
      {OPTIONS.map(({ value, label, icon: Icon }) => {
        const checked = theme === value;

        return (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={checked}
            tabIndex={checked ? 0 : -1}
            data-value={value}
            className={`theme-switch-option ${checked ? "is-active" : ""}`.trim()}
            onClick={() => setTheme(value)}
            title={label}
          >
            <Icon size={15} aria-hidden="true" />
            <span className="theme-switch-label">{label}</span>
          </button>
        );
      })}
    </div>
  );
}
