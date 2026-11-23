import { describe, expect, it } from "vitest";

import { gradePalpation, isPalpationComplete } from "../../../../src/components/clinicalCases/logic/palpation";

const palpation = {
  instruction: "Toca el punto marcado.",
  findings: [
    { id: "size", label: "Tamaño", options: ["Normal", "Aumentado"], answer: "Normal", why: "A" },
    { id: "texture", label: "Consistencia", options: ["Elástica", "Dura"], answer: "Dura", why: "B" },
    { id: "surface", label: "Superficie", options: ["Lisa", "Irregular"], answer: "Irregular", why: "C" },
  ],
};

describe("gradePalpation", () => {
  it("marks each finding as correct or incorrect with its answer and why", () => {
    const graded = gradePalpation(palpation, {
      size: "Normal",
      texture: "Elástica",
      surface: "Irregular",
    });

    expect(graded.findings).toEqual([
      { id: "size", label: "Tamaño", chosen: "Normal", answer: "Normal", correct: true, why: "A" },
      { id: "texture", label: "Consistencia", chosen: "Elástica", answer: "Dura", correct: false, why: "B" },
      { id: "surface", label: "Superficie", chosen: "Irregular", answer: "Irregular", correct: true, why: "C" },
    ]);
    expect(graded.correct).toBe(2);
    expect(graded.total).toBe(3);
  });

  it("treats an unanswered finding as incorrect", () => {
    const graded = gradePalpation(palpation, { size: "Normal" });

    expect(graded.findings[1]).toMatchObject({ chosen: null, correct: false });
    expect(graded.correct).toBe(1);
  });
});

describe("isPalpationComplete", () => {
  it("is true only when every finding has a valid option", () => {
    expect(isPalpationComplete(palpation, { size: "Normal", texture: "Dura" })).toBe(false);
    expect(
      isPalpationComplete(palpation, { size: "Normal", texture: "Dura", surface: "Otra" })
    ).toBe(false);
    expect(
      isPalpationComplete(palpation, { size: "Normal", texture: "Dura", surface: "Lisa" })
    ).toBe(true);
  });
});
