import { Suspense, lazy, useEffect, useState } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  CheckCircle2,
  ClipboardList,
  FlaskConical,
  Lightbulb,
  RotateCcw,
  Send,
  User,
} from "lucide-react";

const CaseModelViewer = lazy(() => import("./CaseModelViewer"));
import PatientStep from "./steps/PatientStep";
import TestsStep from "./steps/TestsStep";
import QuestionsStep from "./steps/QuestionsStep";
import FeedbackStep from "./steps/FeedbackStep";
import PhysicalExam from "./steps/PhysicalExam";
import { gradeCase } from "../logic/scoring";
import { gradePalpation } from "../logic/palpation";

const steps = [
  { id: "patient", label: "Paciente", icon: User },
  { id: "tests", label: "Pruebas", icon: FlaskConical },
  { id: "questions", label: "Preguntas", icon: ClipboardList },
  { id: "feedback", label: "Resultado", icon: Lightbulb },
];

const FEEDBACK_STEP = 3;

// Share of the stage that must be on screen to count as "seen".
const STAGE_VISIBLE_RATIO = 0.3;

const NOTICE_TEXT = {
  finding: "Nuevo hallazgo en el modelo 3D",
  exam: "Examen físico disponible en el modelo 3D",
};

export default function CaseSession({
  clinicalCase,
  onExit,
  onRestart,
  onComplete,
}) {
  const [stepIndex, setStepIndex] = useState(0);
  const [requestedIds, setRequestedIds] = useState([]);
  const [providedIds, setProvidedIds] = useState([]);
  const [selectedTestIds, setSelectedTestIds] = useState([]);
  const [answers, setAnswers] = useState({});
  const [hintsUsed, setHintsUsed] = useState({});
  const [explanation, setExplanation] = useState("");
  const [result, setResult] = useState(null);
  const [saveStatus, setSaveStatus] = useState("idle");
  // Physical exam: "pending" (asked to touch the model), "form", "done".
  const [examStage, setExamStage] = useState("pending");
  const [palpationAnswers, setPalpationAnswers] = useState({});
  const [examBlocked, setExamBlocked] = useState(false);

  const { patient, questions, tests, model, palpation } = clinicalCase;
  const currentStep = steps[stepIndex].id;
  const allAnswered = questions.every((question) => answers[question.id]);

  // Only a requested DRE asks for the exam; an auto-provided one is shown as is.
  const examRequested = Boolean(palpation) && requestedIds.includes("dre");
  const examPending = examRequested && examStage !== "done";
  const palpationResult =
    examRequested && examStage === "done"
      ? gradePalpation(palpation, palpationAnswers)
      : null;
  const revealedByPendingExam = examPending && model.revealedBy === "dre";
  const modelRevealed =
    (requestedIds.includes(model.revealedBy) && !revealedByPendingExam) ||
    providedIds.includes(model.revealedBy);
  const showHotspot = examPending && examStage === "pending";

  // Off-screen notice: the 3D stage changed while the user could not see it.
  const [stageEl, setStageEl] = useState(null);
  const [stageVisible, setStageVisible] = useState(true);
  const [notice, setNotice] = useState(null);
  const [seenModel, setSeenModel] = useState({
    revealed: modelRevealed,
    hotspot: showHotspot,
  });

  if (
    seenModel.revealed !== modelRevealed ||
    seenModel.hotspot !== showHotspot
  ) {
    setSeenModel({ revealed: modelRevealed, hotspot: showHotspot });
    if (modelRevealed && !seenModel.revealed && !stageVisible) {
      setNotice("finding");
    } else if (showHotspot && !seenModel.hotspot && !stageVisible) {
      setNotice("exam");
    } else if (!showHotspot && notice === "exam") {
      setNotice(null);
    }
  }

  useEffect(() => {
    if (!stageEl || typeof IntersectionObserver === "undefined") return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible =
          entry.isIntersecting && entry.intersectionRatio >= STAGE_VISIBLE_RATIO;
        setStageVisible(visible);
        if (visible) setNotice(null);
      },
      { threshold: [0, STAGE_VISIBLE_RATIO, 1] }
    );
    observer.observe(stageEl);
    return () => observer.disconnect();
  }, [stageEl]);

  const showStage = () => {
    const reduceMotion = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    stageEl?.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "start",
    });
    stageEl
      ?.querySelector(".case-viewer-toolbar button")
      ?.focus({ preventScroll: true });
    setNotice(null);
  };

  const toggleTest = (testId) => {
    setSelectedTestIds((current) =>
      current.includes(testId)
        ? current.filter((id) => id !== testId)
        : [...current, testId]
    );
  };

  const requestSelectedTests = () => {
    setRequestedIds((current) => [...current, ...selectedTestIds]);
    setSelectedTestIds([]);
  };

  const requestHint = (questionId) => {
    setHintsUsed((current) => ({
      ...current,
      [questionId]: (current[questionId] ?? 0) + 1,
    }));
  };

  const answerQuestion = (questionId, optionId) => {
    setAnswers((current) => ({ ...current, [questionId]: optionId }));
  };

  const startExam = () => setExamStage("form");

  const answerPalpation = (findingId, option) => {
    setPalpationAnswers((current) => ({ ...current, [findingId]: option }));
  };

  const registerPalpation = () => {
    setExamStage("done");
    setExamBlocked(false);
  };

  const goNext = () => {
    // The requested exam is part of the step: it cannot be skipped silently.
    if (currentStep === "tests" && examPending) {
      setExamBlocked(true);
      return;
    }

    if (currentStep === "tests" && providedIds.length === 0) {
      const missing = tests
        .filter((test) => test.indicated && !requestedIds.includes(test.id))
        .map((test) => test.id);

      // Missing results are needed to answer; show them once before moving on.
      if (missing.length > 0) {
        setProvidedIds(missing);
        return;
      }
    }

    setStepIndex(stepIndex + 1);
  };

  const submitAnswers = async () => {
    const grade = gradeCase(clinicalCase, answers, requestedIds, hintsUsed);
    setResult(grade);
    setStepIndex(FEEDBACK_STEP);
    setSaveStatus("saving");

    const { error } = await onComplete({
      result: grade,
      answers: {
        questions: answers,
        requestedTests: requestedIds,
        hintsUsed,
        ...(palpationResult && { palpation: palpationAnswers }),
        patientExplanation: explanation.trim(),
      },
    });
    setSaveStatus(error ? "error" : "saved");
  };

  return (
    <article className="cases-session">
      <header className="cases-session-header">
        <button className="cases-back" onClick={onExit}>
          <ArrowLeft size={15} />
          Casos
        </button>

        <div className="cases-session-patient">
          <div className="cases-avatar">{patient.initials}</div>
          <div>
            <h2>
              {patient.name}, {patient.age} años
            </h2>
            <p>
              {clinicalCase.topic} · {clinicalCase.difficulty}
            </p>
          </div>
        </div>

        <nav className="cases-progress" aria-label="Pasos del caso">
          <p className="cases-progress-label">
            Paso {stepIndex + 1} de {steps.length} · {steps[stepIndex].label}
          </p>

          <ol className="cases-stepper">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const reachable = result ? true : index <= stepIndex;
              const state =
                index === stepIndex ? "current" : index < stepIndex ? "done" : "";

              return (
                <li key={step.id}>
                  <button
                    className={`cases-step ${state}`}
                    disabled={!reachable}
                    onClick={() => setStepIndex(index)}
                    title={step.label}
                    aria-current={index === stepIndex ? "step" : undefined}
                  >
                    <Icon size={14} />
                    <span>{step.label}</span>
                  </button>
                </li>
              );
            })}
          </ol>
        </nav>
      </header>

      <div className="cases-workspace">
        <Suspense fallback={<div className="case-viewer-loading">Cargando modelo 3D…</div>}>
          <CaseModelViewer
            model={model}
            revealed={modelRevealed}
            examActive={examPending}
            showHotspot={showHotspot}
            onPalpate={startExam}
            stageRef={setStageEl}
          />
        </Suspense>

        <div className="cases-content">
          {/* Zero-height sticky anchor: the pill floats without shifting the panel. */}
          <div className="case-viewer-notice-anchor">
            <div role="status" aria-live="polite">
              {notice && !stageVisible && (
                <button
                  type="button"
                  className="case-viewer-notice"
                  onClick={showStage}
                >
                  <ArrowUp size={15} aria-hidden="true" />
                  {NOTICE_TEXT[notice]}
                </button>
              )}
            </div>
          </div>

          <div className="cases-content-body">
            {currentStep === "patient" && <PatientStep clinicalCase={clinicalCase} />}

            {currentStep === "tests" && (
              <TestsStep
                tests={tests}
                requestedIds={requestedIds}
                providedIds={providedIds}
                locked={Boolean(result)}
                selection={selectedTestIds}
                onToggle={toggleTest}
                hiddenResultIds={examPending ? ["dre"] : []}
              >
                {examRequested && (
                  <PhysicalExam
                    palpation={palpation}
                    stage={examStage}
                    answers={palpationAnswers}
                    graded={palpationResult}
                    blocked={examBlocked}
                    onStart={startExam}
                    onAnswer={answerPalpation}
                    onSubmit={registerPalpation}
                  />
                )}
              </TestsStep>
            )}

            {currentStep === "questions" && (
              <QuestionsStep
                questions={questions}
                answers={answers}
                hintsUsed={hintsUsed}
                patientName={patient.name}
                explanation={explanation}
                locked={Boolean(result)}
                onAnswer={answerQuestion}
                onHint={requestHint}
                onExplain={setExplanation}
              />
            )}

            {currentStep === "feedback" && result && (
              <FeedbackStep
                clinicalCase={clinicalCase}
                answers={answers}
                explanation={explanation.trim()}
                result={result}
                palpationResult={palpationResult}
                saveStatus={saveStatus}
              />
            )}
          </div>

          <footer className="cases-actions">
            {stepIndex > 0 && currentStep !== "feedback" && (
              <button
                className="cases-secondary"
                onClick={() => setStepIndex(stepIndex - 1)}
              >
                <ArrowLeft size={15} />
                Anterior
              </button>
            )}

            {currentStep === "tests" && selectedTestIds.length > 0 && (
              <button className="cases-primary" onClick={requestSelectedTests}>
                <Send size={15} />
                Solicitar pruebas ({selectedTestIds.length})
              </button>
            )}

            {stepIndex < 2 &&
              !(currentStep === "tests" && selectedTestIds.length > 0) && (
              <button className="cases-primary" onClick={goNext}>
                {currentStep === "tests" &&
                requestedIds.length === 0 &&
                providedIds.length === 0
                  ? "Continuar sin pruebas"
                  : "Siguiente"}
                <ArrowRight size={15} />
              </button>
            )}

            {currentStep === "questions" && !result && (
              <button
                className="cases-primary"
                disabled={!allAnswered}
                onClick={submitAnswers}
              >
                Enviar respuestas
                <CheckCircle2 size={15} />
              </button>
            )}

            {currentStep === "questions" && result && (
              <button
                className="cases-primary"
                onClick={() => setStepIndex(FEEDBACK_STEP)}
              >
                Ver resultado
                <ArrowRight size={15} />
              </button>
            )}

            {currentStep === "feedback" && (
              <>
                <button className="cases-secondary" onClick={onRestart}>
                  <RotateCcw size={15} />
                  Nuevo paciente
                </button>
                <button className="cases-primary" onClick={onExit}>
                  Ver otros casos
                </button>
              </>
            )}
          </footer>
        </div>
      </div>

      <div className="cases-disclaimer">
        <AlertTriangle size={14} />
        Caso ficticio con fines educativos. El modelo 3D y la ubicación de los
        hallazgos son ilustrativos. No sustituye la valoración ni el diagnóstico
        médico.
      </div>
    </article>
  );
}
