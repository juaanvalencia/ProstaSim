// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

const auth = vi.hoisted(() => ({ current: null }));

vi.mock("../src/context/AuthContext", () => ({ useAuth: () => auth.current }));
vi.mock("../src/components/landing/Welcome", () => ({ default: () => <p>Bienvenida</p> }));
vi.mock("../src/pages/Login", () => ({ default: () => <p>Ingreso</p> }));
vi.mock("../src/pages/Register", () => ({ default: () => <p>Registro</p> }));
vi.mock("../src/Dashboard", () => ({ default: () => <p>Panel</p> }));

import App from "../src/App";

function renderAt(path, { user = null, loading = false } = {}) {
  auth.current = { user, loading };
  render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>
  );
}

const USER = { id: "user-1" };

afterEach(cleanup);

describe("App routes", () => {
  it("shows a loading message while the session is checked", () => {
    renderAt("/", { loading: true });

    expect(screen.getByText("Cargando PROSTA-SIM...")).toBeTruthy();
  });

  it.each([
    ["/", "Bienvenida"],
    ["/login", "Ingreso"],
    ["/register", "Registro"],
    ["/ruta-inexistente", "Bienvenida"],
  ])("without a session, %s shows %s", (path, text) => {
    renderAt(path);

    expect(screen.getByText(text)).toBeTruthy();
  });

  it.each(["/", "/login", "/register", "/cualquier-ruta"])(
    "with a session, %s shows the dashboard",
    (path) => {
      renderAt(path, { user: USER });

      expect(screen.getByText("Panel")).toBeTruthy();
    }
  );
});
