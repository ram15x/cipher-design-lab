export type ProblemDifficulty =
  | "BEGINNER"
  | "INTERMEDIATE";

export interface Problem {
  id: string;

  slug: string;

  title: string;

  difficulty: ProblemDifficulty;

  brief: string;

  requirements: string[];

  constraints: string[];

  changeScenarios: string[];

  createdAt: Date;

  updatedAt: Date;
}