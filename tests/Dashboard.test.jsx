// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";

const auth = vi.hoisted(() => ({ current: null }));

vi.mock("../src/context/AuthContext", () => ({ useAuth: () => auth.current }));
vi.mock("../src/components/anatomy/Anatomy3D.jsx", () => ({ default: () => <p>Visor de anatomía</p> }));
vi.mock("../src/services/clinicalCasesService", () => ({
  getCaseAttempts: vi.fn(async () => ({ data: [], error: null })),
  saveCaseAttempt: vi.fn(),
}));

import { ThemeProvider } from "./helpers/renderWithProviders";
import Dashboard from "../src/Dashboard";

const RAIL_ONLY_QUERY = "(min-width: 481px) and (max-width: 700px)";

// Simulates the window width: only the given media query matches.
function mockMatchingQuery(matchingQuery) {
  window.matchMedia = vi.fn((query) => ({
    matches: query === matchingQuery,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }));
}

function renderDashboard() {
  render(
    <ThemeProvider>
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/login" element={<p>Pantalla de ingreso</p>} />
        </Routes>
      </MemoryRouter>
    </ThemeProvider>
  );
  return userEvent.setup();
}

const nav = (name) => screen.getByRole("button", { name });
const title = () => screen.getByRole("heading", { level: 1 }).textContent;

beforeEach(() => {
  localStorage.clear();
  mockMatchingQuery(null);
  auth.current = {
    user: { id: "user-1", email: "ana@correo.com" },
    profile: { full_name: "Ana María Pérez" },
    logout: vi.fn(async () => ({ error: null })),
  };
});

afterEach(() => {
  cleanup();
  delete window.matchMedia;
});

describe("Dashboard", () => {
  it("greets the student by first name and shows the initials", () => {
    renderDashboard();

    expect(title()).toBe("Inicio");
    expect(screen.getByText("¡Bienvenido, Ana!")).toBeTruthy();
    expect(screen.getAllByText("AM").length).toBeGreaterThan(0);
  });

  it("uses the email when the profile has no name", () => {
    auth.current.profile = null;
    renderDashboard();

    expect(screen.getByText("¡Bienvenido, ana@correo.com!")).toBeTruthy();
  });

  it("groups the menu and marks the modules that are not built yet", () => {
    renderDashboard();

    expect(screen.getByRole("group", { name: "Aprender" })).toBeTruthy();
    expect(screen.getByRole("group", { name: "Practicar" })).toBeTruthy();
    expect(screen.getByRole("group", { name: "Acompañamiento" })).toBeTruthy();
    expect(nav("Evaluaciones (pronto)")).toBeTruthy();
    expect(nav("Tutor IA (pronto)")).toBeTruthy();
    expect(nav("Mi progreso (pronto)")).toBeTruthy();
  });

  it("opens each available module from the menu", async () => {
    const user = renderDashboard();

    await user.click(nav("Aprendizaje"));
    expect(title()).toBe("Aprendizaje");
    expect(screen.getByText("Módulo de aprendizaje")).toBeTruthy();
    expect(nav("Aprendizaje").getAttribute("aria-current")).toBe("page");

    await user.click(nav("Anatomía 3D"));
    expect(await screen.findByText("Visor de anatomía")).toBeTruthy();

    await user.click(nav("Casos clínicos"));
    expect(screen.getByText("Simulación clínica")).toBeTruthy();
  });

  it("opens a module from its card on the home page", async () => {
    const user = renderDashboard();

    await user.click(screen.getByRole("heading", { level: 3, name: "Aprendizaje" }));

    expect(title()).toBe("Aprendizaje");
  });

  it("shows a placeholder for a module in development and goes back home", async () => {
    const user = renderDashboard();

    await user.click(nav("Tutor IA (pronto)"));
    expect(screen.getByText(/Este módulo se encuentra en fase de desarrollo/)).toBeTruthy();

    await user.click(nav("Volver al inicio"));
    expect(title()).toBe("Inicio");
  });

  it("collapses the menu with the button and with Ctrl+B, and remembers it", async () => {
    const user = renderDashboard();

    await user.click(nav("Colapsar menú"));
    expect(nav("Expandir menú")).toBeTruthy();
    expect(localStorage.getItem("prostasim:sidebar-collapsed")).toBe("true");

    await user.keyboard("{Control>}b{/Control}");
    expect(nav("Colapsar menú")).toBeTruthy();
    expect(localStorage.getItem("prostasim:sidebar-collapsed")).toBe("false");
  });

  it("starts collapsed when the student left it collapsed", () => {
    localStorage.setItem("prostasim:sidebar-collapsed", "true");

    renderDashboard();

    expect(nav("Expandir menú")).toBeTruthy();
  });

  it("keeps the icon rail on narrow windows instead of hiding the menu", async () => {
    mockMatchingQuery(RAIL_ONLY_QUERY);
    const user = renderDashboard();

    const layout = document.querySelector(".dashboard-layout");
    expect(layout.classList.contains("sidebar-collapsed")).toBe(true);
    expect(layout.classList.contains("sidebar-forced-rail")).toBe(true);

    await user.keyboard("{Control>}b{/Control}");
    expect(localStorage.getItem("prostasim:sidebar-collapsed")).toBeNull();
  });

  it("opens the menu as a drawer on phones and closes it on the backdrop", async () => {
    mockMatchingQuery("(max-width: 480px)");
    const user = renderDashboard();

    await user.click(nav("Mostrar u ocultar menú"));
    expect(document.querySelector(".sidebar-open")).toBeTruthy();

    await user.click(nav("Cerrar menú"));
    expect(document.querySelector(".sidebar-open")).toBeNull();
  });

  it("signs out and goes to the sign-in page", async () => {
    const user = renderDashboard();

    await user.click(screen.getByRole("button", { expanded: false, name: /Ana María Pérez/ }));
    await user.click(nav("Cerrar sesión"));

    expect(auth.current.logout).toHaveBeenCalledTimes(1);
    expect(await screen.findByText("Pantalla de ingreso")).toBeTruthy();
  });

  it("stays on the dashboard when signing out fails", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    auth.current.logout = vi.fn(async () => ({ error: { message: "sin conexión" } }));
    const user = renderDashboard();

    await user.click(screen.getByRole("button", { expanded: false, name: /Ana María Pérez/ }));
    await user.click(nav("Cerrar sesión"));

    expect(screen.queryByText("Pantalla de ingreso")).toBeNull();
    expect(title()).toBe("Inicio");
    console.error.mockRestore();
  });
});
