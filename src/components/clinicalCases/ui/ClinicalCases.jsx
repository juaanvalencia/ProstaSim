import { useEffect, useMemo, useState } from "react";
import { ChevronRight, Clock, Stethoscope, Trophy } from "lucide-react";

import { useAuth } from "../../../context/AuthContext";
import {
  getCaseAttempts,
  saveCaseAttempt,
} from "../../../services/clinicalCasesService";
import { caseTemplates } from "../data/casesData";
import { buildCaseVariant, createSeed } from "../logic/caseVariants";
import { summarizeAttempts } from "../logic/scoring";
import CaseSession from "./CaseSession";
import "./ClinicalCases.css";

export default function ClinicalCases() {
  const { user } = useAuth();
  const [selectedCaseId, setSelectedCaseId] = useState(null);
  const [attemptSummary, setAttemptSummary] = useState({});
  const [attemptsVersion, setAttemptsVersion] = useState(0);
  const [seeds, setSeeds] = useState(() =>
    Object.fromEntries(caseTemplates.map((template) => [template.id, createSeed()]))
  );

  const clinicalCases = useMemo(
    () => caseTemplates.map((template) => buildCaseVariant(template, seeds[template.id])),
    [seeds]
  );

  // A new seed gives the next attempt a different patient variant.
  const renewSeed = (caseId) => {
    setSeeds((current) => ({ ...current, [caseId]: createSeed() }));
  };

  const exitCase = () => {
    renewSeed(selectedCaseId);
    setSelectedCaseId(null);
  };

  useEffect(() => {
    if (!user) return undefined;

    let ignore = false;

    getCaseAttempts(user.id).then(({ data, error }) => {
      if (ignore) return;

      if (error) {
        console.error("Error al consultar intentos:", error.message);
        return;
      }

      setAttemptSummary(summarizeAttempts(data ?? []));
    });

    return () => {
      ignore = true;
    };
  }, [user, attemptsVersion]);

  const selectedCase = clinicalCases.find(
    (clinicalCase) => clinicalCase.id === selectedCaseId
  );

  const handleComplete = async ({ result, answers }) => {
    try {
      const { error } = await saveCaseAttempt({
        userId: user.id,
        caseId: selectedCase.id,
        result,
        answers: { ...answers, seed: selectedCase.seed },
      });

      if (error) {
        console.error("Error al guardar intento:", error.message);
        return { error };
      }

      setAttemptsVersion((version) => version + 1);
      return { error: null };
    } catch (error) {
      console.error("Error al guardar intento:", error);
      return { error };
    }
  };

  if (selectedCase) {
    return (
      <section className="cases-container">
        <CaseSession
          key={`${selectedCase.id}-${selectedCase.seed}`}
          clinicalCase={selectedCase}
          onExit={exitCase}
          onRestart={() => renewSeed(selectedCase.id)}
          onComplete={handleComplete}
        />
      </section>
    );
  }

  const completedCount = Object.keys(attemptSummary).length;

  return (
    <section className="cases-container">
      <header className="cases-header">
        <div>
          <span className="cases-eyebrow">Simulación clínica</span>
          <h2>Casos clínicos</h2>
          <p>
            Atiende pacientes ficticios: examina, pide las pruebas necesarias,
            observa los hallazgos en 3D y decide.
          </p>
        </div>

        <div className="cases-summary">
          <Stethoscope size={18} />
          <span>
            <strong>
              {completedCount} de {clinicalCases.length}
            </strong>{" "}
            casos resueltos
          </span>
        </div>
      </header>

      <div className="cases-cards">
        {clinicalCases.map((clinicalCase, index) => {
          const summary = attemptSummary[clinicalCase.id];
          const progress = summary ? summary.bestScore : 0;

          return (
            <button
              key={clinicalCase.id}
              className="cases-card"
              style={{ "--case-color": `var(--m${(index % 4) + 1})` }}
              onClick={() => setSelectedCaseId(clinicalCase.id)}
            >
              <div className="cases-card-top">
                <span className="cases-card-number">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="cases-chip">
                  {summary ? "Completado" : "Sin iniciar"}
                </span>
              </div>

              <div className="cases-card-body">
                <span className="cases-card-topic">{clinicalCase.topic}</span>
                <h3>
                  {clinicalCase.patient.name}, {clinicalCase.patient.age} años
                </h3>
                <p className="cases-card-reason">“{clinicalCase.reason}”</p>
              </div>

              <div className="cases-card-meta">
                <span>{clinicalCase.difficulty}</span>
                <span>
                  <Clock size={13} />
                  {clinicalCase.duration}
                </span>
                {summary && (
                  <span className="cases-card-score">
                    <Trophy size={13} />
                    Mejor: {summary.bestScore}% · {summary.count}{" "}
                    {summary.count === 1 ? "intento" : "intentos"}
                  </span>
                )}
              </div>

              <div className="cases-card-footer">
                <span className="cases-card-progress" aria-hidden="true">
                  <span style={{ width: `${progress}%` }} />
                </span>
                <span className="cases-card-cta">
                  {summary ? "Repetir caso" : "Iniciar caso"}
                  <ChevronRight size={15} />
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
