import {
  describe,
  expect,
  it,
} from "vitest";

import {
  RuleBasedEvaluator,
} from "./RuleBasedEvaluator.js";

import type {
  EvaluationContext,
} from "../../domain/evaluation/Evaluator.js";

function createContext():
  EvaluationContext {
  return {
    attemptId:
      "attempt-test-001",

    problem: {
      id:
        "problem-test-001",

      slug:
        "parking-lot",

      title:
        "Parking Lot",

      difficulty:
        "BEGINNER",

      brief:
        "Design a parking lot system.",

      requirements: [
        "Support multiple vehicle types.",
        "Allocate compatible parking spots.",
      ],

      constraints: [
        "One vehicle may occupy only one spot.",
      ],

      changeScenarios: [
        "Support EV charging spots.",
      ],

      createdAt:
        new Date(),

      updatedAt:
        new Date(),
    },

    submission: {
      requirementUnderstanding:
        "The system should manage vehicle entry and exit, allocate compatible parking spots, create tickets, calculate parking fees, and allow parking allocation behaviour to evolve.",

      assumptions: [
        "Vehicles have unique registration numbers.",
      ],

      classes: [
        {
          name:
            "ParkingLot",

          responsibility:
            "Coordinates parking operations and delegates allocation decisions.",
        },

        {
          name:
            "ParkingSpot",

          responsibility:
            "Represents a parking space and tracks its availability and supported type.",
        },
      ],

      interfaces: [
        {
          name:
            "ParkingStrategy",

          purpose:
            "Encapsulates replaceable parking allocation behaviour.",

          methods: [
            "findSpot(vehicleType)",
          ],
        },
      ],

      relationships: [
        {
          from:
            "ParkingLot",

          to:
            "ParkingStrategy",

          type:
            "DEPENDENCY",

          description:
            "ParkingLot delegates parking spot selection to ParkingStrategy.",
        },
      ],

      tradeOffs: [
        "A strategy abstraction introduces additional structure but isolates changing allocation algorithms.",
      ],

      edgeCases: [
        "Parking lot is full.",
      ],
    },
  };
}

describe(
  "RuleBasedEvaluator",
  () => {
    it(
      "does not create a subjective overall score",
      async () => {
        const evaluator =
          new RuleBasedEvaluator();

        const result =
          await evaluator.evaluate(
            createContext()
          );

        expect(
          result.overallScore
        ).toBeNull();

        expect(
          result.criteria
        ).toEqual([]);
      }
    );

    it(
      "returns no findings for the valid baseline design",
      async () => {
        const evaluator =
          new RuleBasedEvaluator();

        const result =
          await evaluator.evaluate(
            createContext()
          );

        expect(
          result.ruleFindings
        ).toEqual([]);
      }
    );

    it(
      "detects duplicate class names",
      async () => {
        const evaluator =
          new RuleBasedEvaluator();

        const context =
          createContext();

        context.submission
          .classes.push({
            name:
              "ParkingLot",

            responsibility:
              "Another component incorrectly using the same class name.",
          });

        const result =
          await evaluator.evaluate(
            context
          );

        expect(
          result.ruleFindings
            .some(
              (finding) =>
                finding.code ===
                "DUPLICATE_CLASS"
            )
        ).toBe(true);
      }
    );

    it(
      "detects duplicate class names case-insensitively",
      async () => {
        const evaluator =
          new RuleBasedEvaluator();

        const context =
          createContext();

        context.submission
          .classes.push({
            name:
              "parkinglot",

            responsibility:
              "Duplicate class with different capitalization for testing.",
          });

        const result =
          await evaluator.evaluate(
            context
          );

        expect(
          result.ruleFindings
            .some(
              (finding) =>
                finding.code ===
                "DUPLICATE_CLASS"
            )
        ).toBe(true);
      }
    );

    it(
      "detects weak class responsibility descriptions",
      async () => {
        const evaluator =
          new RuleBasedEvaluator();

        const context =
          createContext();

        context.submission
          .classes[0]
          .responsibility =
          "Handles parking.";

        const result =
          await evaluator.evaluate(
            context
          );

        expect(
          result.ruleFindings
            .some(
              (finding) =>
                finding.code ===
                "WEAK_RESPONSIBILITY"
            )
        ).toBe(true);
      }
    );

    it(
      "detects an unknown relationship source",
      async () => {
        const evaluator =
          new RuleBasedEvaluator();

        const context =
          createContext();

        context.submission
          .relationships = [
            {
              from:
                "UnknownController",

              to:
                "ParkingSpot",

              type:
                "DEPENDENCY",

              description:
                "Relationship containing an undeclared source.",
            },
          ];

        const result =
          await evaluator.evaluate(
            context
          );

        expect(
          result.ruleFindings
            .some(
              (finding) =>
                finding.code ===
                "UNKNOWN_RELATIONSHIP_SOURCE"
            )
        ).toBe(true);
      }
    );

    it(
      "detects an unknown relationship target",
      async () => {
        const evaluator =
          new RuleBasedEvaluator();

        const context =
          createContext();

        context.submission
          .relationships = [
            {
              from:
                "ParkingLot",

              to:
                "UnknownService",

              type:
                "DEPENDENCY",

              description:
                "Relationship containing an undeclared target.",
            },
          ];

        const result =
          await evaluator.evaluate(
            context
          );

        expect(
          result.ruleFindings
            .some(
              (finding) =>
                finding.code ===
                "UNKNOWN_RELATIONSHIP_TARGET"
            )
        ).toBe(true);
      }
    );

    it(
      "warns when no relationships are described",
      async () => {
        const evaluator =
          new RuleBasedEvaluator();

        const context =
          createContext();

        context.submission
          .relationships = [];

        const result =
          await evaluator.evaluate(
            context
          );

        expect(
          result.ruleFindings
            .some(
              (finding) =>
                finding.code ===
                "NO_RELATIONSHIPS"
            )
        ).toBe(true);
      }
    );

    it(
      "reports when no interface or variation point is described",
      async () => {
        const evaluator =
          new RuleBasedEvaluator();

        const context =
          createContext();

        context.submission
          .interfaces = [];

        context.submission
          .relationships = [];

        const result =
          await evaluator.evaluate(
            context
          );

        expect(
          result.ruleFindings
            .some(
              (finding) =>
                finding.code ===
                "NO_INTERFACES"
            )
        ).toBe(true);
      }
    );

    it(
      "detects shallow requirement explanations",
      async () => {
        const evaluator =
          new RuleBasedEvaluator();

        const context =
          createContext();

        context.submission
          .requirementUnderstanding =
          "Manage parking spots.";

        const result =
          await evaluator.evaluate(
            context
          );

        expect(
          result.ruleFindings
            .some(
              (finding) =>
                finding.code ===
                "SHALLOW_REQUIREMENT_EXPLANATION"
            )
        ).toBe(true);
      }
    );

    it(
      "reports when assumptions are missing",
      async () => {
        const evaluator =
          new RuleBasedEvaluator();

        const context =
          createContext();

        context.submission
          .assumptions = [];

        const result =
          await evaluator.evaluate(
            context
          );

        expect(
          result.ruleFindings
            .some(
              (finding) =>
                finding.code ===
                "NO_ASSUMPTIONS"
            )
        ).toBe(true);
      }
    );
  }
);