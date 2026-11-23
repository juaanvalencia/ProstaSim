// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

vi.mock("../../../../src/components/clinicalCases/ui/CaseModelViewer", () => ({ default: () => <p>Modelo 3D</p> }));
// Same object on every render, like the real context's user state.
const auth = vi.hoisted(() => ({ user: { id: "user-1" } }));
vi.mock("../../../../src/context/AuthContext", () => ({ useAuth: () => auth }));
vi.mock("../../../../src/services/clinicalCasesService", () => ({
  getCaseAttempts: vi.fn(),
  saveCaseAttempt: vi.fn(),
}));

import { getCaseAttempts, saveCaseAttempt } from "../../../../src/services/clinicalCasesService";
import { caseTemplates } from "../../../../src/components/clinicalCases/data/casesData";
import ClinicalCases from "../../../../src/components/clinicalCases/ui/ClinicalCases";

const cards = () => screen.getAllByRole("button").filter((b) => b.classList.contains("cases-card"));

beforeEach(() => {
  vi.clearAllMocks();
  getCaseAttempts.mockResolvedValue({ data: [], error: null });
});
afterEach(cleanup);

describe("ClinicalCases", () => {
  it("lists every case as not started for a new student", async () => {
    render(<ClinicalCases />);

    expect(await screen.findByText(`0 de ${caseTemplates.length}`)).toBeTruthy();
    expect(cards()).toHaveLength(caseTemplates.length);
    cards().forEach((card) => expect(card.textContent).toContain("Sin iniciar"));
    expect(getCaseAttempts).toHaveBeenCalledWith("user-1");
  });

  it("shows the best score and attempts of the cases already solved", async () => {
    getCaseAttempts.mockResolvedValue({
      data: [
        { case_id: "ernesto-hpb", score: 60 },
        { case_id: "ernesto-hpb", score: 90 },
      ],
      error: null,
    });

    render(<ClinicalCases />);

    expect(await screen.findByText(`1 de ${caseTemplates.length}`)).toBeTruthy();
    const solved = cards()[caseTemplates.findIndex((t) => t.id === "ernesto-hpb")];
    expect(within(solved).getByText("Completado")).toBeTruthy();
    expect(solved.textContent).toContain("Mejor: 90% · 2 intentos");
    expect(solved.textContent).toContain("Repetir caso");
  });

  it("still lists the cases when the attempts cannot be read", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    getCaseAttempts.mockResolvedValue({ data: null, error: { message: "sin tabla" } });

    render(<ClinicalCases />);

    await vi.waitFor(() => expect(console.error).toHaveBeenCalled());
    expect(cards()).toHaveLength(caseTemplates.length);
    console.error.mockRestore();
  });

  it("saves a finished attempt with its seed and refreshes the progress", async () => {
    const user = userEvent.setup();
    saveCaseAttempt.mockResolvedValue({ error: null });
    render(<ClinicalCases />);

    await user.click(cards()[0]);
    await user.click(screen.getByRole("button", { name: /Siguiente/ }));
    await user.click(screen.getByRole("button", { name: /Continuar sin pruebas/ }));
    await user.click(screen.getByRole("button", { name: /Siguiente/ }));
    for (const question of document.querySelectorAll("fieldset.cases-question")) {
      await user.click(within(question).getAllByRole("radio")[0]);
    }
    await user.click(screen.getByRole("button", { name: /Enviar respuestas/ }));

    expect(await screen.findByText("Intento guardado en tu historial.")).toBeTruthy();
    expect(saveCaseAttempt).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: "user-1",
        caseId: caseTemplates[0].id,
        answers: expect.objectContaining({ seed: expect.any(Number) }),
      })
    );
    expect(getCaseAttempts).toHaveBeenCalledTimes(2);
  });

  it("tells the student when the attempt could not be saved", async () => {
    const user = userEvent.setup();
    vi.spyOn(console, "error").mockImplementation(() => {});
    saveCaseAttempt.mockRejectedValue(new Error("sin conexión"));
    render(<ClinicalCases />);

    await user.click(cards()[0]);
    await user.click(screen.getByRole("button", { name: /Siguiente/ }));
    await user.click(screen.getByRole("button", { name: /Continuar sin pruebas/ }));
    await user.click(screen.getByRole("button", { name: /Siguiente/ }));
    for (const question of document.querySelectorAll("fieldset.cases-question")) {
      await user.click(within(question).getAllByRole("radio")[0]);
    }
    await user.click(screen.getByRole("button", { name: /Enviar respuestas/ }));

    expect(
      await screen.findByText("No fue posible guardar el intento. Tu retroalimentación sigue disponible.")
    ).toBeTruthy();
    console.error.mockRestore();
  });

  it("opens a case and goes back to the list", async () => {
    const user = userEvent.setup();
    render(<ClinicalCases />);

    await user.click(cards()[0]);
    expect(screen.getByText("Paso 1 de 4 · Paciente")).toBeTruthy();

    await user.click(screen.getByRole("button", { name: "Casos" }));
    expect(cards()).toHaveLength(caseTemplates.length);
  });
});
