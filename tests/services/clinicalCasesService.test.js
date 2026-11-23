import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../../src/services/supabase", async () => {
  const { createFakeSupabase } = await import("../helpers/fakeSupabase");
  return { supabase: createFakeSupabase() };
});

import { supabase } from "../../src/services/supabase";
import { getCaseAttempts, saveCaseAttempt } from "../../src/services/clinicalCasesService";

beforeEach(() => vi.clearAllMocks());

describe("clinicalCasesService", () => {
  it("saves an attempt with the student, case, score and answers", async () => {
    const answers = { questions: { q1: "a" }, seed: 42 };

    await saveCaseAttempt({
      userId: "user-1",
      caseId: "ernesto-hpb",
      result: { score: 85, correct: 3, total: 4 },
      answers,
    });

    expect(supabase.from).toHaveBeenCalledWith("clinical_case_attempts");
    expect(supabase.query.insert).toHaveBeenCalledWith({
      user_id: "user-1",
      case_id: "ernesto-hpb",
      score: 85,
      correct_answers: 3,
      total_questions: 4,
      answers,
    });
  });

  it("returns the error when the attempt cannot be saved", async () => {
    supabase.query.insert.mockResolvedValueOnce({ data: null, error: { message: "relation does not exist" } });

    const { error } = await saveCaseAttempt({
      userId: "user-1",
      caseId: "ernesto-hpb",
      result: { score: 0, correct: 0, total: 4 },
      answers: {},
    });

    expect(error.message).toBe("relation does not exist");
  });

  it("reads only the student's attempts, newest first", async () => {
    const rows = [{ id: "a1", case_id: "ernesto-hpb", score: 90 }];
    supabase.query.order.mockResolvedValueOnce({ data: rows, error: null });

    const { data } = await getCaseAttempts("user-1");

    expect(supabase.from).toHaveBeenCalledWith("clinical_case_attempts");
    expect(supabase.query.eq).toHaveBeenCalledWith("user_id", "user-1");
    expect(supabase.query.order).toHaveBeenCalledWith("completed_at", { ascending: false });
    expect(data).toEqual(rows);
  });
});
