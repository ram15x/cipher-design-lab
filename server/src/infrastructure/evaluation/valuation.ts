import { randomUUID } from "node:crypto";

export type EvaluationStatus =
  | "PENDING"
  | "RUNNING"
  | "COMPLETED"
  | "FAILED";

export type FeedbackConfidence =
  | "LOW"
  | "MEDIUM"
  | "HIGH";

export type RuleSeverity =
  | "INFO"
  | "WARNING"
  | "ERROR";

export interface CriterionFeedback {
  criterion: string;

  score: number;

  maxScore: number;

  evidenceRefs: string[];

  evidence: string;

  concern: string;

  suggestion: string;

  confidence: FeedbackConfidence;
}

export interface RuleFinding {
  code: string;

  severity: RuleSeverity;

  message: string;

  evidenceRefs: string[];
}

export interface EvaluationResult {
  overallScore: number | null;

  criteria: CriterionFeedback[];

  ruleFindings: RuleFinding[];
}

export interface EvaluationProps {
  id: string;

  attemptId: string;

  evaluatorKey: string;

  status: EvaluationStatus;

  result: EvaluationResult | null;

  errorMessage: string | null;

  startedAt: Date | null;

  completedAt: Date | null;

  createdAt: Date;

  updatedAt: Date;
}

export class Evaluation {
  private constructor(
    private readonly props: EvaluationProps
  ) {}

  static create(input: {
    attemptId: string;
    evaluatorKey: string;
  }) {
    const now = new Date();

    return new Evaluation({
      id: randomUUID(),

      attemptId:
        input.attemptId,

      evaluatorKey:
        input.evaluatorKey,

      status: "PENDING",

      result: null,

      errorMessage: null,

      startedAt: null,

      completedAt: null,

      createdAt: now,

      updatedAt: now,
    });
  }

  static restore(
    props: EvaluationProps
  ) {
    return new Evaluation(props);
  }

  get id() {
    return this.props.id;
  }

  get attemptId() {
    return this.props.attemptId;
  }

  get status() {
    return this.props.status;
  }

  start() {
    if (
      this.props.status !==
      "PENDING"
    ) {
      const error =
        new Error(
          "Only a pending evaluation can start"
        );

      error.name =
        "InvalidEvaluationStateError";

      throw error;
    }

    this.props.status =
      "RUNNING";

    this.props.startedAt =
      new Date();

    this.props.updatedAt =
      new Date();
  }

  complete(
    result: EvaluationResult
  ) {
    if (
      this.props.status !==
      "RUNNING"
    ) {
      const error =
        new Error(
          "Only a running evaluation can complete"
        );

      error.name =
        "InvalidEvaluationStateError";

      throw error;
    }

    this.props.status =
      "COMPLETED";

    this.props.result =
      result;

    this.props.errorMessage =
      null;

    this.props.completedAt =
      new Date();

    this.props.updatedAt =
      new Date();
  }

  fail(
    message: string
  ) {
    if (
      this.props.status !==
      "RUNNING"
    ) {
      const error =
        new Error(
          "Only a running evaluation can fail"
        );

      error.name =
        "InvalidEvaluationStateError";

      throw error;
    }

    this.props.status =
      "FAILED";

    this.props.errorMessage =
      message;

    this.props.completedAt =
      new Date();

    this.props.updatedAt =
      new Date();
  }

  toObject(): EvaluationProps {
    return {
      ...this.props,

      result:
        this.props.result
          ? {
              overallScore:
                this.props.result
                  .overallScore,

              criteria:
                this.props.result
                  .criteria
                  .map(
                    (criterion) => ({
                      ...criterion,

                      evidenceRefs: [
                        ...criterion
                          .evidenceRefs,
                      ],
                    })
                  ),

              ruleFindings:
                this.props.result
                  .ruleFindings
                  .map(
                    (finding) => ({
                      ...finding,

                      evidenceRefs: [
                        ...finding
                          .evidenceRefs,
                      ],
                    })
                  ),
            }
          : null,
    };
  }
}