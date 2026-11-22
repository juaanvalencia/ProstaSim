import { Suspense, lazy, useState } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
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
import { gradeCase } from "../logic/scoring";

const steps = [
  { id: "patient", label: "Paciente", icon: User },
  { id: "tests", label: "Pruebas", icon: FlaskConical },
  { id: "questions", label: "Preguntas", icon: ClipboardList },
  { id: "feedback", label: "Retroalimentación", icon: Lightbulb },
];

const FEEDBACK_STEP = 3;

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

  const { patient, questions, tests, model } = clinicalCase;
  const currentStep = steps[stepIndex].id;
  const allAnswered = questions.every((question) => answers[question.id]);
  const modelRevealed =
    requestedIds.includes(model.revealedBy) || providedIds.includes(model.revealedBy);

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

  const goNext = () => {
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
            <p>{clinicalCase.topic}</p>
          </div>
        </div>

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
                >
                  <Icon size={15} />
                  <span>{step.label}</span>
                </button>
              </li>
            );
          })}
        </ol>
      </header>

      <div className="cases-workspace">
        <Suspense fallback={<div className="case-viewer-loading">Cargando modelo 3D…</div>}>
          <CaseModelViewer model={model} revealed={modelRevealed} />
        </Suspense>

        <div className="cases-content">
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
              />
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
