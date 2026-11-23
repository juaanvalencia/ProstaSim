// @vitest-environment jsdom
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import Learning from "../../../src/components/learning/Learning";

const UNITS = [
  "Introducción a la próstata",
  "Anatomía y ubicación",
  "Funciones de la próstata",
  "Patologías prostáticas",
  "Cáncer de próstata",
  "Detección y diagnóstico",
];

afterEach(cleanup);

describe("Learning", () => {
  it("lists the six learning units in order", () => {
    render(<Learning />);

    const titles = screen.getAllByRole("heading", { level: 3 }).map((h) => h.textContent);

    expect(titles).toEqual(UNITS);
  });

  it("opens a unit with its sections and the medical disclaimer", async () => {
    render(<Learning />);

    await userEvent.setup().click(screen.getByText("Introducción a la próstata"));

    expect(screen.getByRole("heading", { level: 2, name: "Introducción a la próstata" })).toBeTruthy();
    expect(screen.getByText("UNIDAD 01")).toBeTruthy();
    expect(screen.getByText("¿Qué es la próstata?")).toBeTruthy();
    expect(screen.getByText(/no sustituye una valoración/)).toBeTruthy();
  });

  it("goes back to the unit list from a unit", async () => {
    const user = userEvent.setup();
    render(<Learning />);

    await user.click(screen.getByText("Cáncer de próstata"));
    await user.click(screen.getByRole("button", { name: "← Volver a las unidades" }));

    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(UNITS.length);
  });

  it("opens every unit with at least one section", async () => {
    const user = userEvent.setup();
    render(<Learning />);

    for (const title of UNITS) {
      await user.click(screen.getByText(title));

      expect(screen.getByRole("heading", { level: 2, name: title })).toBeTruthy();
      expect(screen.getAllByRole("heading", { level: 3 }).length).toBeGreaterThan(0);

      await user.click(screen.getByRole("button", { name: "Volver a las unidades" }));
    }
  });
});
