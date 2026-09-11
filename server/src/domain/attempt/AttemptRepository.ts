import type { Attempt } from "./Attempt.js";

export interface AttemptRepository {
  save(
    attempt: Attempt
  ): Promise<void>;

  findById(
    attemptId: string
  ): Promise<Attempt | null>;

  countForLearnerAndProblem(
    learnerId: string,
    problemId: string
  ): Promise<number>;

  findForLearner(
    learnerId: string
  ): Promise<Attempt[]>;
}