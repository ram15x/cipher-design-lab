import type { ProblemRepository } from "../../domain/problem/ProblemRepository.js";

export class ProblemService {
  constructor(
    private readonly problemRepository: ProblemRepository
  ) {}

  async listProblems() {
    return this.problemRepository.findAll();
  }

  async getProblem(slug: string) {
    const problem =
      await this.problemRepository.findBySlug(slug);

    if (!problem) {
      const error = new Error(
        `Problem '${slug}' was not found`
      );

      error.name = "NotFoundError";

      throw error;
    }

    return problem;
  }
}