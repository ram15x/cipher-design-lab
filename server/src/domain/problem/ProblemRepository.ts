import type { Problem } from "./Problem.js";

export interface ProblemRepository {
  findAll(): Promise<Problem[]>;

  findBySlug(
    slug: string
  ): Promise<Problem | null>;
}