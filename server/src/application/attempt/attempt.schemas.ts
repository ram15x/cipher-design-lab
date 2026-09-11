import { z } from "zod";

export const StartAttemptSchema =
  z.object({
    learnerId: z
      .string()
      .trim()
      .min(3)
      .max(100),

    previousAttemptId:
      z.string().uuid().nullable().optional(),
  });

const DesignClassSchema =
  z.object({
    name: z
      .string()
      .trim()
      .max(100),

    responsibility:
      z.string()
        .trim()
        .max(1000),
  });

const DesignInterfaceSchema =
  z.object({
    name: z
      .string()
      .trim()
      .max(100),

    purpose: z
      .string()
      .trim()
      .max(1000),

    methods:
      z.array(
        z.string()
          .trim()
          .max(200)
      )
      .max(30),
  });

const RelationshipSchema =
  z.object({
    from: z
      .string()
      .trim()
      .max(100),

    to: z
      .string()
      .trim()
      .max(100),

    type: z.enum([
      "ASSOCIATION",
      "COMPOSITION",
      "AGGREGATION",
      "INHERITANCE",
      "DEPENDENCY",
    ]),

    description:
      z.string()
        .trim()
        .max(1000),
  });

export const SubmissionSchema =
  z.object({
    requirementUnderstanding:
      z.string()
        .max(5000),

    assumptions:
      z.array(
        z.string()
          .trim()
          .max(500)
      )
      .max(30),

    classes:
      z.array(
        DesignClassSchema
      )
      .max(50),

    interfaces:
      z.array(
        DesignInterfaceSchema
      )
      .max(30),

    relationships:
      z.array(
        RelationshipSchema
      )
      .max(100),

    tradeOffs:
      z.array(
        z.string()
          .trim()
          .max(1000)
      )
      .max(30),

    edgeCases:
      z.array(
        z.string()
          .trim()
          .max(1000)
      )
      .max(50),
  });