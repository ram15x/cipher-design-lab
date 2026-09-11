
This positioning is important because CipherSchools explicitly says a simple monolith is acceptable and wants emphasis on classes, responsibilities, interfaces, behavior and extensibility rather than unnecessary HLD complexity. :contentReference[oaicite:1]{index=1}

---

# 3. `AI_USAGE.md`

This one matters because they specifically ask for **3–5 meaningful AI-assisted decisions, what AI suggested, and what we accepted/rejected and why**. :contentReference[oaicite:2]{index=2}

Paste:

```markdown
# AI Usage

AI tools were used during this assignment as an engineering assistant for brainstorming, reviewing architecture decisions, debugging, and accelerating implementation.

The suggestions were not treated as authoritative. Decisions were accepted, changed, or rejected based on the assignment constraints and the behaviour required from the product.

Below are five meaningful examples.

---

## 1. Evaluation Architecture

### AI suggestion

Separate deterministic checks from LLM-based design judgement.

The proposed architecture introduced an `Evaluator` abstraction with multiple implementations.

### Decision

Accepted.

The final architecture contains:

- `RuleBasedEvaluator`
- `OpenRouterLlmEvaluator`
- `CompositeEvaluator`

### Why

Some checks are objectively verifiable while others require design judgement.

For example:

Deterministic:

- duplicate classes
- invalid relationship references
- missing structural evidence
- attempt state transitions

Judgement-heavy:

- quality of responsibilities
- coupling/cohesion
- abstraction choices
- trade-offs
- extensibility

Keeping those concerns separate makes evaluation easier to test and allows another evaluation strategy to be introduced later.

---

## 2. AI Scoring

### AI suggestion

An early idea was to ask an LLM to evaluate the complete design and directly produce a percentage score.

### Decision

Rejected.

### Why

A single unconstrained AI score would be difficult to explain and inconsistent across valid design approaches.

Instead, the final implementation uses eight fixed rubric dimensions.

The model scores each dimension from 0–5.

The backend calculates the final percentage deterministically.

This means the LLM does not directly decide an arbitrary 0–100 score.

---

## 3. Evidence-Grounded Feedback

### AI suggestion

Create an evidence catalogue from learner submission fields and require AI feedback to reference those identifiers.

### Decision

Accepted and strengthened.

### Why

LLMs may generate plausible feedback about components that were never actually included in the learner's design.

The application therefore:

1. creates valid evidence identifiers from the submission;
2. supplies them to the model;
3. requires evidence references in structured output;
4. validates returned identifiers after the response.

An AI response containing invented evidence is rejected rather than silently stored.

---

## 4. Evaluation Infrastructure

### AI suggestion

Possible approaches discussed included a message broker / worker architecture for asynchronous evaluation.

### Decision

A production queue was rejected for the prototype.

An `EvaluationDispatcher` abstraction was retained, but the implementation uses an in-process asynchronous dispatcher.

### Why

The assignment is primarily a Low-Level Design exercise.

Introducing Kafka, worker services and distributed queue infrastructure would increase operational complexity without improving the core learner workflow enough for the two-day MVP.

The abstraction still provides a clear replacement point if the product later requires durable asynchronous processing.

---

## 5. Evaluation Failure Recovery

### AI suggestion

When an AI evaluation fails, create another learner attempt and re-submit the solution.

### Decision

Rejected.

### Final design

A failed evaluation can return:

```text
FAILED → SUBMITTED → EVALUATING