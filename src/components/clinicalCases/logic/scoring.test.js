import { describe, expect, it } from "vitest";

import { gradeCase } from "./scoring";

const clinicalCase = {
  tests: [
    { id: "psa", indicated: true },
    { id: "ct", indicated: false },
  ],
  questions: [
    { id: "q1", correctOptionId: "a" },
    { id: "q2", correctOptionId: "b" },
  ],
};

const allCorrect = { q1: "a", q2: "b" };

describe("gradeCase", () => {
  it("gives 100% to correct answers and indicated tests without hints", () => {
    const result = gradeCase(clinicalCase, allCorrect, ["psa"]);

    expect(result.score).toBe(100);
    expect(result.questionsScore).toBe(100);
  });

  it("discounts 25% of a correct answer for each hint used", () => {
    const oneHint = gradeCase(clinicalCase, allCorrect, ["psa"], { q1: 1 });
    const twoHints = gradeCase(clinicalCase, allCorrect, ["psa"], { q1: 2 });

    expect(oneHint.questionsScore).toBe(88); // (0.75 + 1) / 2
    expect(twoHints.questionsScore).toBe(75); // (0.5 + 1) / 2
  });

  it("still counts an answer as correct when hints were used", () => {
    const result = gradeCase(clinicalCase, allCorrect, ["psa"], { q1: 2, q2: 1 });

    expect(result.correct).toBe(2);
    expect(result.hintsUsed).toBe(3);
  });

  it("gives nothing to a wrong answer, with or without hints", () => {
    const result = gradeCase(clinicalCase, { q1: "c", q2: "b" }, ["psa"], { q1: 2 });

    expect(result.questionsScore).toBe(50);
  });

  it("penalizes unnecessary tests", () => {
    const result = gradeCase(clinicalCase, allCorrect, ["psa", "ct"]);

    expect(result.testsScore).toBe(50);
    expect(result.tests.unnecessary.map((test) => test.id)).toEqual(["ct"]);
  });
});
