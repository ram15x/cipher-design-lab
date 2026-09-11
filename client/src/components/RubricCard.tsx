import {
  AlertCircle,
  ArrowUpRight,
  Quote,
} from "lucide-react";

import type {
  EvaluationCriterion,
} from "../lib/api";

function prettyCriterion(
  value: string
) {
  return value
    .split("_")
    .map(
      (part) =>
        part
          .charAt(0)
          .toUpperCase() +
        part
          .slice(1)
          .toLowerCase()
    )
    .join(" ");
}

export function RubricCard({
  criterion,
}: {
  criterion:
    EvaluationCriterion;
}) {
  return (
    <article className="rubric-card">
      <div className="rubric-card-top">
        <div>
          <span
            className={`confidence confidence--${criterion.confidence.toLowerCase()}`}
          >
            {
              criterion.confidence
            }{" "}
            confidence
          </span>

          <h3>
            {prettyCriterion(
              criterion.criterion
            )}
          </h3>
        </div>

        <div className="criterion-score">
          <strong>
            {
              criterion.score
            }
          </strong>

          <span>
            /{" "}
            {
              criterion.maxScore
            }
          </span>
        </div>
      </div>

      <div className="feedback-block">
        <div className="feedback-label">
          <Quote
            size={14}
          />
          Evidence
        </div>

        <p>
          {
            criterion.evidence
          }
        </p>
      </div>

      <div className="feedback-block feedback-block--concern">
        <div className="feedback-label">
          <AlertCircle
            size={14}
          />
          Concern
        </div>

        <p>
          {
            criterion.concern
          }
        </p>
      </div>

      <div className="feedback-block feedback-block--suggestion">
        <div className="feedback-label">
          <ArrowUpRight
            size={14}
          />
          Next attempt
        </div>

        <p>
          {
            criterion.suggestion
          }
        </p>
      </div>
    </article>
  );
}