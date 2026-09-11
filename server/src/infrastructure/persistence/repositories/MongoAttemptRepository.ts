import {
  Attempt,
  type AttemptProps,
} from "../../../domain/attempt/Attempt.js";

import type { AttemptRepository } from "../../../domain/attempt/AttemptRepository.js";

import { AttemptModel } from "../models/AttemptModel.js";

function toDomain(
  document: any
) {
  const props: AttemptProps = {
    id:
      document.attemptId,

    learnerId:
      document.learnerId,

    problemId:
      document.problemId,

    problemSlug:
      document.problemSlug,

    attemptNumber:
      document.attemptNumber,

    status:
      document.status,

    submission:
      document.submission,

    previousAttemptId:
      document.previousAttemptId ??
      null,

    submittedAt:
      document.submittedAt ??
      null,

    createdAt:
      document.createdAt,

    updatedAt:
      document.updatedAt,
  };

  return Attempt.restore(
    props
  );
}

export class MongoAttemptRepository
  implements AttemptRepository
{
  async save(
    attempt: Attempt
  ): Promise<void> {
    const data =
      attempt.toObject();

    await AttemptModel.updateOne(
      {
        attemptId:
          data.id,
      },

      {
        $set: {
          learnerId:
            data.learnerId,

          problemId:
            data.problemId,

          problemSlug:
            data.problemSlug,

          attemptNumber:
            data.attemptNumber,

          status:
            data.status,

          submission:
            data.submission,

          previousAttemptId:
            data.previousAttemptId,

          submittedAt:
            data.submittedAt,
        },
      },

      {
        upsert: true,
      }
    );
  }

  async findById(
    attemptId: string
  ): Promise<Attempt | null> {
    const document =
      await AttemptModel.findOne({
        attemptId,
      }).lean();

    if (!document) {
      return null;
    }

    return toDomain(
      document
    );
  }

  async countForLearnerAndProblem(
    learnerId: string,
    problemId: string
  ): Promise<number> {
    return AttemptModel.countDocuments({
      learnerId,
      problemId,
    });
  }

  async findForLearner(
    learnerId: string
  ): Promise<Attempt[]> {
    const documents =
      await AttemptModel.find({
        learnerId,
      })
        .sort({
          createdAt: -1,
        })
        .lean();

    return documents.map(
      toDomain
    );
  }
}