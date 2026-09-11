import {
  ArrowLeft,
  ArrowRight,
  Boxes,
  CheckCircle2,
  GitBranch,
  Lightbulb,
  ShieldCheck,
} from "lucide-react";

import {
  motion,
} from "framer-motion";

import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  useEffect,
  useState,
} from "react";

import {
  api,
  type Problem,
} from "../lib/api";

export function ProblemPage() {
  const {
    slug,
  } = useParams();

  const navigate =
    useNavigate();

  const [
    starting,
    setStarting,
  ] = useState(false);

  const [
    problem,
    setProblem,
  ] =
    useState<Problem | null>(
      null
    );

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  const [
    error,
    setError,
  ] =
    useState<string | null>(
      null
    );

  useEffect(
    () => {
      if (!slug) {
        return;
      }

      async function load() {
        try {
          const data =
          await api.getProblem(
            slug!
        );

          setProblem(
            data
          );
        } catch (
          error
        ) {
          setError(
            error instanceof Error
              ? error.message
              : "Unable to load challenge"
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
    ]
  );

  async function handleStartDesign() {
    if (
      !problem ||
      starting
    ) {
      return;
    }

    try {
      setStarting(
        true
      );

      setError(
        null
      );

      const attempt =
        await api.startAttempt(
          problem.slug,
          "demo-learner-001"
        );

      navigate(
        `/workspace/${problem.slug}/${attempt.id}`
      );
    } catch (
      error
    ) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to start attempt"
      );
    } finally {
      setStarting(
        false
      );
    }
  }

  if (loading) {
    return (
      <main className="problem-page">
        <div className="container">
          <div className="page-skeleton" />
        </div>
      </main>
    );
  }

  if (
    !problem
  ) {
    return (
      <main className="problem-page">
        <div className="container">
          <div className="error-box">
            <strong>
              Challenge unavailable
            </strong>

            <span>
              {error ??
                "Problem not found"}
            </span>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="problem-page">
      <div className="detail-glow" />

      <div className="container">
        <Link
          to="/"
          className="back-link"
        >
          <ArrowLeft
            size={16}
          />

          Back to library
        </Link>

        <motion.section
          className="problem-header"
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
        >
          <div className="problem-header-icon">
            <Boxes
              size={28}
            />
          </div>

          <div className="problem-header-copy">
            <span className="section-label">
              LLD challenge
            </span>

            <h1>
              {problem.title}
            </h1>

            <p>
              {problem.brief}
            </p>
          </div>

          <span className="header-difficulty">
            {
              problem.difficulty
            }
          </span>
        </motion.section>

        {error && (
          <div
            className="error-box"
            style={{
              marginTop:
                "20px",
            }}
          >
            <strong>
              Action failed
            </strong>

            <span>
              {error}
            </span>
          </div>
        )}

        <div className="problem-layout">
          <div className="problem-main">
            <section className="glass-card">
              <div className="card-heading">
                <CheckCircle2
                  size={19}
                />

                <h2>
                  Requirements
                </h2>
              </div>

              <div className="requirement-list">
                {problem.requirements.map(
                  (
                    requirement,
                    index
                  ) => (
                    <div
                      className="requirement-row"
                      key={
                        requirement
                      }
                    >
                      <span>
                        {String(
                          index + 1
                        ).padStart(
                          2,
                          "0"
                        )}
                      </span>

                      <p>
                        {
                          requirement
                        }
                      </p>
                    </div>
                  )
                )}
              </div>
            </section>

            <section className="glass-card">
              <div className="card-heading">
                <GitBranch
                  size={19}
                />

                <h2>
                  Change scenarios
                </h2>
              </div>

              <p className="card-description">
                Consider how
                easily your design
                could accommodate
                these changes.
              </p>

              <div className="change-grid">
                {problem.changeScenarios.map(
                  (
                    scenario
                  ) => (
                    <div
                      className="change-item"
                      key={
                        scenario
                      }
                    >
                      <Lightbulb
                        size={17}
                      />

                      {
                        scenario
                      }
                    </div>
                  )
                )}
              </div>
            </section>
          </div>

          <aside className="problem-sidebar">
            <section className="glass-card start-card">
              <span className="section-label">
                Your attempt
              </span>

              <h2>
                Ready to design?
              </h2>

              <p>
                Explain classes,
                responsibilities,
                interfaces,
                relationships,
                trade-offs and
                edge cases.
              </p>

              <button
                type="button"
                className="primary-button full-button"
                disabled={
                  starting
                }
                onClick={
                  handleStartDesign
                }
              >
                {starting
                  ? "Creating workspace..."
                  : "Start design"}

                <ArrowRight
                  size={18}
                />
              </button>

              <small>
                Your draft is
                saved before AI
                evaluation begins.
              </small>
            </section>

            <section className="glass-card">
              <div className="card-heading">
                <ShieldCheck
                  size={18}
                />

                <h3>
                  Constraints
                </h3>
              </div>

              <ul className="constraint-list">
                {problem.constraints.map(
                  (
                    constraint
                  ) => (
                    <li
                      key={
                        constraint
                      }
                    >
                      {
                        constraint
                      }
                    </li>
                  )
                )}
              </ul>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}