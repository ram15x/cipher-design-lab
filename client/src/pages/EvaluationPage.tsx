import {
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  api,
  type Attempt,
} from "../lib/api";

import {
  EvaluationOrb,
} from "../components/EvaluationOrb";

const stages = [
  "Reading your design",
  "Checking structure and consistency",
  "Evaluating responsibilities",
  "Inspecting abstractions",
  "Testing extensibility",
  "Generating evidence-backed feedback",
];

export function EvaluationPage() {
  const {
    slug,
    attemptId,
  } =
    useParams();

  const navigate =
    useNavigate();

  const [
    attempt,
    setAttempt,
  ] =
    useState<
      Attempt | null
    >(null);

  const [
    elapsed,
    setElapsed,
  ] =
    useState(0);

  const [
    error,
    setError,
  ] =
    useState<
      string | null
    >(null);

  const [
    retrying,
    setRetrying,
  ] =
    useState(false);

  const stageIndex =
    useMemo(
      () =>
        Math.min(
          Math.floor(
            elapsed / 7
          ),
          stages.length -
            1
        ),
      [
        elapsed,
      ]
    );

  useEffect(
    () => {
      const timer =
        window.setInterval(
          () =>
            setElapsed(
              (value) =>
                value + 1
            ),
          1000
        );

      return () =>
        window.clearInterval(
          timer
        );
    },
    []
  );

  useEffect(
    () => {
      if (
        !attemptId ||
        !slug
      ) {
        return;
      }

      let cancelled =
        false;

      async function poll() {
        try {
          const current =
            await api.getAttempt(
              attemptId!
            );

          if (
            cancelled
          ) {
            return;
          }

          setAttempt(
            current
          );

          if (
            current.status ===
            "COMPLETED"
          ) {
            navigate(
              `/workspace/${slug}/${attemptId}/results`,
              {
                replace:
                  true,
              }
            );

            return;
          }

          if (
            current.status ===
            "FAILED"
          ) {
            return;
          }

          window.setTimeout(
            poll,
            3000
          );
        } catch (
          error
        ) {
          if (
            !cancelled
          ) {
            setError(
              error instanceof Error
                ? error.message
                : "Unable to check evaluation status"
            );
          }
        }
      }

      void poll();

      return () => {
        cancelled =
          true;
      };
    },
    [
      attemptId,
      slug,
      navigate,
    ]
  );

  async function retry() {
    if (
      !attemptId
    ) {
      return;
    }

    try {
      setRetrying(
        true
      );

      setError(
        null
      );

      const current =
        await api.retryEvaluation(
          attemptId
        );

      setAttempt(
        current
      );

      setElapsed(
        0
      );

      window.location.reload();
    } catch (
      error
    ) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to retry evaluation"
      );
    } finally {
      setRetrying(
        false
      );
    }
  }

  const failed =
    attempt?.status ===
    "FAILED";

  return (
    <main className="evaluation-page">
      <div className="evaluation-background-grid" />
      <div className="evaluation-glow evaluation-glow--one" />
      <div className="evaluation-glow evaluation-glow--two" />

      <div className="container evaluation-container">
        {!failed ? (
          <>
            <EvaluationOrb />

            <span className="section-label">
              Hybrid evaluation
            </span>

            <h1>
              Your design is
              being reviewed.
            </h1>

            <p className="evaluation-lead">
              Deterministic checks and
              AI reasoning are working
              together to generate
              structured feedback.
            </p>

            <div className="evaluation-stage-card">
              <div className="evaluation-stage-current">
                <span className="pulse-dot" />

                {
                  stages[
                    stageIndex
                  ]
                }
              </div>

              <div className="evaluation-progress">
                <div
                  style={{
                    width:
                      `${Math.min(
                        15 +
                          elapsed *
                            1.7,
                        92
                      )}%`,
                  }}
                />
              </div>

              <div className="evaluation-meta">
                <span>
                  Status:{" "}
                  {
                    attempt?.status ??
                    "SUBMITTED"
                  }
                </span>

                <span>
                  {elapsed}s
                </span>
              </div>
            </div>

            <div className="evaluation-checks">
              <div>
                <CheckCircle2
                  size={16}
                />
                Submission stored
              </div>

              <div>
                <CheckCircle2
                  size={16}
                />
                Rubric locked
              </div>

              <div>
                <RefreshCw
                  size={16}
                />
                Evaluators running
              </div>
            </div>
          </>
        ) : (
          <section className="evaluation-failed glass-card">
            <div className="failure-icon">
              <AlertTriangle
                size={34}
              />
            </div>

            <span className="section-label">
              Evaluation failed
            </span>

            <h1>
              Your design is safe.
            </h1>

            <p>
              The submission was stored,
              but the evaluator could not
              finish. You can retry without
              recreating the attempt.
            </p>

            {error && (
              <div className="error-box">
                {error}
              </div>
            )}

            <button
              type="button"
              className="primary-button"
              onClick={
                retry
              }
              disabled={
                retrying
              }
            >
              <RefreshCw
                size={17}
              />

              {retrying
                ? "Retrying..."
                : "Retry evaluation"}
            </button>
          </section>
        )}

        {error &&
          !failed && (
            <div className="error-box evaluation-error">
              {error}
            </div>
          )}
      </div>
    </main>
  );
}