import {
  Evaluation,
  type EvaluationProps,
} from "../../../domain/evaluation/Evaluation.js";

import type {
  EvaluationRepository,
} from "../../../domain/evaluation/EvaluationRepository.js";

import {
  EvaluationModel,
} from "../models/EvaluationModel.js";

function toDomain(
  document: any
) {
  const props: EvaluationProps = {
    id:
      document.evaluationId,

    attemptId:
      document.attemptId,

    evaluatorKey:
      document.evaluatorKey,

    status:
      document.status,

    result:
      document.result ?? null,

    errorMessage:
      document.errorMessage ??
      null,

    startedAt:
      document.startedAt ??
      null,

    completedAt:
      document.completedAt ??
      null,

    createdAt:
      document.createdAt,

    updatedAt:
      document.updatedAt,
  };

  return Evaluation.restore(
    props
  );
}

export class MongoEvaluationRepository
  implements EvaluationRepository
{
  async save(
    evaluation: Evaluation
  ): Promise<void> {
    const data =
      evaluation.toObject();

    await EvaluationModel.updateOne(
      {
        evaluationId:
          data.id,
      },

      {
        $set: {
          attemptId:
            data.attemptId,

          evaluatorKey:
            data.evaluatorKey,

          status:
            data.status,

          result:
            data.result,

          errorMessage:
            data.errorMessage,

          startedAt:
            data.startedAt,

          completedAt:
            data.completedAt,
        },
      },

      {
        upsert: true,
      }
    );
  }

  async findLatestForAttempt(
    attemptId: string
  ): Promise<Evaluation | null> {
    const document =
      await EvaluationModel
        .findOne({
          attemptId,
        })
        .sort({
          createdAt: -1,
        })
        .lean();

    if (!document) {
      return null;
    }

    return toDomain(
      document
    );
  }
}