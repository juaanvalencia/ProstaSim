const QUESTIONS_WEIGHT = 0.7;
const TESTS_WEIGHT = 0.3;
const UNNECESSARY_TEST_PENALTY = 0.5;
const HINT_PENALTY = 0.25;

export function gradeTests(tests, requestedTestIds) {
  const requested = new Set(requestedTestIds);
  const indicated = tests.filter((test) => test.indicated);

  const hits = indicated.filter((test) => requested.has(test.id));
  const missed = indicated.filter((test) => !requested.has(test.id));
  const unnecessary = tests.filter(
    (test) => !test.indicated && requested.has(test.id)
  );

  const ratio =
    (hits.length - unnecessary.length * UNNECESSARY_TEST_PENALTY) /
    indicated.length;

  return { hits, missed, unnecessary, ratio: Math.max(0, ratio) };
}

export function gradeCase(clinicalCase, answers, requestedTestIds, hintsUsed = {}) {
  const { questions, tests } = clinicalCase;

  const isCorrect = (question) => answers[question.id] === question.correctOptionId;
  const correct = questions.filter(isCorrect).length;

  // Each hint used lowers the value of a correct answer.
  const questionPoints = questions.reduce((total, question) => {
    if (!isCorrect(question)) return total;
    return total + Math.max(0, 1 - (hintsUsed[question.id] ?? 0) * HINT_PENALTY);
  }, 0);

  const testsGrade = gradeTests(tests, requestedTestIds);
  const questionsRatio = questionPoints / questions.length;

  return {
    correct,
    total: questions.length,
    hintsUsed: Object.values(hintsUsed).reduce((total, count) => total + count, 0),
    questionsScore: Math.round(questionsRatio * 100),
    testsScore: Math.round(testsGrade.ratio * 100),
    tests: testsGrade,
    score: Math.round(
      (questionsRatio * QUESTIONS_WEIGHT + testsGrade.ratio * TESTS_WEIGHT) * 100
    ),
  };
}

export function summarizeAttempts(attempts) {
  return attempts.reduce((summary, attempt) => {
    const current = summary[attempt.case_id] ?? { count: 0, bestScore: 0 };

    summary[attempt.case_id] = {
      count: current.count + 1,
      bestScore: Math.max(current.bestScore, attempt.score),
    };

    return summary;
  }, {});
}
