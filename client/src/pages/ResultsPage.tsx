import {
  ArrowLeft,
  BrainCircuit,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  api,
  type Attempt,
  type Evaluation,
  type Problem,
} from "../lib/api";

import {
  ScoreRing,
} from "../components/ScoreRing";

import {
  RubricCard,
} from "../components/RubricCard";

export function ResultsPage() {
  const {
    slug,
    attemptId,
  } =
    useParams();

  const navigate =
    useNavigate();

  const [
    evaluation,
    setEvaluation,
  ] =
    useState<
      Evaluation | null
    >(null);

  const [
    attempt,
    setAttempt,
  ] =
    useState<
      Attempt | null
    >(null);

  const [
    problem,
    setProblem,
  ] =
    useState<
      Problem | null
    >(null);

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  const [
    startingAgain,
    setStartingAgain,
  ] =
    useState(false);

  const [
    error,
    setError,
  ] =
    useState<
      string | null
    >(null);

  useEffect(
    () => {
      async function load() {
        if (
          !attemptId ||
          !slug
        ) {
          return;
        }

        try {
          const [
            evaluationData,
            attemptData,
            problemData,
          ] =
            await Promise.all([
              api.getEvaluation(
                attemptId
              ),

              api.getAttempt(
                attemptId
              ),

              api.getProblem(
                slug
              ),
            ]);

          setEvaluation(
            evaluationData
          );

          setAttempt(
            attemptData
          );

          setProblem(
            problemData
          );
        } catch (
          error
        ) {
          setError(
            error instanceof Error
              ? error.message
              : "Unable to load results"
          );
        } finally {
          setLoading(
            false
          );
        }
      }

      void load();
    },
    [
      attemptId,
      slug,
    ]
  );

  async function tryAgain() {
    if (
      !problem ||
      !attempt
    ) {
      return;
    }

    try {
      setStartingAgain(
        true
      );

      const newAttempt =
        await api.startAttempt(
          problem.slug,
          attempt.learnerId,
          attempt.id
        );

      navigate(
        `/workspace/${problem.slug}/${newAttempt.id}`
      );
    } catch (
      error
    ) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to create next attempt"
      );
    } finally {
      setStartingAgain(
        false
      );
    }
  }

  if (loading) {
    return (
      <main className="results-page">
        <div className="container">
          <div className="page-skeleton" />
        </div>
      </main>
    );
  }

  if (
    error ||
    !evaluation ||
    !evaluation.result ||
    !attempt
  ) {
    return (
      <main className="results-page">
        <div className="container">
          <div className="error-box">
            {error ??
              "Evaluation result unavailable"}
          </div>
        </div>
      </main>
    );
  }

  const score =
    evaluation.result
      .overallScore ??
    0;

  return (
    <main className="results-page">
      <div className="results-glow results-glow--one" />
      <div className="results-glow results-glow--two" />

      <div className="container">
        <Link
          to="/"
          className="back-link"
        >
          <ArrowLeft
            size={16}
          />

          Practice library
        </Link>

        <section className="results-hero glass-card">
          <div className="results-hero-copy">
            <div className="results-complete">
              <CheckCircle2
                size={16}
              />

              Evaluation complete
            </div>

            <span className="section-label">
              Attempt #
              {
                attempt.attemptNumber
              }
            </span>

            <h1>
              Your design
              feedback.
            </h1>

            <p>
              The hybrid evaluator
              reviewed your design
              across eight dimensions
              and grounded its feedback
              in your submission.
            </p>

            <div className="result-meta">
              <span>
                <BrainCircuit
                  size={15}
                />

                {
                  evaluation.evaluatorKey
                }
              </span>

              <span>
                {
                  evaluation
                    .result
                    .criteria
                    .length
                }{" "}
                rubric dimensions
              </span>
            </div>
          </div>

          <ScoreRing
            score={
              score
            }
          />
        </section>

        <section className="results-section-heading">
          <div>
            <span className="section-label">
              Rubric breakdown
            </span>

            <h2>
              What worked.
              What to improve.
            </h2>
          </div>

          <button
            type="button"
            className="primary-button"
            onClick={
              tryAgain
            }
            disabled={
              startingAgain
            }
          >
            <RefreshCw
              size={17}
            />

            {startingAgain
              ? "Creating attempt..."
              : "Try again"}
          </button>
        </section>

        <div className="rubric-grid">
          {evaluation
            .result
            .criteria
            .map(
              (
                criterion
              ) => (
                <RubricCard
                  key={
                    criterion
                      .criterion
                  }
                  criterion={
                    criterion
                  }
                />
              )
            )}
        </div>

        {evaluation
          .result
          .ruleFindings
          .length >
          0 && (
          <section className="glass-card rule-findings-panel">
            <span className="section-label">
              Deterministic findings
            </span>

            <h2>
              Structural checks
            </h2>

            <div className="rule-findings-list">
              {evaluation
                .result
                .ruleFindings
                .map(
                  (
                    finding,
                    index
                  ) => (
                    <div
                      key={
                        `${finding.code}-${index}`
                      }
                      className="rule-finding-row"
                    >
                      <strong>
                        {
                          finding.code
                        }
                      </strong>

                      <span>
                        {
                          finding.message
                        }
                      </span>
                    </div>
                  )
                )}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}