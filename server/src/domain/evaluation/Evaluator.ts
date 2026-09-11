import type {
  Problem,
} from "../problem/Problem.js";

import type {
  StructuredSubmission,
} from "../attempt/Attempt.js";

import type {
  EvaluationResult,
} from "./Evaluation.js";

export interface EvaluationContext {
  attemptId: string;

  problem: Problem;

  submission:
    StructuredSubmission;
}

export interface Evaluator {
  readonly key: string;

  evaluate(
    context: EvaluationContext
  ): Promise<EvaluationResult>;
}