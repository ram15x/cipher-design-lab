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
  createdAt: string;
  updatedAt: string;
}

export interface DesignClass {
  name: string;
  responsibility: string;
}

export interface DesignInterface {
  name: string;
  purpose: string;
  methods: string[];
}

export interface DesignRelationship {
  from: string;
  to: string;

  type:
    | "ASSOCIATION"
    | "COMPOSITION"
    | "AGGREGATION"
    | "INHERITANCE"
    | "DEPENDENCY";

  description: string;
}

export interface StructuredSubmission {
  requirementUnderstanding: string;
  assumptions: string[];
  classes: DesignClass[];
  interfaces: DesignInterface[];
  relationships: DesignRelationship[];
  tradeOffs: string[];
  edgeCases: string[];
}

export type AttemptStatus =
  | "DRAFT"
  | "SUBMITTED"
  | "EVALUATING"
  | "COMPLETED"
  | "FAILED";

export interface Attempt {
  id: string;
  learnerId: string;
  problemId: string;
  problemSlug: string;
  attemptNumber: number;
  status: AttemptStatus;
  submission: StructuredSubmission;
  previousAttemptId: string | null;
  submittedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface EvaluationCriterion {
  criterion: string;

  score: number;

  maxScore: number;

  evidenceRefs: string[];

  evidence: string;

  concern: string;

  suggestion: string;

  confidence:
    | "LOW"
    | "MEDIUM"
    | "HIGH";
}

export interface RuleFinding {
  code: string;

  message: string;

  severity?: string;
}

export interface EvaluationResult {
  overallScore:
    number | null;

  criteria:
    EvaluationCriterion[];

  ruleFindings:
    RuleFinding[];
}

export type EvaluationStatus =
  | "PENDING"
  | "RUNNING"
  | "COMPLETED"
  | "FAILED";

export interface Evaluation {
  id: string;

  attemptId: string;

  evaluatorKey: string;

  status:
    EvaluationStatus;

  result:
    EvaluationResult | null;

  errorMessage:
    string | null;

  startedAt:
    string | null;

  completedAt:
    string | null;

  createdAt:
    string;

  updatedAt:
    string;
}

interface ApiResponse<T> {
  success: boolean;

  data: T;

  count?: number;

  error?: {
    code?: string;

    message?: string;

    details?: unknown;
  };
}

const API_BASE_URL =
  import.meta.env
    .VITE_API_BASE_URL ??
  "http://localhost:4000/api";

async function request<T>(
  path: string,

  options?: RequestInit
): Promise<T> {
  const response =
    await fetch(
      `${API_BASE_URL}${path}`,
      {
        ...options,

        headers: {
          "Content-Type":
            "application/json",

          ...options?.headers,
        },
      }
    );

  let body:
    ApiResponse<T>;

  try {
    body =
      (await response.json()) as
        ApiResponse<T>;
  } catch {
    throw new Error(
      `API returned an invalid response with status ${response.status}`
    );
  }

  if (
    !response.ok ||
    !body.success
  ) {
    throw new Error(
      body.error?.message ??
        `Request failed with status ${response.status}`
    );
  }

  return body.data;
}

export const api = {
  /*
   * Problem library
   */

  getProblems() {
    return request<
      Problem[]
    >(
      "/problems"
    );
  },

  getProblem(
    slug: string
  ) {
    return request<
      Problem
    >(
      `/problems/${slug}`
    );
  },

  /*
   * Attempt lifecycle
   */

  startAttempt(
    problemSlug: string,

    learnerId: string,

    previousAttemptId?:
      string | null
  ) {
    return request<
      Attempt
    >(
      `/problems/${problemSlug}/attempts`,
      {
        method:
          "POST",

        body:
          JSON.stringify({
            learnerId,

            previousAttemptId:
              previousAttemptId ??
              null,
          }),
      }
    );
  },

  getAttempt(
    attemptId: string
  ) {
    return request<
      Attempt
    >(
      `/attempts/${attemptId}`
    );
  },

  /*
   * Learner history
   */

  getLearnerAttempts(
    learnerId: string
  ) {
    return request<
      Attempt[]
    >(
      `/learners/${learnerId}/attempts`
    );
  },

  /*
   * Draft + submit
   */

  saveDraft(
    attemptId: string,

    submission:
      StructuredSubmission
  ) {
    return request<
      Attempt
    >(
      `/attempts/${attemptId}/draft`,
      {
        method:
          "PATCH",

        body:
          JSON.stringify(
            submission
          ),
      }
    );
  },

  submitAttempt(
    attemptId: string
  ) {
    return request<
      Attempt
    >(
      `/attempts/${attemptId}/submit`,
      {
        method:
          "POST",
      }
    );
  },

  /*
   * Evaluation
   */

  getEvaluation(
    attemptId: string
  ) {
    return request<
      Evaluation
    >(
      `/attempts/${attemptId}/evaluation`
    );
  },

  retryEvaluation(
    attemptId: string
  ) {
    return request<
      Attempt
    >(
      `/attempts/${attemptId}/evaluation/retry`,
      {
        method:
          "POST",
      }
    );
  },
};