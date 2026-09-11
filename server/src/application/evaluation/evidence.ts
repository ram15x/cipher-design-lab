import type {
  StructuredSubmission,
} from "../../domain/attempt/Attempt.js";

export interface EvidenceItem {
  ref: string;

  content: string;
}

export function buildEvidenceCatalog(
  submission:
    StructuredSubmission
): EvidenceItem[] {
  const evidence:
    EvidenceItem[] = [];

  /*
   * Requirement understanding
   */

  evidence.push({
    ref:
      "section:requirement-understanding",

    content:
      submission
        .requirementUnderstanding,
  });

  /*
   * Assumptions
   */

  submission.assumptions.forEach(
    (assumption, index) => {
      evidence.push({
        ref:
          `assumption:${index + 1}`,

        content:
          assumption,
      });
    }
  );

  /*
   * Classes
   */

  submission.classes.forEach(
    (designClass) => {
      evidence.push({
        ref:
          `class:${designClass.name}`,

        content:
          `${designClass.name}: ${designClass.responsibility}`,
      });
    }
  );

  /*
   * Interfaces
   */

  submission.interfaces.forEach(
    (designInterface) => {
      evidence.push({
        ref:
          `interface:${designInterface.name}`,

        content:
          [
            `${designInterface.name}: ${designInterface.purpose}`,

            `Methods: ${designInterface.methods.join(", ")}`,
          ].join("\n"),
      });
    }
  );

  /*
   * Relationships
   */

  submission.relationships.forEach(
    (
      relationship,
      index
    ) => {
      evidence.push({
        ref:
          `relationship:${index + 1}`,

        content:
          `${relationship.from} -> ${relationship.to} (${relationship.type}): ${relationship.description}`,
      });
    }
  );

  /*
   * Trade-offs
   */

  submission.tradeOffs.forEach(
    (tradeOff, index) => {
      evidence.push({
        ref:
          `tradeoff:${index + 1}`,

        content:
          tradeOff,
      });
    }
  );

  /*
   * Edge cases
   */

  submission.edgeCases.forEach(
    (edgeCase, index) => {
      evidence.push({
        ref:
          `edgecase:${index + 1}`,

        content:
          edgeCase,
      });
    }
  );

  return evidence;
}

export function validateEvidenceRefs(
  refs: string[],
  catalog: EvidenceItem[]
) {
  const allowedRefs =
    new Set(
      catalog.map(
        (item) =>
          item.ref
      )
    );

  const invalid =
    refs.filter(
      (ref) =>
        !allowedRefs.has(
          ref
        )
    );

  if (
    invalid.length > 0
  ) {
    throw new Error(
      `AI returned invalid evidence references: ${invalid.join(", ")}`
    );
  }
}