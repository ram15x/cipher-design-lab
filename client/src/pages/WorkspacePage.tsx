import {
  ArrowLeft,
  Boxes,
  Check,
  GitBranch,
  Lightbulb,
  Plus,
  Save,
  Send,
  Trash2,
} from "lucide-react";

import {
  useEffect,
  useMemo,
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
  type DesignRelationship,
  type Problem,
  type StructuredSubmission,
} from "../lib/api";


const emptySubmission:
  StructuredSubmission = {
    requirementUnderstanding:
      "",

    assumptions: [
      "",
    ],

    classes: [
      {
        name: "",
        responsibility: "",
      },

      {
        name: "",
        responsibility: "",
      },
    ],

    interfaces: [
      {
        name: "",
        purpose: "",
        methods: [
          "",
        ],
      },
    ],

    relationships: [],

    tradeOffs: [
      "",
    ],

    edgeCases: [
      "",
    ],
  };

export function WorkspacePage() {
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
    submission,
    setSubmission,
  ] =
    useState<
      StructuredSubmission
    >(
      emptySubmission
    );

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  const [
    saving,
    setSaving,
  ] =
    useState(false);

  const [
    saved,
    setSaved,
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

          setSubmission(
            attemptData.submission
          );
        } catch (
          error
        ) {
          setError(
            error instanceof Error
              ? error.message
              : "Unable to load workspace"
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

  const namedClasses =
    useMemo(
      () =>
        submission.classes
          .map(
            (item) =>
              item.name.trim()
          )
          .filter(
            Boolean
          ),
      [
        submission.classes,
      ]
    );

  async function saveDraft() {
    if (!attemptId) {
      return;
    }

    try {
      setSaving(true);
      setSaved(false);
      setError(null);

      const result =
        await api.saveDraft(
          attemptId,
          submission
        );

      setAttempt(
        result
      );

      setSaved(
        true
      );

      window.setTimeout(
        () =>
          setSaved(
            false
          ),
        1800
      );
    } catch (
      error
    ) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to save draft"
      );
    } finally {
      setSaving(
        false
      );
    }
  }

  function addAssumption() {
    setSubmission(
      (current) => ({
        ...current,

        assumptions: [
          ...current.assumptions,
          "",
        ],
      })
    );
  }

  function addClass() {
    setSubmission(
      (current) => ({
        ...current,

        classes: [
          ...current.classes,
          {
            name: "",
            responsibility:
              "",
          },
        ],
      })
    );
  }

  function addInterface() {
    setSubmission(
      (current) => ({
        ...current,

        interfaces: [
          ...current.interfaces,
          {
            name: "",
            purpose: "",
            methods: [
              "",
            ],
          },
        ],
      })
    );
  }

  function addRelationship() {
    setSubmission(
      (current) => ({
        ...current,

        relationships: [
          ...current.relationships,
          {
            from:
              namedClasses[0] ??
              "",

            to:
              namedClasses[1] ??
              "",

            type:
              "DEPENDENCY",

            description:
              "",
          },
        ],
      })
    );
  }

  function addTradeOff() {
    setSubmission(
      (current) => ({
        ...current,

        tradeOffs: [
          ...current.tradeOffs,
          "",
        ],
      })
    );
  }

  function addEdgeCase() {
    setSubmission(
      (current) => ({
        ...current,

        edgeCases: [
          ...current.edgeCases,
          "",
        ],
      })
    );
  }

  function updateArrayItem(
    key:
      | "assumptions"
      | "tradeOffs"
      | "edgeCases",

    index: number,

    value: string
  ) {
    setSubmission(
      (current) => ({
        ...current,

        [key]:
          current[key].map(
            (
              item,
              itemIndex
            ) =>
              itemIndex ===
              index
                ? value
                : item
          ),
      })
    );
  }

  function removeArrayItem(
    key:
      | "assumptions"
      | "tradeOffs"
      | "edgeCases",

    index: number
  ) {
    setSubmission(
      (current) => ({
        ...current,

        [key]:
          current[key].filter(
            (
              _,
              itemIndex
            ) =>
              itemIndex !==
              index
          ),
      })
    );
  }

  function updateRelationship(
    index: number,

    update:
      Partial<DesignRelationship>
  ) {
    setSubmission(
      (current) => ({
        ...current,

        relationships:
          current.relationships.map(
            (
              relationship,
              itemIndex
            ) =>
              itemIndex ===
              index
                ? {
                    ...relationship,
                    ...update,
                  }
                : relationship
          ),
      })
    );
  }

  if (loading) {
    return (
      <main className="workspace-page">
        <div className="container">
          <div className="page-skeleton" />
        </div>
      </main>
    );
  }

  if (
    error &&
    !problem
  ) {
    return (
      <main className="workspace-page">
        <div className="container">
          <div className="error-box">
            {error}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="workspace-page">
      <div className="workspace-glow" />

      <div className="container">
        <div className="workspace-topbar">
          <Link
            to={`/problems/${slug}`}
            className="back-link"
          >
            <ArrowLeft
              size={16}
            />

            Challenge
          </Link>

          <div className="workspace-actions">
            <div className="attempt-pill">
              Attempt #
              {
                attempt?.attemptNumber
              }

              <span>
                {
                  attempt?.status
                }
              </span>
            </div>

            <button
              className="secondary-button"
              type="button"
              onClick={
                saveDraft
              }
              disabled={
                saving
              }
            >
              {saved ? (
                <Check
                  size={17}
                />
              ) : (
                <Save
                  size={17}
                />
              )}

              {saving
                ? "Saving..."
                : saved
                  ? "Saved"
                  : "Save draft"}
            </button>

            <button
              className="primary-button"
              type="button"
              onClick={
                async () => {
                  await saveDraft();

                  navigate(
                    `/workspace/${slug}/${attemptId}/review`
                  );
                }
              }
            >
              Review & submit

              <Send
                size={17}
              />
            </button>
          </div>
        </div>

        <section className="workspace-heading">
          <div>
            <span className="section-label">
              Design workspace
            </span>

            <h1>
              {problem?.title}
            </h1>

            <p>
              Explain your design
              decisions. The
              evaluator judges
              reasoning, not pattern
              memorisation.
            </p>
          </div>

          <div className="workspace-progress">
            <span>
              {
                submission.classes.filter(
                  (item) =>
                    item.name.trim()
                ).length
              }
            </span>

            classes mapped
          </div>
        </section>

        {error && (
          <div className="error-box workspace-error">
            {error}
          </div>
        )}

        <div className="workspace-layout">
          <div className="workspace-editor">

            <section className="editor-card">
              <div className="editor-title">
                <Lightbulb
                  size={19}
                />

                <div>
                  <h2>
                    Requirement understanding
                  </h2>

                  <p>
                    Summarise what
                    the system must
                    accomplish.
                  </p>
                </div>
              </div>

              <textarea
                className="workspace-textarea workspace-textarea--large"
                value={
                  submission.requirementUnderstanding
                }
                onChange={
                  (event) =>
                    setSubmission(
                      (
                        current
                      ) => ({
                        ...current,

                        requirementUnderstanding:
                          event
                            .target
                            .value,
                      })
                    )
                }
                placeholder="Explain the main responsibilities, actors and system behaviour..."
              />
            </section>

            <section className="editor-card">
              <EditorHeader
                icon={
                  <Check
                    size={
                      18
                    }
                  />
                }
                title="Assumptions"
                action={
                  addAssumption
                }
              />

              <StringEditor
                items={
                  submission.assumptions
                }
                placeholder="Example: every vehicle has a unique registration number"
                onChange={
                  (
                    index,
                    value
                  ) =>
                    updateArrayItem(
                      "assumptions",
                      index,
                      value
                    )
                }
                onRemove={
                  (index) =>
                    removeArrayItem(
                      "assumptions",
                      index
                    )
                }
              />
            </section>

            <section className="editor-card">
              <EditorHeader
                icon={
                  <Boxes
                    size={
                      18
                    }
                  />
                }
                title="Classes & responsibilities"
                action={
                  addClass
                }
              />

              <div className="entity-list">
                {submission.classes.map(
                  (
                    item,
                    index
                  ) => (
                    <div
                      className="entity-row"
                      key={
                        index
                      }
                    >
                      <input
                        value={
                          item.name
                        }
                        placeholder="Class name"
                        onChange={
                          (
                            event
                          ) =>
                            setSubmission(
                              (
                                current
                              ) => ({
                                ...current,

                                classes:
                                  current.classes.map(
                                    (
                                      value,
                                      itemIndex
                                    ) =>
                                      itemIndex ===
                                      index
                                        ? {
                                            ...value,

                                            name:
                                              event
                                                .target
                                                .value,
                                          }
                                        : value
                                  ),
                              })
                            )
                        }
                      />

                      <textarea
                        value={
                          item.responsibility
                        }
                        placeholder="What responsibility does this class own?"
                        onChange={
                          (
                            event
                          ) =>
                            setSubmission(
                              (
                                current
                              ) => ({
                                ...current,

                                classes:
                                  current.classes.map(
                                    (
                                      value,
                                      itemIndex
                                    ) =>
                                      itemIndex ===
                                      index
                                        ? {
                                            ...value,

                                            responsibility:
                                              event
                                                .target
                                                .value,
                                          }
                                        : value
                                  ),
                              })
                            )
                        }
                      />

                      <button
                        type="button"
                        className="delete-button"
                        onClick={
                          () =>
                            setSubmission(
                              (
                                current
                              ) => ({
                                ...current,

                                classes:
                                  current.classes.filter(
                                    (
                                      _,
                                      itemIndex
                                    ) =>
                                      itemIndex !==
                                      index
                                  ),
                              })
                            )
                        }
                      >
                        <Trash2
                          size={
                            15
                          }
                        />
                      </button>
                    </div>
                  )
                )}
              </div>
            </section>

            <section className="editor-card">
              <EditorHeader
                icon={
                  <GitBranch
                    size={
                      18
                    }
                  />
                }
                title="Interfaces"
                action={
                  addInterface
                }
              />

              <div className="entity-list">
                {submission.interfaces.map(
                  (
                    item,
                    index
                  ) => (
                    <div
                      className="interface-editor"
                      key={
                        index
                      }
                    >
                      <input
                        value={
                          item.name
                        }
                        placeholder="Interface name"
                        onChange={
                          (
                            event
                          ) =>
                            setSubmission(
                              (
                                current
                              ) => ({
                                ...current,

                                interfaces:
                                  current.interfaces.map(
                                    (
                                      value,
                                      itemIndex
                                    ) =>
                                      itemIndex ===
                                      index
                                        ? {
                                            ...value,

                                            name:
                                              event
                                                .target
                                                .value,
                                          }
                                        : value
                                  ),
                              })
                            )
                        }
                      />

                      <textarea
                        value={
                          item.purpose
                        }
                        placeholder="Why does this variation point exist?"
                        onChange={
                          (
                            event
                          ) =>
                            setSubmission(
                              (
                                current
                              ) => ({
                                ...current,

                                interfaces:
                                  current.interfaces.map(
                                    (
                                      value,
                                      itemIndex
                                    ) =>
                                      itemIndex ===
                                      index
                                        ? {
                                            ...value,

                                            purpose:
                                              event
                                                .target
                                                .value,
                                          }
                                        : value
                                  ),
                              })
                            )
                        }
                      />

                      <input
                        value={
                          item.methods[0] ??
                          ""
                        }
                        placeholder="Method e.g. findSpot(vehicleType)"
                        onChange={
                          (
                            event
                          ) =>
                            setSubmission(
                              (
                                current
                              ) => ({
                                ...current,

                                interfaces:
                                  current.interfaces.map(
                                    (
                                      value,
                                      itemIndex
                                    ) =>
                                      itemIndex ===
                                      index
                                        ? {
                                            ...value,

                                            methods:
                                              [
                                                event
                                                  .target
                                                  .value,
                                              ],
                                          }
                                        : value
                                  ),
                              })
                            )
                        }
                      />
                    </div>
                  )
                )}
              </div>
            </section>

            <section className="editor-card">
              <EditorHeader
                icon={
                  <GitBranch
                    size={
                      18
                    }
                  />
                }
                title="Relationships"
                action={
                  addRelationship
                }
              />

              <div className="relationship-list">
                {submission.relationships.map(
                  (
                    relationship,
                    index
                  ) => (
                    <div
                      className="relationship-row"
                      key={
                        index
                      }
                    >
                      <input
                        placeholder="From"
                        value={
                          relationship.from
                        }
                        onChange={
                          (
                            event
                          ) =>
                            updateRelationship(
                              index,
                              {
                                from:
                                  event
                                    .target
                                    .value,
                              }
                            )
                        }
                      />

                      <select
                        value={
                          relationship.type
                        }
                        onChange={
                          (
                            event
                          ) =>
                            updateRelationship(
                              index,
                              {
                                type:
                                  event
                                    .target
                                    .value as DesignRelationship["type"],
                              }
                            )
                        }
                      >
                        <option value="ASSOCIATION">
                          Association
                        </option>

                        <option value="COMPOSITION">
                          Composition
                        </option>

                        <option value="AGGREGATION">
                          Aggregation
                        </option>

                        <option value="INHERITANCE">
                          Inheritance
                        </option>

                        <option value="DEPENDENCY">
                          Dependency
                        </option>
                      </select>

                      <input
                        placeholder="To"
                        value={
                          relationship.to
                        }
                        onChange={
                          (
                            event
                          ) =>
                            updateRelationship(
                              index,
                              {
                                to:
                                  event
                                    .target
                                    .value,
                              }
                            )
                        }
                      />

                      <textarea
                        placeholder="Explain this relationship"
                        value={
                          relationship.description
                        }
                        onChange={
                          (
                            event
                          ) =>
                            updateRelationship(
                              index,
                              {
                                description:
                                  event
                                    .target
                                    .value,
                              }
                            )
                        }
                      />
                    </div>
                  )
                )}
              </div>
            </section>

            <section className="editor-card">
              <EditorHeader
                icon={
                  <Lightbulb
                    size={
                      18
                    }
                  />
                }
                title="Trade-offs"
                action={
                  addTradeOff
                }
              />

              <StringEditor
                items={
                  submission.tradeOffs
                }
                placeholder="What complexity did you accept and why?"
                onChange={
                  (
                    index,
                    value
                  ) =>
                    updateArrayItem(
                      "tradeOffs",
                      index,
                      value
                    )
                }
                onRemove={
                  (index) =>
                    removeArrayItem(
                      "tradeOffs",
                      index
                    )
                }
              />
            </section>

            <section className="editor-card">
              <EditorHeader
                icon={
                  <Check
                    size={
                      18
                    }
                  />
                }
                title="Edge cases"
                action={
                  addEdgeCase
                }
              />

              <StringEditor
                items={
                  submission.edgeCases
                }
                placeholder="Example: no compatible parking spot exists"
                onChange={
                  (
                    index,
                    value
                  ) =>
                    updateArrayItem(
                      "edgeCases",
                      index,
                      value
                    )
                }
                onRemove={
                  (index) =>
                    removeArrayItem(
                      "edgeCases",
                      index
                    )
                }
              />
            </section>
          </div>

          <aside className="workspace-preview">
            <section className="preview-card">
              <span className="section-label">
                Live structure
              </span>

              <h3>
                Design map
              </h3>

              <p>
                Your core
                components appear
                here as you define
                them.
              </p>

              <div className="design-map">
                {namedClasses.length ===
                0 ? (
                  <div className="design-map-empty">
                    Add class names
                    to populate your
                    architecture.
                  </div>
                ) : (
                  namedClasses.map(
                    (
                      className,
                      index
                    ) => (
                      <div
                        className="design-node"
                        key={`${className}-${index}`}
                      >
                        <span />

                        {
                          className
                        }
                      </div>
                    )
                  )
                )}

                {submission.interfaces
                  .filter(
                    (item) =>
                      item.name.trim()
                  )
                  .map(
                    (
                      item,
                      index
                    ) => (
                      <div
                        className="design-node design-node--interface"
                        key={`${item.name}-${index}`}
                      >
                        <span />

                        {
                          item.name
                        }

                        <small>
                          interface
                        </small>
                      </div>
                    )
                  )}
              </div>
            </section>

            <section className="preview-card">
              <span className="section-label">
                Challenge
              </span>

              <h3>
                Requirements
              </h3>

              <ul className="workspace-requirements">
                {problem?.requirements.map(
                  (
                    requirement
                  ) => (
                    <li
                      key={
                        requirement
                      }
                    >
                      {
                        requirement
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

function EditorHeader({
  icon,
  title,
  action,
}: {
  icon:
    React.ReactNode;

  title:
    string;

  action:
    () => void;
}) {
  return (
    <div className="editor-header">
      <div className="editor-title editor-title--compact">
        {icon}

        <h2>
          {title}
        </h2>
      </div>

      <button
        type="button"
        className="add-button"
        onClick={
          action
        }
      >
        <Plus
          size={14}
        />

        Add
      </button>
    </div>
  );
}

function StringEditor({
  items,
  placeholder,
  onChange,
  onRemove,
}: {
  items: string[];

  placeholder:
    string;

  onChange:
    (
      index: number,
      value: string
    ) => void;

  onRemove:
    (
      index: number
    ) => void;
}) {
  return (
    <div className="string-editor">
      {items.map(
        (
          value,
          index
        ) => (
          <div
            className="string-row"
            key={
              index
            }
          >
            <input
              value={
                value
              }
              placeholder={
                placeholder
              }
              onChange={
                (event) =>
                  onChange(
                    index,
                    event
                      .target
                      .value
                  )
              }
            />

            <button
              type="button"
              className="delete-button"
              onClick={
                () =>
                  onRemove(
                    index
                  )
              }
            >
              <Trash2
                size={
                  14
                }
              />
            </button>
          </div>
        )
      )}
    </div>
  );
}