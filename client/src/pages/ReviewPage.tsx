import {
  ArrowLeft,
  CheckCircle2,
  Send,
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
  type Problem,
} from "../lib/api";

export function ReviewPage() {
  const {
    slug,
    attemptId,
  } =
    useParams();

  const navigate =
    useNavigate();

  const [
    problem,
    setProblem,
  ] =
    useState<
      Problem | null
    >(null);

  const [
    attempt,
    setAttempt,
  ] =
    useState<
      Attempt | null
    >(null);

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  const [
    submitting,
    setSubmitting,
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
          !slug ||
          !attemptId
        ) {
          return;
        }

        try {
          const [
            problemData,
            attemptData,
          ] =
            await Promise.all([
              api.getProblem(
                slug
              ),

              api.getAttempt(
                attemptId
              ),
            ]);

          setProblem(
            problemData
          );

          setAttempt(
            attemptData
          );
        } catch (
          error
        ) {
          setError(
            error instanceof Error
              ? error.message
              : "Unable to load review"
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
      slug,
      attemptId,
    ]
  );

  async function handleSubmit() {
    if (
      !attemptId ||
      submitting
    ) {
      return;
    }

    try {
      setSubmitting(
        true
      );

      setError(
        null
      );

      await api.submitAttempt(
        attemptId
      );

      navigate(
        `/workspace/${slug}/${attemptId}/evaluating`
      );
    } catch (
      error
    ) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to submit attempt"
      );
    } finally {
      setSubmitting(
        false
      );
    }
  }

  if (loading) {
    return (
      <main className="review-page">
        <div className="container">
          <div className="page-skeleton" />
        </div>
      </main>
    );
  }

  if (
    !attempt ||
    !problem
  ) {
    return (
      <main className="review-page">
        <div className="container">
          <div className="error-box">
            {error ??
              "Unable to load review"}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="review-page">
      <div className="review-glow" />

      <div className="container">
        <Link
          to={`/workspace/${slug}/${attemptId}`}
          className="back-link"
        >
          <ArrowLeft
            size={16}
          />

          Back to workspace
        </Link>

        <section className="review-header glass-card">
          <div>
            <span className="section-label">
              Final review
            </span>

            <h1>
              Review your design
            </h1>

            <p>
              Make sure your reasoning
              is complete before sending
              it to the hybrid evaluator.
            </p>
          </div>

          <div className="attempt-pill">
            Attempt #
            {
              attempt.attemptNumber
            }

            <span>
              {
                attempt.status
              }
            </span>
          </div>
        </section>

        {error && (
          <div className="error-box review-error">
            {error}
          </div>
        )}

        <div className="review-layout">
          <div className="review-main">
            <ReviewSection
              title="Requirement understanding"
            >
              <p>
                {
                  attempt
                    .submission
                    .requirementUnderstanding
                }
              </p>
            </ReviewSection>

            <ReviewSection
              title="Assumptions"
            >
              <BulletList
                items={
                  attempt
                    .submission
                    .assumptions
                }
              />
            </ReviewSection>

            <ReviewSection
              title="Classes & responsibilities"
            >
              <div className="review-entity-list">
                {attempt
                  .submission
                  .classes
                  .map(
                    (
                      item,
                      index
                    ) => (
                      <div
                        className="review-entity"
                        key={
                          `${item.name}-${index}`
                        }
                      >
                        <strong>
                          {
                            item.name
                          }
                        </strong>

                        <span>
                          {
                            item.responsibility
                          }
                        </span>
                      </div>
                    )
                  )}
              </div>
            </ReviewSection>

            <ReviewSection
              title="Interfaces"
            >
              <div className="review-entity-list">
                {attempt
                  .submission
                  .interfaces
                  .map(
                    (
                      item,
                      index
                    ) => (
                      <div
                        className="review-entity"
                        key={
                          `${item.name}-${index}`
                        }
                      >
                        <strong>
                          {
                            item.name
                          }
                        </strong>

                        <span>
                          {
                            item.purpose
                          }
                        </span>

                        {item
                          .methods
                          .length >
                          0 && (
                          <small>
                            {
                              item
                                .methods
                                .join(
                                  ", "
                                )
                            }
                          </small>
                        )}
                      </div>
                    )
                  )}
              </div>
            </ReviewSection>

            <ReviewSection
              title="Relationships"
            >
              <div className="review-entity-list">
                {attempt
                  .submission
                  .relationships
                  .map(
                    (
                      item,
                      index
                    ) => (
                      <div
                        className="review-relationship"
                        key={
                          index
                        }
                      >
                        <div>
                          <strong>
                            {
                              item.from
                            }
                          </strong>

                          <span>
                            {
                              item.type
                            }
                          </span>

                          <strong>
                            {
                              item.to
                            }
                          </strong>
                        </div>

                        <p>
                          {
                            item.description
                          }
                        </p>
                      </div>
                    )
                  )}
              </div>
            </ReviewSection>

            <ReviewSection
              title="Trade-offs"
            >
              <BulletList
                items={
                  attempt
                    .submission
                    .tradeOffs
                }
              />
            </ReviewSection>

            <ReviewSection
              title="Edge cases"
            >
              <BulletList
                items={
                  attempt
                    .submission
                    .edgeCases
                }
              />
            </ReviewSection>
          </div>

          <aside className="review-sidebar">
            <section className="glass-card submit-card">
              <div className="submit-icon">
                <CheckCircle2
                  size={24}
                />
              </div>

              <span className="section-label">
                Ready to evaluate
              </span>

              <h2>
                Submit this design?
              </h2>

              <p>
                Your submission will be
                stored first, then evaluated
                asynchronously.
              </p>

              <button
                type="button"
                className="primary-button full-button"
                disabled={
                  submitting
                }
                onClick={
                  handleSubmit
                }
              >
                {submitting
                  ? "Submitting..."
                  : "Submit for evaluation"}

                <Send
                  size={17}
                />
              </button>

              <small>
                After submission, the
                design can no longer be
                edited.
              </small>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}

function ReviewSection({
  title,
  children,
}: {
  title: string;

  children:
    React.ReactNode;
}) {
  return (
    <section className="glass-card review-section">
      <h2>
        {title}
      </h2>

      <div className="review-section-content">
        {children}
      </div>
    </section>
  );
}

function BulletList({
  items,
}: {
  items: string[];
}) {
  const filtered =
    items.filter(
      (item) =>
        item.trim()
    );

  if (
    filtered.length === 0
  ) {
    return (
      <p className="empty-review">
        Nothing provided.
      </p>
    );
  }

  return (
    <ul className="review-list">
      {filtered.map(
        (
          item,
          index
        ) => (
          <li
            key={
              `${item}-${index}`
            }
          >
            {item}
          </li>
        )
      )}
    </ul>
  );
}