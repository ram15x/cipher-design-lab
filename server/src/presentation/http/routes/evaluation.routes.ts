import {
  Router,
} from "express";

import type {
  EvaluationService,
} from "../../../application/evaluation/EvaluationService.js";

import type {
  AttemptService,
} from "../../../application/attempt/AttemptService.js";

import type {
  EvaluationDispatcher,
} from "../../../application/evaluation/EvaluationDispatcher.js";

export function createEvaluationRouter(
  evaluationService:
    EvaluationService,

  attemptService:
    AttemptService,

  evaluationDispatcher:
    EvaluationDispatcher
) {
  const router =
    Router();

  /*
   * Get latest evaluation
   *
   * GET
   * /api/attempts/:attemptId/evaluation
   */
  router.get(
    "/attempts/:attemptId/evaluation",

    async (
      request,
      response,
      next
    ) => {
      try {
        const attemptId =
          String(
            request.params
              .attemptId
          );

        const evaluation =
          await evaluationService
            .getLatestEvaluation(
              attemptId
            );

        response.json({
          success: true,
          data: evaluation,
        });
      } catch (error) {
        next(error);
      }
    }
  );

  /*
   * Retry failed evaluation
   *
   * POST
   * /api/attempts/:attemptId/evaluation/retry
   */
  router.post(
    "/attempts/:attemptId/evaluation/retry",

    async (
      request,
      response,
      next
    ) => {
      try {
        const attemptId =
          String(
            request.params
              .attemptId
          );

        /*
         * FAILED -> SUBMITTED
         */
        const attempt =
          await attemptService
            .prepareEvaluationRetry(
              attemptId
            );

        /*
         * Return immediately.
         */
        response
          .status(202)
          .json({
            success: true,

            message:
              "Evaluation retry accepted",

            data:
              attempt,
          });

        /*
         * Async:
         *
         * SUBMITTED
         * -> EVALUATING
         * -> COMPLETED / FAILED
         */
        evaluationDispatcher
          .dispatch(
            attemptId
          );
      } catch (error) {
        next(error);
      }
    }
  );

  return router;
}