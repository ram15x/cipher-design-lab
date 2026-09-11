import type {
  ProblemRepository,
} from "../../domain/problem/ProblemRepository.js";

import {
  Attempt,
  type StructuredSubmission,
} from "../../domain/attempt/Attempt.js";

import type {
  AttemptRepository,
} from "../../domain/attempt/AttemptRepository.js";

export class AttemptService {
  constructor(
    private readonly attemptRepository:
      AttemptRepository,

    private readonly problemRepository:
      ProblemRepository
  ) {}

  /*
   * Start a new learner attempt.
   */

  async startAttempt(input: {
    learnerId: string;

    problemSlug: string;

    previousAttemptId?:
      string | null;
  }) {
    const problem =
      await this.problemRepository
        .findBySlug(
          input.problemSlug
        );

    if (!problem) {
      const error =
        new Error(
          "Problem not found"
        );

      error.name =
        "NotFoundError";

      throw error;
    }

    /*
     * Determine the learner's next
     * attempt number for this problem.
     */

    const existingCount =
      await this.attemptRepository
        .countForLearnerAndProblem(
          input.learnerId,
          problem.id
        );

    const attempt =
      Attempt.start({
        learnerId:
          input.learnerId,

        problemId:
          problem.id,

        problemSlug:
          problem.slug,

        attemptNumber:
          existingCount + 1,

        previousAttemptId:
          input.previousAttemptId,
      });

    await this.attemptRepository
      .save(
        attempt
      );

    return attempt.toObject();
  }

  /*
   * Retrieve one attempt.
   */

  async getAttempt(
    attemptId: string
  ) {
    const attempt =
      await this.getRequiredAttempt(
        attemptId
      );

    return attempt.toObject();
  }

  /*
   * Save/update a DRAFT submission.
   */

  async updateDraft(
    attemptId: string,

    submission:
      StructuredSubmission
  ) {
    const attempt =
      await this.getRequiredAttempt(
        attemptId
      );

    attempt.updateDraft(
      submission
    );

    await this.attemptRepository
      .save(
        attempt
      );

    return attempt.toObject();
  }

  /*
   * Submit the learner design.
   *
   * Important:
   *
   * The SUBMITTED state is persisted
   * BEFORE async evaluation begins.
   *
   * This means the learner's submission
   * is safe even if the AI provider fails.
   */

  async submitAttempt(
    attemptId: string
  ) {
    const attempt =
      await this.getRequiredAttempt(
        attemptId
      );

    attempt.submit();

    await this.attemptRepository
      .save(
        attempt
      );

    return attempt.toObject();
  }

  /*
   * Prepare a FAILED attempt
   * for evaluation retry.
   *
   * FAILED -> SUBMITTED
   *
   * The dispatcher/EvaluationService
   * will then continue:
   *
   * SUBMITTED
   *    ->
   * EVALUATING
   *    ->
   * COMPLETED / FAILED
   */

  async prepareEvaluationRetry(
    attemptId: string
  ) {
    const attempt =
      await this.getRequiredAttempt(
        attemptId
      );

    attempt.retryEvaluation();

    await this.attemptRepository
      .save(
        attempt
      );

    return attempt.toObject();
  }

  /*
   * Retrieve history for a learner.
   */

  async getLearnerHistory(
    learnerId: string
  ) {
    const attempts =
      await this.attemptRepository
        .findForLearner(
          learnerId
        );

    return attempts.map(
      (attempt) =>
        attempt.toObject()
    );
  }

  /*
   * Shared resource lookup.
   *
   * Application methods should not
   * repeatedly implement their own
   * Attempt-not-found logic.
   */

  private async getRequiredAttempt(
    attemptId: string
  ) {
    const attempt =
      await this.attemptRepository
        .findById(
          attemptId
        );

    if (!attempt) {
      const error =
        new Error(
          "Attempt not found"
        );

      error.name =
        "NotFoundError";

      throw error;
    }

    return attempt;
  }
}