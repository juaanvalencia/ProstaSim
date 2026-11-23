// Grades the student's description of the digital rectal exam.
// It is formative only: it never changes the case score (see scoring.js).

export function isPalpationComplete(palpation, answers) {
  return palpation.findings.every((finding) =>
    finding.options.includes(answers?.[finding.id])
  );
}

export function gradePalpation(palpation, answers) {
  const findings = palpation.findings.map(({ id, label, answer, why }) => {
    const chosen = answers?.[id] ?? null;

    return { id, label, chosen, answer, correct: chosen === answer, why };
  });

  return {
    findings,
    correct: findings.filter((finding) => finding.correct).length,
    total: findings.length,
  };
}
