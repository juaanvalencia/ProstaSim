import { describe, expect, it } from "vitest";

import { buildCaseVariant, createRandom, createSeed } from "../../../../src/components/clinicalCases/logic/caseVariants";
import { caseTemplates } from "../../../../src/components/clinicalCases/data/casesData";
import { gradeCase } from "../../../../src/components/clinicalCases/logic/scoring";

const SEEDS = Array.from({ length: 200 }, (_, index) => index * 7919 + 1);

function collectStrings(value, result = []) {
  if (typeof value === "string") result.push(value);
  else if (Array.isArray(value)) value.forEach((item) => collectStrings(item, result));
  else if (value && typeof value === "object") {
    Object.values(value).forEach((item) => collectStrings(item, result));
  }
  return result;
}

describe("createRandom", () => {
  it("returns the same sequence for the same seed", () => {
    const a = createRandom(42);
    const b = createRandom(42);

    expect([a(), a(), a()]).toEqual([b(), b(), b()]);
  });

  it("only returns numbers between 0 and 1", () => {
    const random = createRandom(7);

    Array.from({ length: 1000 }, random).forEach((value) => {
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThan(1);
    });
  });
});

describe("createSeed", () => {
  it("returns a 32-bit whole number that changes between attempts", () => {
    const seeds = Array.from({ length: 50 }, createSeed);

    seeds.forEach((seed) => {
      expect(Number.isInteger(seed)).toBe(true);
      expect(seed).toBeGreaterThanOrEqual(0);
      expect(seed).toBeLessThan(2 ** 32);
    });
    expect(new Set(seeds).size).toBeGreaterThan(1);
  });
});

describe.each(caseTemplates)("buildCaseVariant($id)", (template) => {
  it("builds the same case for the same seed", () => {
    expect(buildCaseVariant(template, 123)).toEqual(buildCaseVariant(template, 123));
  });

  it("produces different patients across seeds", () => {
    const names = new Set(SEEDS.map((seed) => buildCaseVariant(template, seed).patient.name));

    expect(names.size).toBeGreaterThan(1);
  });

  it("keeps patients within the template ranges", () => {
    const [minAge, maxAge] = template.patient.ageRange;

    SEEDS.forEach((seed) => {
      const { patient } = buildCaseVariant(template, seed);

      expect(template.patient.names).toContain(patient.name);
      expect(template.patient.occupations).toContain(patient.occupation);
      expect(patient.age).toBeGreaterThanOrEqual(minAge);
      expect(patient.age).toBeLessThanOrEqual(maxAge);
    });
  });

  it("never changes clinical values, indicated tests or correct answers", () => {
    SEEDS.forEach((seed) => {
      const variant = buildCaseVariant(template, seed);

      expect(variant.tests.map((test) => [test.id, test.indicated])).toEqual(
        template.tests.map((test) => [test.id, test.indicated])
      );

      variant.questions.forEach((question, index) => {
        const original = template.questions[index];
        const sortById = (options) => [...options].sort((a, b) => a.id.localeCompare(b.id));

        expect(question.correctOptionId).toBe(original.correctOptionId);
        expect(sortById(question.options)).toEqual(sortById(original.options));
      });
    });
  });

  it("gives every question two hints, from general to specific", () => {
    template.questions.forEach((question) => {
      expect(question.hints).toHaveLength(2);
      question.hints.forEach((hint) => expect(hint.length).toBeGreaterThan(10));
    });
  });

  it("addresses the model patient explanation to the generated patient", () => {
    SEEDS.slice(0, 20).forEach((seed) => {
      const variant = buildCaseVariant(template, seed);

      expect(variant.patientExplanation.startsWith(variant.patient.name)).toBe(true);
    });
  });

  it("replaces every text token", () => {
    SEEDS.forEach((seed) => {
      const strings = collectStrings(buildCaseVariant(template, seed));

      strings.forEach((text) => expect(text).not.toMatch(/\{\w+\}/));
    });
  });

  it("only mentions the selected patient's name", () => {
    SEEDS.forEach((seed) => {
      const variant = buildCaseVariant(template, seed);
      const otherNames = template.patient.names.filter(
        (name) => name !== variant.patient.name
      );
      const text = collectStrings({ ...variant, patient: null }).join(" ");

      otherNames.forEach((name) => expect(text).not.toContain(name));
    });
  });

  it("grades a fully correct attempt as 100% for any order of options", () => {
    SEEDS.slice(0, 20).forEach((seed) => {
      const variant = buildCaseVariant(template, seed);
      const answers = Object.fromEntries(
        variant.questions.map((question) => [question.id, question.correctOptionId])
      );
      const indicated = variant.tests.filter((test) => test.indicated).map((test) => test.id);

      expect(gradeCase(variant, answers, indicated).score).toBe(100);
    });
  });
});

describe("palpation", () => {
  const palpationTemplates = caseTemplates.filter((template) => template.palpation);

  it("is defined only for the three physical exam cases", () => {
    expect(palpationTemplates.map((template) => template.id).sort()).toEqual([
      "alberto-cancer",
      "jorge-cancer",
      "prostatitis-aguda",
    ]);
  });

  it.each(palpationTemplates)("has at least 3 valid findings ($id)", (template) => {
    SEEDS.slice(0, 20).forEach((seed) => {
      const { palpation } = buildCaseVariant(template, seed);

      expect(palpation.instruction.length).toBeGreaterThan(10);
      expect(palpation.findings.length).toBeGreaterThanOrEqual(3);
      palpation.findings.forEach((finding) => {
        expect(finding.options).toContain(finding.answer);
        expect(finding.why.length).toBeGreaterThan(10);
      });
    });
  });

  it("follows the nodule side in alberto-cancer", () => {
    const template = caseTemplates.find((item) => item.id === "alberto-cancer");
    const sides = new Set();

    SEEDS.forEach((seed) => {
      const { model, palpation } = buildCaseVariant(template, seed);
      const location = palpation.findings.find(
        (finding) => finding.label === "Ubicación del hallazgo"
      );

      sides.add(model.nodule.side);
      expect(location.answer).toBe(
        model.nodule.side === "left" ? "Lado izquierdo" : "Lado derecho"
      );
    });

    expect(sides).toEqual(new Set(["left", "right"]));
  });
});

describe("nodule side", () => {
  const noduleTemplates = caseTemplates.filter((template) => template.model.nodule);

  it.each(noduleTemplates)("matches the text and the 3D position ($id)", (template) => {
    const sides = new Set();

    SEEDS.forEach((seed) => {
      const { model, tests } = buildCaseVariant(template, seed);
      const side = model.nodule.side;
      const sideWord = side === "left" ? "izquierd" : "derech";
      const otherWord = side === "left" ? "derech" : "izquierd";
      const sideTexts = [model.finding, ...tests.map((test) => test.value)].join(" ");

      sides.add(side);
      expect(Math.sign(model.nodule.position[0])).toBe(side === "left" ? 1 : -1);
      expect(sideTexts).toContain(sideWord);
      expect(sideTexts).not.toContain(otherWord);
    });

    expect(sides).toEqual(new Set(["left", "right"]));
  });
});
