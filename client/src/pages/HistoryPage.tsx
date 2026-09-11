import {
  ArrowRight,
  BrainCircuit,
  Clock3,
  History,
  RefreshCw,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  api,
  type Attempt,
} from "../lib/api";

const LEARNER_ID =
  "demo-learner-001";

interface HistoryItem {
  attempt: Attempt;

  score:
    number | null;
}

export function HistoryPage() {
  const navigate =
    useNavigate();

  const [
    items,
    setItems,
  ] =
    useState<
      HistoryItem[]
    >([]);

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  const [
    error,
    setError,
  ] =
    useState<
      string | null
    >(null);

  const [
    creating,
    setCreating,
  ] =
    useState<
      string | null
    >(null);

  useEffect(
    () => {
      async function loadHistory() {
        try {
          const attempts =
            await api.getLearnerAttempts(
              LEARNER_ID
            );

          const enriched =
            await Promise.all(
              attempts.map(
                async (
                  attempt
                ) => {
                  if (
                    attempt.status !==
                    "COMPLETED"
                  ) {
                    return {
                      attempt,
                      score: null,
                    };
                  }

                  try {
                    const evaluation =
                      await api.getEvaluation(
                        attempt.id
                      );

                    return {
                      attempt,

                      score:
                        evaluation
                          .result
                          ?.overallScore ??
                        null,
                    };
                  } catch {
                    return {
                      attempt,
                      score: null,
                    };
                  }
                }
              )
            );

          setItems(
            enriched
          );
        } catch (
          error
        ) {
          setError(
            error instanceof Error
              ? error.message
              : "Unable to load attempt history"
          );
        } finally {
          setLoading(
            false
          );
        }
      }

      void loadHistory();
    },
    []
  );

  async function tryAgain(
    attempt: Attempt
  ) {
    try {
      setCreating(
        attempt.id
      );

      const nextAttempt =
        await api.startAttempt(
          attempt.problemSlug,
          attempt.learnerId,
          attempt.id
        );

      navigate(
        `/workspace/${attempt.problemSlug}/${nextAttempt.id}`
      );
    } catch (
      error
    ) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to create a new attempt"
      );
    } finally {
      setCreating(
        null
      );
    }
  }

  return (
    <main className="history-page">
      <div className="history-glow" />

      <div className="container">
        <section className="history-header">
          <div>
            <span className="section-label">
              Learning loop
            </span>

            <h1>
              Attempt history
            </h1>

            <p>
              Review previous designs,
              inspect feedback and try
              the same challenge again
              with better decisions.
            </p>
          </div>

          <div className="history-summary">
            <History
              size={20}
            />

            <div>
              <strong>
                {items.length}
              </strong>

              <span>
                attempts
              </span>
            </div>
          </div>
        </section>

        {error && (
          <div className="error-box history-error">
            {error}
          </div>
        )}

        {loading && (
          <div className="history-grid">
            {[1, 2, 3].map(
              (item) => (
                <div
                  key={item}
                  className="history-card skeleton"
                />
              )
            )}
          </div>
        )}

        {!loading &&
          items.length ===
            0 && (
            <section className="glass-card history-empty">
              <BrainCircuit
                size={32}
              />

              <h2>
                No attempts yet
              </h2>

              <p>
                Start a design
                challenge to build
                your history.
              </p>

              <Link
                to="/#problems"
                className="primary-button"
              >
                Browse problems

                <ArrowRight
                  size={17}
                />
              </Link>
            </section>
          )}

        {!loading &&
          items.length >
            0 && (
            <div className="history-grid">
              {items.map(
                ({
                  attempt,
                  score,
                }) => (
                  <article
                    className="history-card"
                    key={
                      attempt.id
                    }
                  >
                    <div className="history-card-top">
                      <div>
                        <span className="history-problem">
                          {
                            attempt.problemSlug
                              .split(
                                "-"
                              )
                              .map(
                                (
                                  word
                                ) =>
                                  word
                                    .charAt(
                                      0
                                    )
                                    .toUpperCase() +
                                  word.slice(
                                    1
                                  )
                              )
                              .join(
                                " "
                              )
                          }
                        </span>

                        <h2>
                          Attempt #
                          {
                            attempt.attemptNumber
                          }
                        </h2>
                      </div>

                      <span
                        className={`history-status history-status--${attempt.status.toLowerCase()}`}
                      >
                        {
                          attempt.status
                        }
                      </span>
                    </div>

                    <div className="history-card-info">
                      <div>
                        <Clock3
                          size={14}
                        />

                        {new Date(
                          attempt.updatedAt
                        ).toLocaleString()}
                      </div>

                      {score !==
                        null && (
                        <div className="history-score">
                          <strong>
                            {
                              score
                            }
                          </strong>

                          <span>
                            /100
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="history-card-actions">
                      {attempt.status ===
                        "DRAFT" && (
                        <Link
                          className="secondary-button"
                          to={`/workspace/${attempt.problemSlug}/${attempt.id}`}
                        >
                          Continue
                        </Link>
                      )}

                      {attempt.status ===
                        "EVALUATING" && (
                        <Link
                          className="secondary-button"
                          to={`/workspace/${attempt.problemSlug}/${attempt.id}/evaluating`}
                        >
                          View status
                        </Link>
                      )}

                      {attempt.status ===
                        "FAILED" && (
                        <Link
                          className="secondary-button"
                          to={`/workspace/${attempt.problemSlug}/${attempt.id}/evaluating`}
                        >
                          Retry evaluation
                        </Link>
                      )}

                      {attempt.status ===
                        "COMPLETED" && (
                        <>
                          <Link
                            className="secondary-button"
                            to={`/workspace/${attempt.problemSlug}/${attempt.id}/results`}
                          >
                            Feedback
                          </Link>

                          <button
                            type="button"
                            className="primary-button history-try-button"
                            disabled={
                              creating ===
                              attempt.id
                            }
                            onClick={
                              () =>
                                tryAgain(
                                  attempt
                                )
                            }
                          >
                            <RefreshCw
                              size={
                                15
                              }
                            />

                            {creating ===
                            attempt.id
                              ? "Creating..."
                              : "Try again"}
                          </button>
                        </>
                      )}
                    </div>
                  </article>
                )
              )}
            </div>
          )}
      </div>
    </main>
  );
}