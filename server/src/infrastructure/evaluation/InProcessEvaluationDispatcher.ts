import type {
  EvaluationDispatcher,
} from "../../application/evaluation/EvaluationDispatcher.js";

import type {
  EvaluationService,
} from "../../application/evaluation/EvaluationService.js";

export class InProcessEvaluationDispatcher
  implements EvaluationDispatcher
{
  constructor(
    private readonly evaluationService:
      EvaluationService
  ) {}

  dispatch(
    attemptId: string
  ): void {
    setImmediate(
      async () => {
        try {
          await this
            .evaluationService
            .evaluateAttempt(
              attemptId
            );
        } catch (error) {
          console.error(
            `Evaluation failed for attempt ${attemptId}:`,
            error
          );
        }
      }
    );
  }
}