import { z } from "zod";

export const EvaluationCriterionSchema =
  z.enum([
    "REQUIREMENT_UNDERSTANDING",

    "CLASS_RESPONSIBILITIES",

    "COUPLING_COHESION",

    "ENCAPSULATION_INTERFACES",

    "ABSTRACTION_PATTERNS",

    "EXTENSIBILITY",

    "EDGE_CASES_TESTABILITY",

    "EXPLANATION_QUALITY",
  ]);

export const CriterionFeedbackSchema =
  z.object({
    criterion:
      EvaluationCriterionSchema,

    score: z
      .number()
      .min(0)
      .max(5),

    maxScore:
      z.literal(5),

    /*
     * At least one evidence reference
     * should support each rubric judgment.
     *
     * We keep a generous upper bound to
     * protect against pathological model
     * output without failing reasonable
     * evaluations that cite more than
     * ten valid evidence items.
     *
     * Actual evidence IDs are validated
     * separately against the learner's
     * evidence catalogue.
     */
    evidenceRefs: z
      .array(
        z.string().min(1)
      )
      .min(1)
      .max(50),

    evidence: z
      .string()
      .min(1)
      .max(1500),

    concern: z
      .string()
      .min(1)
      .max(1500),

    suggestion: z
      .string()
      .min(1)
      .max(1500),

    confidence:
      z.enum([
        "LOW",
        "MEDIUM",
        "HIGH",
      ]),
  });

export const LlmEvaluationSchema =
  z.object({
    criteria: z
      .array(
        CriterionFeedbackSchema
      )
      .length(8),
  });

export type LlmEvaluationOutput =
  z.infer<
    typeof LlmEvaluationSchema
  >;

export const REQUIRED_CRITERIA =
  EvaluationCriterionSchema
    .options;