import type {
  AttemptRepository,
} from "../../domain/attempt/AttemptRepository.js";

import type {
  ProblemRepository,
} from "../../domain/problem/ProblemRepository.js";

import type {
  EvaluationRepository,
} from "../../domain/evaluation/EvaluationRepository.js";

import type {
  Evaluator,
} from "../../domain/evaluation/Evaluator.js";

import {
  Evaluation,
} from "../../domain/evaluation/Evaluation.js";

export class EvaluationService {
  constructor(
    private readonly attemptRepository:
      AttemptRepository,

    private readonly problemRepository:
      ProblemRepository,

    private readonly evaluationRepository:
      EvaluationRepository,

    private readonly evaluator:
      Evaluator
  ) {}

  async evaluateAttempt(
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

    const problem =
      await this.problemRepository
        .findBySlug(
          attempt.problemSlug
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
     * State:
     *
     * SUBMITTED -> EVALUATING
     */

    attempt.markEvaluating();

    await this.attemptRepository.save(
      attempt
    );

    const evaluation =
      Evaluation.create({
        attemptId:
          attempt.id,

        evaluatorKey:
          this.evaluator.key,
      });

    await this
      .evaluationRepository
      .save(
        evaluation
      );

    evaluation.start();

    await this
      .evaluationRepository
      .save(
        evaluation
      );

    try {
      const attemptData =
        attempt.toObject();

      const result =
        await this.evaluator
          .evaluate({
            attemptId:
              attempt.id,

            problem,

            submission:
              attemptData.submission,
          });

      evaluation.complete(
        result
      );

      attempt.markCompleted();

      await Promise.all([
        this.evaluationRepository
          .save(
            evaluation
          ),

        this.attemptRepository
          .save(
            attempt
          ),
      ]);

      return evaluation.toObject();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Evaluation failed";

      evaluation.fail(
        message
      );

      attempt.markFailed();

      await Promise.all([
        this.evaluationRepository
          .save(
            evaluation
          ),

        this.attemptRepository
          .save(
            attempt
          ),
      ]);

      throw error;
    }
  }

  async getLatestEvaluation(
    attemptId: string
  ) {
    const evaluation =
      await this
        .evaluationRepository
        .findLatestForAttempt(
          attemptId
        );

    if (!evaluation) {
      const error =
        new Error(
          "Evaluation not found"
        );

      error.name =
        "NotFoundError";

      throw error;
    }

    return evaluation.toObject();
  }
}