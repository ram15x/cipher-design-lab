import type { Problem } from "../../../domain/problem/Problem.js";

import type { ProblemRepository } from "../../../domain/problem/ProblemRepository.js";

import { ProblemModel } from "../models/ProblemModel.js";

export class MongoProblemRepository
  implements ProblemRepository
{
  async findAll(): Promise<Problem[]> {
    const documents =
      await ProblemModel.find()
        .sort({
          difficulty: 1,
          title: 1,
        })
        .lean();

    return documents.map((document) => ({
      id: document._id.toString(),

      slug: document.slug,

      title: document.title,

      difficulty:
        document.difficulty,

      brief: document.brief,

      requirements:
        document.requirements,

      constraints:
        document.constraints,

      changeScenarios:
        document.changeScenarios,

      createdAt:
        document.createdAt,

      updatedAt:
        document.updatedAt,
    }));
  }

  async findBySlug(
    slug: string
  ): Promise<Problem | null> {
    const document =
      await ProblemModel.findOne({
        slug,
      }).lean();

    if (!document) {
      return null;
    }

    return {
      id: document._id.toString(),

      slug: document.slug,

      title: document.title,

      difficulty:
        document.difficulty,

      brief: document.brief,

      requirements:
        document.requirements,

      constraints:
        document.constraints,

      changeScenarios:
        document.changeScenarios,

      createdAt:
        document.createdAt,

      updatedAt:
        document.updatedAt,
    };
  }
}