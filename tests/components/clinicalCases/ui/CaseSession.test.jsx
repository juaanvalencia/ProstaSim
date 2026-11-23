// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// The 3D viewer needs WebGL, which the test browser does not have.
vi.mock("../../../../src/components/clinicalCases/ui/CaseModelViewer", () => ({
  default: ({ revealed, showHotspot, onPalpate }) => (
    <div>
      <p>Modelo 3D {revealed ? "con hallazgo" : "sin hallazgo"}</p>
      {showHotspot && <button onClick={onPalpate}>Punto de palpación</button>}
    </div>
  ),
}));

import CaseSession from "../../../../src/components/clinicalCases/ui/CaseSession";

const BASE_CASE = {
  id: "caso-prueba",
  topic: "Hiperplasia prostática",
  difficulty: "Básico",
  reason: "Me levanto varias veces en la noche a orinar.",
  patient: { name: "Ernesto", age: 64, initials: "E", occupation: "Docente" },
  vitals: [{ label: "Presión arterial", value: "130/85 mmHg" }],
  symptoms: ["Nicturia"],
  history: ["Hipertensión controlada"],
  learningGoal: "Reconocer la hiperplasia prostática benigna.",
  tests: [
    {
      id: "psa", name: "PSA total", purpose: "Antígeno prostático", indicated: true,
      status: "normal", value: "2,1 ng/mL", reference: "< 4 ng/mL", note: "Normal.",
      rationale: "Descarta sospecha de cáncer.",
    },
    {
      id: "ct", name: "Tomografía", purpose: "Imagen de abdomen", indicated: false,
      status: "normal", value: "Sin hallazgos", reference: "-", note: "No aporta.",
      rationale: "No está indicada.",
    },
  ],
  questions: [
    {
      id: "q1",
      prompt: "¿Cuál es el diagnóstico más probable?",
      options: [
        { id: "a", text: "Hiperplasia prostática benigna" },
        { id: "b", text: "Prostatitis aguda" },
      ],
      correctOptionId: "a",
      hints: ["Piensa en la edad del paciente.", "El PSA es normal y no hay fiebre."],
      feedback: "La HPB explica los síntomas urinarios.",
    },
  ],
  model: { revealedBy: "psa" },
  analysis: "Paciente con síntomas obstructivos y PSA normal.",
  patientExplanation: "Ernesto, su próstata creció de forma benigna.",
  keyLearning: "La HPB es frecuente después de los 50 años.",
  sources: ["Guía de práctica clínica"],
};

const PALPATION_CASE = {
  ...BASE_CASE,
  tests: [
    {
      id: "dre", name: "Tacto rectal", purpose: "Examen físico", indicated: true,
      status: "alert", value: "Nódulo duro", reference: "-", note: "Sospechoso.",
      rationale: "Es el primer examen.",
    },
    ...BASE_CASE.tests,
  ],
  model: { revealedBy: "dre" },
  palpation: {
    instruction: "Toca el punto marcado en el modelo.",
    findings: [
      { id: "texture", label: "Consistencia", options: ["Elástica", "Dura"], answer: "Dura", why: "El nódulo es duro." },
    ],
  },
};

function renderSession(clinicalCase = BASE_CASE, { saveError = null } = {}) {
  const handlers = {
    onExit: vi.fn(),
    onRestart: vi.fn(),
    onComplete: vi.fn(async () => ({ error: saveError })),
  };
  render(<CaseSession clinicalCase={clinicalCase} {...handlers} />);
  return { user: userEvent.setup(), ...handlers };
}

const click = (user, name) => user.click(screen.getByRole("button", { name }));

afterEach(cleanup);

