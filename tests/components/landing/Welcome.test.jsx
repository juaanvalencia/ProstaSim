// @vitest-environment jsdom
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import Welcome from "../../../src/components/landing/Welcome.jsx";

function renderWelcome() {
  render(
    <MemoryRouter initialEntries={["/"]}>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<p>Pantalla de ingreso</p>} />
        <Route path="/register" element={<p>Pantalla de registro</p>} />
      </Routes>
    </MemoryRouter>
  );
}

afterEach(cleanup);

describe("Welcome", () => {
  it("presents the platform and its educational disclaimer", () => {
    renderWelcome();

    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe(
      "La ciencia de aprender explorando."
    );
    expect(screen.getByText(/No diagnostica ni reemplaza a un profesional/)).toBeTruthy();
  });

  it("lists the available modules and the ones in development", () => {
    renderWelcome();

    const modules = screen.getByRole("region", { name: "Lo que puedes hacer hoy" });

    expect(within(modules).getAllByRole("heading", { level: 3 }).map((h) => h.textContent)).toEqual([
      "Aprendizaje",
      "Anatomía 3D",
      "Casos clínicos",
    ]);
    expect(within(modules).getByText("Tutor IA")).toBeTruthy();
    expect(within(modules).getByText("Evaluaciones")).toBeTruthy();
    expect(within(modules).getByText("Mi progreso")).toBeTruthy();
  });

  it("explains how to start in four steps", () => {
    renderWelcome();

    const steps = screen.getByRole("region", { name: "Cuatro pasos para empezar" });

    expect(within(steps).getAllByRole("listitem")).toHaveLength(4);
  });

  it("has a single sign-in link that opens the sign-in page", async () => {
    renderWelcome();

    const signIn = screen.getAllByRole("link", { name: "Ingresar" });
    expect(signIn).toHaveLength(1);

    await userEvent.setup().click(signIn[0]);
    expect(screen.getByText("Pantalla de ingreso")).toBeTruthy();
  });

  it("opens the sign-up page from the create account button", async () => {
    renderWelcome();

    await userEvent.setup().click(screen.getAllByRole("link", { name: "Crear cuenta" })[0]);

    expect(screen.getByText("Pantalla de registro")).toBeTruthy();
  });
});
