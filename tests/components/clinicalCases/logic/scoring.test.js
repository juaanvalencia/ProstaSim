import { describe, expect, it } from "vitest";

import { gradeCase, gradeTests, summarizeAttempts } from "../../../../src/components/clinicalCases/logic/scoring";

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

describe("gradeTests", () => {
  const tests = [
    { id: "psa", indicated: true },
    { id: "eco", indicated: true },
    { id: "ct", indicated: false },
  ];
  const ids = (list) => list.map((test) => test.id);

  it("separates the requested tests into hits, missed and unnecessary", () => {
    const result = gradeTests(tests, ["psa", "ct"]);

    expect(ids(result.hits)).toEqual(["psa"]);
    expect(ids(result.missed)).toEqual(["eco"]);
    expect(ids(result.unnecessary)).toEqual(["ct"]);
    expect(result.ratio).toBe(0.25); // (1 - 0.5) / 2
  });

  it("never gives a negative grade", () => {
    expect(gradeTests(tests, ["ct"]).ratio).toBe(0);
  });

  it("gives nothing when no test was requested", () => {
    const result = gradeTests(tests, []);

    expect(result.ratio).toBe(0);
    expect(ids(result.missed)).toEqual(["psa", "eco"]);
  });
});

describe("summarizeAttempts", () => {
  it("counts the attempts and keeps the best score of each case", () => {
    const summary = summarizeAttempts([
      { case_id: "ernesto-hpb", score: 60 },
      { case_id: "ernesto-hpb", score: 90 },
      { case_id: "ernesto-hpb", score: 75 },
      { case_id: "luis-control", score: 40 },
    ]);

    expect(summary).toEqual({
      "ernesto-hpb": { count: 3, bestScore: 90 },
      "luis-control": { count: 1, bestScore: 40 },
    });
  });

  it("returns an empty summary when there are no attempts", () => {
    expect(summarizeAttempts([])).toEqual({});
  });

  it("keeps a best score of 0 for attempts that scored 0", () => {
    expect(summarizeAttempts([{ case_id: "jorge-cancer", score: 0 }])).toEqual({
      "jorge-cancer": { count: 1, bestScore: 0 },
    });
  });
});
