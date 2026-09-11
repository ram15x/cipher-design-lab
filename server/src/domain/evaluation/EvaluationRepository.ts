import type {
  Evaluation,
} from "./Evaluation.js";

export interface EvaluationRepository {
  save(
    evaluation: Evaluation
  ): Promise<void>;

  findLatestForAttempt(
    attemptId: string
  ): Promise<Evaluation | null>;
}