describe("CaseSession", () => {
  it("starts on the patient step with the consultation data", () => {
    renderSession();

    expect(screen.getByRole("heading", { name: "Ernesto, 64 años" })).toBeTruthy();
    expect(screen.getByText("Paso 1 de 4 · Paciente")).toBeTruthy();
    expect(screen.getByText(/Me levanto varias veces/)).toBeTruthy();
    expect(screen.getByText("Nicturia")).toBeTruthy();
    expect(screen.getByText("Hipertensión controlada")).toBeTruthy();
  });

  it("shows the requested test result and reveals the 3D finding", async () => {
    const { user } = renderSession();

    await click(user, /Siguiente/);
    expect(await screen.findByText("Modelo 3D sin hallazgo")).toBeTruthy();

    await user.click(screen.getByRole("checkbox", { name: /PSA total/ }));
    await click(user, /Solicitar pruebas \(1\)/);

    expect(screen.getByText("2,1 ng/mL")).toBeTruthy();
    expect(screen.getByText("Modelo 3D con hallazgo")).toBeTruthy();
    expect(screen.queryByRole("checkbox", { name: /PSA total/ })).toBeNull();
  });

  it("adds the missing necessary tests once when continuing without them", async () => {
    const { user } = renderSession();

    await click(user, /Siguiente/);
    await click(user, /Continuar sin pruebas/);

    expect(screen.getByText(/Faltaban pruebas necesarias para decidir/)).toBeTruthy();
    expect(screen.getByText("No solicitada")).toBeTruthy();

    await click(user, /Siguiente/);
    expect(screen.getByText("Paso 3 de 4 · Preguntas")).toBeTruthy();
  });

  it("shows hints one at a time and hides the button after the last one", async () => {
    const { user } = renderSession();

    await click(user, /Siguiente/);
    await click(user, /Continuar sin pruebas/);
    await click(user, /Siguiente/);

    await click(user, /Pedir una pista \(1\/2\)/);
    expect(screen.getByText("Piensa en la edad del paciente.")).toBeTruthy();

    await click(user, /Pedir otra pista \(2\/2\)/);
    expect(screen.getByText("El PSA es normal y no hay fiebre.")).toBeTruthy();
    expect(screen.queryByRole("button", { name: /Pedir otra pista/ })).toBeNull();
  });

  it("sends the answers only when every question is answered", async () => {
    const { user, onComplete } = renderSession();

    await click(user, /Siguiente/);
    await user.click(screen.getByRole("checkbox", { name: /PSA total/ }));
    await click(user, /Solicitar pruebas/);
    await click(user, /Siguiente/);

    const send = screen.getByRole("button", { name: /Enviar respuestas/ });
    expect(send.disabled).toBe(true);

    await user.click(screen.getByRole("radio", { name: "Hiperplasia prostática benigna" }));
    await user.type(screen.getByRole("textbox"), "  Su próstata creció.  ");
    await user.click(send);

    expect(onComplete).toHaveBeenCalledWith({
      result: expect.objectContaining({ score: 100, correct: 1, total: 1 }),
      answers: {
        questions: { q1: "a" },
        requestedTests: ["psa"],
        hintsUsed: {},
        patientExplanation: "Su próstata creció.",
      },
    });
    expect(await screen.findByText("Intento guardado en tu historial.")).toBeTruthy();
    expect(screen.getByText("100%")).toBeTruthy();
  });

  it("gives educational feedback on wrong answers, missed and unnecessary tests", async () => {
    const { user } = renderSession();

    await click(user, /Siguiente/);
    await user.click(screen.getByRole("checkbox", { name: /Tomografía/ }));
    await click(user, /Solicitar pruebas/);
    await click(user, /Siguiente/);
    await click(user, /Siguiente/);
    await user.click(screen.getByRole("radio", { name: "Prostatitis aguda" }));
    await click(user, /Enviar respuestas/);

    expect(await screen.findByText("PSA total (faltó solicitarla)")).toBeTruthy();
    expect(screen.getByText("Tomografía (innecesaria)")).toBeTruthy();
    expect(screen.getByText("Hiperplasia prostática benigna", { selector: "em" })).toBeTruthy();
    expect(screen.getByText("La HPB explica los síntomas urinarios.")).toBeTruthy();
    expect(screen.getByText("No escribiste una explicación en este intento.")).toBeTruthy();
    expect(screen.getByText("Ernesto, su próstata creció de forma benigna.")).toBeTruthy();
    expect(screen.getByText("Guía de práctica clínica")).toBeTruthy();
  });

  it("keeps the feedback when the attempt cannot be saved", async () => {
    const { user } = renderSession(BASE_CASE, { saveError: { message: "sin tabla" } });

    await click(user, /Siguiente/);
    await click(user, /Continuar sin pruebas/);
    await click(user, /Siguiente/);
    await user.click(screen.getByRole("radio", { name: "Hiperplasia prostática benigna" }));
    await click(user, /Enviar respuestas/);

    expect(
      await screen.findByText(
        "No fue posible guardar el intento. Tu retroalimentación sigue disponible."
      )
    ).toBeTruthy();
    expect(screen.getByText("Resultado del caso")).toBeTruthy();
  });

  it("offers a new patient and going back to the cases from the result", async () => {
    const { user, onRestart, onExit } = renderSession();

    await click(user, /Siguiente/);
    await click(user, /Continuar sin pruebas/);
    await click(user, /Siguiente/);
    await user.click(screen.getByRole("radio", { name: "Hiperplasia prostática benigna" }));
    await click(user, /Enviar respuestas/);

    await click(user, /Nuevo paciente/);
    expect(onRestart).toHaveBeenCalledTimes(1);

    await click(user, "Ver otros casos");
    expect(onExit).toHaveBeenCalledTimes(1);
  });

  it("requires the physical exam before moving on when the rectal exam is requested", async () => {
    const { user } = renderSession(PALPATION_CASE);

    await click(user, /Siguiente/);
    await user.click(screen.getByRole("checkbox", { name: /Tacto rectal/ }));
    await click(user, /Solicitar pruebas/);

    expect(screen.getByText("Toca el punto marcado en el modelo.")).toBeTruthy();
    expect(screen.queryByText("Nódulo duro")).toBeNull();

    await click(user, /Siguiente/);
    expect(screen.getByRole("alert").textContent).toContain("Completa el tacto rectal");

    await click(user, "Punto de palpación");
    const register = screen.getByRole("button", { name: /Registrar hallazgos/ });
    expect(register.disabled).toBe(true);

    await user.click(screen.getByRole("radio", { name: "Elástica" }));
    await user.click(register);

    expect(screen.getByText(/Coincidiste en 0 de 1 hallazgos/)).toBeTruthy();
    expect(screen.getByText("Correcto: Dura", { exact: false })).toBeTruthy();
    expect(screen.getByText("Nódulo duro")).toBeTruthy();
    expect(screen.getByText("Modelo 3D con hallazgo")).toBeTruthy();

    // The PSA is also needed: it is provided once before moving on.
    await click(user, /Siguiente/);
    expect(screen.getByText(/Faltaban pruebas necesarias/)).toBeTruthy();
    await click(user, /Siguiente/);
    expect(screen.getByText("Paso 3 de 4 · Preguntas")).toBeTruthy();
  });
});
