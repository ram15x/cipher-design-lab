import {
  ArrowRight,
  BrainCircuit,
  Boxes,
  CheckCircle2,
  Code2,
  GitBranch,
  Sparkles,
} from "lucide-react";

import {
  motion,
} from "framer-motion";

import {
  Link,
} from "react-router-dom";

import {
  useEffect,
  useState,
} from "react";

import {
  api,
  type Problem,
} from "../lib/api";

import {
  HeroScene,
} from "../components/HeroScene";

function readableDifficulty(
  value: string
) {
  return (
    value.charAt(0) +
    value
      .slice(1)
      .toLowerCase()
  );
}

export function HomePage() {
  const [
    problems,
    setProblems,
  ] =
    useState<Problem[]>(
      []
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
    useState<
      string | null
    >(null);

  useEffect(
    () => {
      async function loadProblems() {
        try {
          const data =
            await api.getProblems();

          setProblems(
            data
          );
        } catch (
          error
        ) {
          setError(
            error instanceof Error
              ? error.message
              : "Unable to load problems"
          );
        } finally {
          setLoading(
            false
          );
        }
      }

      void loadProblems();
    },
    []
  );

  return (
    <main>
      <section className="hero">
        <div className="hero-grid" />
        <div className="glow glow--purple" />
        <div className="glow glow--cyan" />

        <div className="container hero-layout">
          <motion.div
            className="hero-copy"
            initial={{
              opacity: 0,
              y: 30,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.6,
            }}
          >
            <div className="eyebrow">
              <Sparkles size={14} />

              AI-powered LLD
              practice
            </div>

            <h1>
              Think in
              <span>
                {" "}
                objects.
              </span>

              <br />

              Design for
              <span>
                {" "}
                change.
              </span>
            </h1>

            <p className="hero-description">
              Practice Low-Level
              Design through
              structured reasoning,
              real design trade-offs
              and evidence-backed AI
              feedback.
            </p>

            <div className="hero-actions">
              <a
                href="#problems"
                className="primary-button"
              >
                Start practicing

                <ArrowRight
                  size={18}
                />
              </a>

              <div className="powered-by">
                <BrainCircuit
                  size={20}
                />

                <div>
                  <strong>
                    Hybrid
                    evaluator
                  </strong>

                  <span>
                    deterministic
                    rules + AI
                  </span>
                </div>
              </div>
            </div>

            <div className="hero-stats">
              <div>
                <strong>
                  8
                </strong>

                <span>
                  rubric
                  dimensions
                </span>
              </div>

              <div>
                <strong>
                  2
                </strong>

                <span>
                  evaluation
                  layers
                </span>
              </div>

              <div>
                <strong>
                  ∞
                </strong>

                <span>
                  valid
                  approaches
                </span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{
              opacity: 0,
              scale: 0.92,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            transition={{
              duration: 0.8,
            }}
          >
            <HeroScene />
          </motion.div>
        </div>
      </section>

      <section className="pipeline">
        <div className="container pipeline-inner">
          <div>
            <Code2 size={19} />

            Structured
            design
          </div>

          <ArrowRight
            size={15}
          />

          <div>
            <BrainCircuit
              size={19}
            />

            Hybrid
            evaluation
          </div>

          <ArrowRight
            size={15}
          />

          <div>
            <CheckCircle2
              size={19}
            />

            Explainable
            feedback
          </div>
        </div>
      </section>

      <section
        id="problems"
        className="problems"
      >
        <div className="container">
          <div className="section-heading">
            <div>
              <span className="section-label">
                Practice library
              </span>

              <h2>
                Choose a
                design
                challenge.
              </h2>
            </div>

            <p>
              There is no single
              perfect architecture.
              Explain your decisions
              and learn how your
              design behaves when
              requirements change.
            </p>
          </div>

          {loading && (
            <div className="problem-grid">
              {[
                1,
                2,
                3,
                4,
              ].map(
                (value) => (
                  <div
                    key={value}
                    className="problem-card skeleton"
                  />
                )
              )}
            </div>
          )}

          {error && (
            <div className="error-box">
              <strong>
                Could not reach
                the API
              </strong>

              <span>
                {error}
              </span>
            </div>
          )}

          {!loading &&
            !error && (
              <div className="problem-grid">
                {problems.map(
                  (
                    problem,
                    index
                  ) => (
                    <motion.div
                      key={
                        problem.id
                      }
                      initial={{
                        opacity: 0,
                        y: 25,
                      }}
                      whileInView={{
                        opacity: 1,
                        y: 0,
                      }}
                      viewport={{
                        once: true,
                      }}
                      transition={{
                        duration:
                          0.4,
                        delay:
                          index *
                          0.06,
                      }}
                    >
                      <Link
                        to={`/problems/${problem.slug}`}
                        className="problem-card"
                      >
                        <div className="problem-card-top">
                          <div className="problem-icon">
                            <Boxes
                              size={21}
                            />
                          </div>

                          <span
                            className={`difficulty difficulty--${problem.difficulty.toLowerCase()}`}
                          >
                            {readableDifficulty(
                              problem.difficulty
                            )}
                          </span>
                        </div>

                        <h3>
                          {
                            problem.title
                          }
                        </h3>

                        <p>
                          {
                            problem.brief
                          }
                        </p>

                        <div className="card-meta">
                          <span>
                            <Code2
                              size={13}
                            />

                            {
                              problem
                                .requirements
                                .length
                            }{" "}
                            requirements
                          </span>

                          <span>
                            <GitBranch
                              size={13}
                            />

                            {
                              problem
                                .changeScenarios
                                .length
                            }{" "}
                            changes
                          </span>
                        </div>

                        <div className="card-action">
                          Open challenge

                          <ArrowRight
                            size={17}
                          />
                        </div>
                      </Link>
                    </motion.div>
                  )
                )}
              </div>
            )}
        </div>
      </section>
    </main>
  );
}