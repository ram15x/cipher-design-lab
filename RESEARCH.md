# Research Note — Cipher DesignLab

## 1. Problem

Low-Level Design practice is easy to begin but difficult to evaluate.

A learner can attempt a problem such as Parking Lot, Elevator System, Vending Machine, or Notification Service and create a seemingly reasonable collection of classes. The difficult part comes afterward:

- Are responsibilities assigned to the correct objects?
- Is one class doing too much?
- Are components unnecessarily coupled?
- Are interfaces representing meaningful variation points?
- Would the design survive a realistic requirement change?
- Are abstractions useful, or were patterns added only because they are familiar?
- What should the learner improve in the next attempt?

Unlike many algorithm problems, LLD does not normally have one canonical answer.

Two learners may produce substantially different designs while both making defensible decisions.

This makes simple reference-solution comparison a weak evaluation strategy.

The more useful learner question is:

> Why is this design reasonable, where is it weak, and what should I change on my next attempt?

---

## 2. Current Practice Approaches

I considered several common approaches used for LLD learning.

### Written articles and reference solutions

Many learners study solved examples and compare their own design manually with a published architecture.

Strengths:

- easy to consume
- useful for learning common patterns
- gives beginners examples of class decomposition

Weaknesses:

- encourages copying a reference architecture
- gives little feedback about the learner's own reasoning
- alternative valid designs may appear incorrect simply because they differ from the article

### Interview-style LLD practice

Another approach is to treat LLD as a mock interview.

The learner explains requirements, classes, relationships, and trade-offs while an interviewer provides feedback.

Strengths:

- reasoning becomes part of the evaluation
- follow-up requirement changes can test extensibility
- feedback can adapt to the submitted design

Weaknesses:

- requires another person
- difficult to practice repeatedly
- feedback quality depends on reviewer experience

### Diagram-centric tools

UML/class-diagram tools help learners model relationships visually.

Strengths:

- relationships are easier to understand
- useful representation for object structure
- diagrams expose coupling clearly

Weaknesses:

- a visually correct diagram does not prove good reasoning
- assumptions and trade-offs may be missing
- diagrams alone provide limited evidence for why decisions were made

### AI-assisted feedback

LLMs can analyze natural-language design explanations and generate contextual feedback.

Strengths:

- handles open-ended reasoning
- can discuss multiple valid designs
- can explain trade-offs and improvement opportunities

Weaknesses:

- unconstrained feedback may be inconsistent
- models can invent details not present in the submission
- asking an LLM for a generic score produces weak explainability
- provider failures and rate limits must be handled

---

## 3. Main Gaps

The largest gap I identified was not the absence of LLD content.

There is already a large amount of learning material.

The harder problem is creating a useful repeatable feedback loop.

A learner needs:

1. enough structure to explain a meaningful design;
2. freedom to produce different valid architectures;
3. feedback tied directly to the submitted evidence;
4. clear separation between objective problems and subjective design judgment;
5. a way to retry and observe improvement.

A platform that simply shows a reference answer does not provide this loop.

An AI chat box alone also does not solve it reliably because the model has no stable evaluation contract.

---

## 4. Product Direction

Cipher DesignLab therefore uses a structured LLD attempt rather than unrestricted text or a full coding environment.

A learner provides:

- requirement understanding
- assumptions
- classes
- class responsibilities
- interfaces
- relationships
- trade-offs
- edge cases

This format is intentionally narrow.

It contains enough evidence to judge important LLD decisions while remaining realistic for a two-day prototype.

---

## 5. Evaluation Direction

Evaluation is divided into deterministic and judgment-heavy concerns.

### Deterministic checks

Examples:

- duplicate class names
- missing structural information
- unknown relationship endpoints
- invalid attempt state transitions
- malformed evaluator output

These should not require an LLM.

### Judgment-heavy checks

Examples:

- whether responsibilities are cohesive
- whether coupling is reasonable
- whether an abstraction is justified
- quality of trade-off reasoning
- extensibility under requirement changes
- quality of explanation

These benefit from an LLM because multiple answers may be valid.

The final prototype combines both approaches through a hybrid evaluator.

---

## 6. Fixed Rubric

The evaluation uses eight dimensions:

1. Requirement Understanding
2. Class Responsibilities
3. Coupling / Cohesion
4. Encapsulation / Interfaces
5. Abstraction / Patterns
6. Extensibility
7. Edge Cases / Testability
8. Explanation Quality

This avoids asking the LLM an unconstrained question such as:

> Is this design good?

Each criterion instead returns:

- score
- evidence
- concern
- suggestion
- confidence

The final percentage is calculated by application code rather than directly generated by the model.

---

## 7. Evidence Grounding

A key risk with LLM feedback is hallucination.

For example, a model might criticize a `PaymentService` even if the learner never created such a class.

To reduce this problem, Cipher DesignLab converts the submission into a catalogue of valid evidence references.

The LLM may cite only those identifiers.

The backend validates every returned reference before accepting the evaluation.

This creates a stronger connection between generated feedback and the actual learner submission.

---

## 8. Learning Loop

The MVP is designed around repeated improvement:

```text
Choose Problem
      ↓
Design
      ↓
Submit
      ↓
Evaluate
      ↓
Review Feedback
      ↓
History
      ↓
Try Again