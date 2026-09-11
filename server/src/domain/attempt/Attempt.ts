import { randomUUID } from "node:crypto";

export type AttemptStatus =
  | "DRAFT"
  | "SUBMITTED"
  | "EVALUATING"
  | "COMPLETED"
  | "FAILED";

export interface DesignClass {
  name: string;
  responsibility: string;
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

export interface DesignInterface {
  name: string;
  purpose: string;
  methods: string[];
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

export interface AttemptProps {
  id: string;

  learnerId: string;

  problemId: string;

  problemSlug: string;

  attemptNumber: number;

  status: AttemptStatus;

  submission: StructuredSubmission;

  previousAttemptId: string | null;

  submittedAt: Date | null;

  createdAt: Date;

  updatedAt: Date;
}

export class Attempt {
  private constructor(
    private readonly props: AttemptProps
  ) {}

  /*
   * Create a brand-new learner attempt.
   */
  static start(input: {
    learnerId: string;
    problemId: string;
    problemSlug: string;
    attemptNumber: number;
    previousAttemptId?: string | null;
  }) {
    const now = new Date();

    return new Attempt({
      id: randomUUID(),

      learnerId:
        input.learnerId,

      problemId:
        input.problemId,

      problemSlug:
        input.problemSlug,

      attemptNumber:
        input.attemptNumber,

      status:
        "DRAFT",

      submission: {
        requirementUnderstanding:
          "",

        assumptions:
          [],

        classes:
          [],

        interfaces:
          [],

        relationships:
          [],

        tradeOffs:
          [],

        edgeCases:
          [],
      },

      previousAttemptId:
        input.previousAttemptId ??
        null,

      submittedAt:
        null,

      createdAt:
        now,

      updatedAt:
        now,
    });
  }

  /*
   * Rebuild an Attempt domain object
   * from persisted database state.
   */
  static restore(
    props: AttemptProps
  ) {
    return new Attempt(
      props
    );
  }

  /*
   * Read-only domain accessors.
   */

  get id() {
    return this.props.id;
  }

  get learnerId() {
    return this.props.learnerId;
  }

  get problemId() {
    return this.props.problemId;
  }

  get problemSlug() {
    return this.props.problemSlug;
  }

  get attemptNumber() {
    return this.props.attemptNumber;
  }

  get status() {
    return this.props.status;
  }

  /*
   * Draft editing
   */

  updateDraft(
    submission:
      StructuredSubmission
  ) {
    if (
      this.props.status !==
      "DRAFT"
    ) {
      const error =
        new Error(
          "Only a draft attempt can be edited"
        );

      error.name =
        "InvalidAttemptStateError";

      throw error;
    }

    this.props.submission =
      submission;

    this.props.updatedAt =
      new Date();
  }

  /*
   * DRAFT -> SUBMITTED
   */

  submit() {
    if (
      this.props.status !==
      "DRAFT"
    ) {
      const error =
        new Error(
          "Only a draft attempt can be submitted"
        );

      error.name =
        "InvalidAttemptStateError";

      throw error;
    }

    /*
     * Domain-level validation:
     * the draft may exist while incomplete,
     * but it must contain meaningful design
     * evidence before submission.
     */
    this.validateMeaningfulSubmission();

    this.props.status =
      "SUBMITTED";

    this.props.submittedAt =
      new Date();

    this.props.updatedAt =
      new Date();
  }

  /*
   * SUBMITTED -> EVALUATING
   */

  markEvaluating() {
    if (
      this.props.status !==
      "SUBMITTED"
    ) {
      const error =
        new Error(
          "Only a submitted attempt can begin evaluation"
        );

      error.name =
        "InvalidAttemptStateError";

      throw error;
    }

    this.props.status =
      "EVALUATING";

    this.props.updatedAt =
      new Date();
  }

  /*
   * EVALUATING -> COMPLETED
   */

  markCompleted() {
    if (
      this.props.status !==
      "EVALUATING"
    ) {
      const error =
        new Error(
          "Only an evaluating attempt can be completed"
        );

      error.name =
        "InvalidAttemptStateError";

      throw error;
    }

    this.props.status =
      "COMPLETED";

    this.props.updatedAt =
      new Date();
  }

  /*
   * EVALUATING -> FAILED
   */

  markFailed() {
    if (
      this.props.status !==
      "EVALUATING"
    ) {
      const error =
        new Error(
          "Only an evaluating attempt can fail"
        );

      error.name =
        "InvalidAttemptStateError";

      throw error;
    }

    this.props.status =
      "FAILED";

    this.props.updatedAt =
      new Date();
  }

  /*
   * FAILED -> SUBMITTED
   *
   * We intentionally return to SUBMITTED.
   *
   * EvaluationService still owns:
   *
   * SUBMITTED -> EVALUATING
   *
   * This keeps evaluation orchestration
   * outside the Attempt entity.
   */
  retryEvaluation() {
    if (
      this.props.status !==
      "FAILED"
    ) {
      const error =
        new Error(
          "Only a failed attempt can retry evaluation"
        );

      error.name =
        "InvalidAttemptStateError";

      throw error;
    }

    this.props.status =
      "SUBMITTED";

    /*
     * Keep the original submittedAt.
     *
     * The learner submitted the design once;
     * only evaluation is being retried.
     */

    this.props.updatedAt =
      new Date();
  }

  /*
   * Domain submission validation.
   *
   * Request shape belongs to Zod.
   * Meaningful design requirements belong here.
   */

  private validateMeaningfulSubmission() {
    const submission =
      this.props.submission;

    const errors:
      string[] = [];

    if (
      submission
        .requirementUnderstanding
        .trim()
        .length < 20
    ) {
      errors.push(
        "Requirement understanding must contain at least 20 characters"
      );
    }

    if (
      submission.classes.length <
      2
    ) {
      errors.push(
        "At least two classes must be described"
      );
    }

    if (
      submission.classes.some(
        (item) =>
          !item.name.trim() ||
          !item.responsibility.trim()
      )
    ) {
      errors.push(
        "Every class must have a name and responsibility"
      );
    }

    if (
      submission.tradeOffs.length <
      1
    ) {
      errors.push(
        "At least one design trade-off must be explained"
      );
    }

    if (
      submission.edgeCases.length <
      1
    ) {
      errors.push(
        "At least one edge case must be considered"
      );
    }

    if (
      errors.length > 0
    ) {
      const error =
        new Error(
          errors.join("; ")
        );

      error.name =
        "SubmissionValidationError";

      throw error;
    }
  }

  /*
   * Return a defensive copy rather than
   * exposing the mutable internal props.
   */

  toObject(): AttemptProps {
    return {
      ...this.props,

      submission: {
        ...this.props
          .submission,

        assumptions: [
          ...this.props
            .submission
            .assumptions,
        ],

        classes:
          this.props
            .submission
            .classes
            .map(
              (item) => ({
                ...item,
              })
            ),

        interfaces:
          this.props
            .submission
            .interfaces
            .map(
              (item) => ({
                ...item,

                methods: [
                  ...item.methods,
                ],
              })
            ),

        relationships:
          this.props
            .submission
            .relationships
            .map(
              (item) => ({
                ...item,
              })
            ),

        tradeOffs: [
          ...this.props
            .submission
            .tradeOffs,
        ],

        edgeCases: [
          ...this.props
            .submission
            .edgeCases,
        ],
      },
    };
  }
}