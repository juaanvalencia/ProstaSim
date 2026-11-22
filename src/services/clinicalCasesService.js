import { supabase } from "./supabase";

const TABLE = "clinical_case_attempts";

export async function saveCaseAttempt({ userId, caseId, result, answers }) {
  return await supabase.from(TABLE).insert({
    user_id: userId,
    case_id: caseId,
    score: result.score,
    correct_answers: result.correct,
    total_questions: result.total,
    answers,
  });
}

export async function getCaseAttempts(userId) {
  return await supabase
    .from(TABLE)
    .select("id, case_id, score, correct_answers, total_questions, completed_at")
    .eq("user_id", userId)
    .order("completed_at", { ascending: false });
}
