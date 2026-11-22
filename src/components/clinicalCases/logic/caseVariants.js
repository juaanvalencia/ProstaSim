// Builds a concrete clinical case from a template and a numeric seed.
// The same template + seed always produces the same case, so attempts can be
// reproduced from the seed stored with them.

const NODULE_X = 0.0103;
const NODULE_Y = -0.0017;
const NODULE_Z = -0.0072;

const SIDES = {
  left: { lado: "izquierda", lado_m: "izquierdo", x: NODULE_X },
  right: { lado: "derecha", lado_m: "derecho", x: -NODULE_X },
};

export function createSeed() {
  return Math.floor(Math.random() * 2 ** 32);
}

// Mulberry32: small deterministic PRNG returning numbers in [0, 1).
export function createRandom(seed) {
  let state = seed >>> 0;

  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pick(random, items) {
  return items[Math.floor(random() * items.length)];
}

function randomInt(random, [min, max]) {
  return min + Math.floor(random() * (max - min + 1));
}

function shuffle(random, items) {
  const result = [...items];

  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
}

function getInitials(name) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

function fillTokens(value, tokens) {
  if (typeof value === "string") {
    return value.replace(/\{(\w+)\}/g, (match, key) => tokens[key] ?? match);
  }

  if (Array.isArray(value)) {
    return value.map((item) => fillTokens(item, tokens));
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, fillTokens(item, tokens)])
    );
  }

  return value;
}

export function buildCaseVariant(template, seed) {
  const random = createRandom(seed);
  const { patient: patientTemplate, model: modelTemplate } = template;

  const name = pick(random, patientTemplate.names);
  const patient = {
    name,
    age: randomInt(random, patientTemplate.ageRange),
    occupation: pick(random, patientTemplate.occupations),
    initials: getInitials(name),
  };

  const sideId = pick(random, Object.keys(SIDES));
  const side = SIDES[sideId];

  const model = {
    ...modelTemplate,
    nodule: modelTemplate.nodule && {
      scale: modelTemplate.nodule.scale,
      side: sideId,
      position: [side.x, NODULE_Y, NODULE_Z],
    },
  };

  const questions = template.questions.map((question) => ({
    ...question,
    options: shuffle(random, question.options),
  }));

  const filled = fillTokens(
    { ...template, model, questions },
    { nombre: name, lado: side.lado, lado_m: side.lado_m }
  );

  return { ...filled, patient, seed };
}
