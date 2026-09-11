# Research Note — Cipher DesignLab

## 1. Problem

Low-Level Design practice is easy to begin but difficult to evaluate well.

A learner can attempt a problem such as Parking Lot, Elevator System, Vending Machine, or Notification Service and create a seemingly reasonable collection of classes. The difficult part comes afterward:

- Are responsibilities assigned to the right objects?
- Is one class doing too much?
- Are components unnecessarily coupled?
- Do interfaces represent meaningful variation points?
- Would the design survive a realistic requirement change?
- Are abstractions actually useful, or were patterns added simply because they are familiar?
- What should the learner improve in the next attempt?

Unlike many algorithm problems, LLD does not normally have one canonical answer.

Two learners may produce substantially different designs while both making defensible engineering decisions.

This makes simple comparison against a reference solution a weak evaluation strategy.

The more useful learner question is:

> **Why is this design reasonable, where is it weak, and what should I change in my next attempt?**

That question became the starting point for Cipher DesignLab.

---

## 2. Existing Ways to Practise LLD

Before deciding what to build, I considered several common ways learners currently practise Low-Level Design.

### Written Articles and Reference Solutions

A common approach is to study solved LLD problems and compare a personal solution with a published architecture.

**Strengths**

- easy to access;
- useful for discovering common design patterns;
- gives beginners examples of class decomposition;
- provides a reference when learning a new problem type.

**Weaknesses**

- can encourage copying the reference architecture;
- gives little feedback about the learner's own reasoning;
- alternative valid designs may appear incorrect simply because they differ from the published solution;
- does not naturally support repeated attempts and improvement.

Reference solutions are useful for learning, but they are weaker as an evaluation mechanism.

### Interview-Style LLD Practice

Another approach is to simulate an actual design interview.

The learner explains requirements, classes, relationships, assumptions, and trade-offs while an interviewer asks questions and provides feedback.

**Strengths**

- reasoning becomes part of the evaluation;
- follow-up requirements can test extensibility;
- feedback can adapt to the learner's actual design;
- incorrect assumptions can be challenged immediately.

**Weaknesses**

- requires another person;
- difficult to repeat frequently;
- feedback quality depends heavily on the reviewer;
- experienced reviewers or mentors may not always be available.

This provides strong feedback, but it is difficult to scale for independent practice.

### Diagram-Centric Tools

UML and class-diagram tools allow learners to model systems visually.

**Strengths**

- relationships are easier to understand;
- useful for representing object structure;
- diagrams can make coupling and dependencies visible;
- closer to how some design discussions happen in practice.

**Weaknesses**

- a visually correct diagram does not prove good reasoning;
- assumptions and trade-offs may be absent;
- a diagram does not necessarily explain why a class exists;
- diagrams alone provide limited evidence for evaluating design decisions.

Visual modelling is useful, but representation and evaluation are different problems.

### AI-Assisted Feedback

Large Language Models can analyse natural-language design explanations and generate contextual feedback.

**Strengths**

- suitable for open-ended reasoning;
- capable of discussing multiple valid approaches;
- can explain trade-offs;
- can provide suggestions specific to a learner's submission;
- makes repeated independent practice more practical.

**Weaknesses**

- unconstrained feedback may be inconsistent;
- models can invent details that were never submitted;
- generic prompts can produce vague feedback;
- asking an LLM for an arbitrary score gives poor explainability;
- external providers introduce latency, rate limits, and failure cases.

AI therefore looked useful, but not reliable enough to act as an unrestricted judge.

---

## 3. Main Gap Identified

The largest gap was not a lack of LLD learning material.

There is already a large amount of content explaining patterns, principles, and solved design problems.

The harder problem is creating a **repeatable feedback loop**.

A learner needs:

1. enough structure to explain a meaningful design;
2. freedom to produce different valid architectures;
3. feedback tied directly to what they actually submitted;
4. separation between objective mistakes and subjective design judgement;
5. concrete suggestions for improvement;
6. a way to attempt the problem again and observe progress.

A platform that only displays a reference answer does not provide this loop.

An unrestricted AI chat box does not fully solve it either because the model has no stable evaluation contract.

This led to the core product hypothesis:

> **LLD learners can improve faster when feedback evaluates their reasoning against a stable rubric, points to evidence in their own design, and gives a concrete direction for the next attempt.**

---

## 4. Product Direction

Cipher DesignLab therefore uses a structured LLD submission instead of unrestricted text or a complete coding environment.

A learner provides:

- requirement understanding;
- assumptions;
- classes;
- class responsibilities;
- interfaces;
- relationships;
- trade-offs;
- edge cases.

For example, instead of only writing:

```text
I would use ParkingLot, Vehicle and ParkingSpot.
```

the learner is encouraged to explain what each class is responsible for, how the classes interact, what assumptions were made, and what trade-offs were considered.

This creates better evidence for evaluation.

The format is intentionally narrow.

It contains enough information to evaluate important LLD decisions while remaining realistic for a focused prototype.

---

## 5. Why Not Build a Full Coding Platform?

A possible direction was to allow learners to write complete source code and then compile and execute it.

That was intentionally not chosen for the MVP.

Executing code introduces a different set of problems:

- sandboxing;
- language support;
- compilation;
- runtime security;
- test execution;
- resource limits;
- infrastructure management.

Those are interesting engineering problems, but they do not directly answer the main research question:

> Can structured, evidence-backed feedback create a useful LLD improvement loop?

For this prototype, reasoning was therefore prioritised over executable implementation.

---

## 6. Why Not Require a Full UML Editor?

A drag-and-drop UML editor was also considered.

It could make class relationships easier to visualise, but building a strong diagram editor would consume significant development time.

More importantly, a diagram shows **what** the learner designed but may not explain **why**.

For the MVP, structured forms provide enough information to capture:

```text
Classes
+
Responsibilities
+
Interfaces
+
Relationships
+
Trade-offs
+
Edge Cases
```

The submission model can still be extended later to support diagram-based evidence.

---

## 7. Evaluation Direction

Evaluation is divided into two categories:

```text
Objective / deterministic checks
              +
Judgement-heavy design review
```

### Deterministic Checks

Some problems can be detected reliably by application code.

Examples include:

- duplicate class names;
- missing structural information;
- relationships referencing unknown classes;
- invalid attempt state transitions;
- malformed evaluator output;
- invalid evidence references.

These checks should not require an LLM.

Using deterministic code makes them predictable and testable.

### Judgement-Heavy Checks

Other questions do not have simple yes/no answers.

Examples include:

- Are class responsibilities cohesive?
- Is coupling reasonable?
- Is an abstraction justified?
- Are interfaces useful?
- Are trade-offs explained well?
- Would the design handle realistic changes?
- Are edge cases considered thoughtfully?
- Is the learner's reasoning clear?

These questions benefit from an LLM because multiple answers may be valid.

The final prototype therefore combines both approaches through a **hybrid evaluator**.

---

## 8. Why Hybrid Evaluation?

Using only deterministic rules would be too rigid.

A rule engine can detect something like:

```text
Relationship references unknown class "PaymentService"
```

but it cannot reliably determine whether a particular responsibility split is a sensible design decision.

Using only an LLM creates the opposite problem.

The model may provide useful reasoning, but its output can vary and must not be blindly trusted.

The hybrid approach gives each technique the job it is better suited for:

```text
Learner Submission
        ↓
Composite Evaluation
      /          \
     ↓            ↓
Rule Checks    LLM Review
     \            /
      \          /
       ↓        ↓
      Final Feedback
```

This also keeps the two evaluation strategies independently replaceable and testable.

---

## 9. Fixed Evaluation Rubric

A major decision was to avoid asking the LLM a vague question such as:

> Is this design good?

Instead, every submission is evaluated using the same eight dimensions:

1. Requirement Understanding
2. Class Responsibilities
3. Coupling / Cohesion
4. Encapsulation / Interfaces
5. Abstraction / Patterns
6. Extensibility
7. Edge Cases / Testability
8. Explanation Quality

Each criterion returns:

- score;
- evidence references;
- evidence explanation;
- concern;
- suggestion;
- confidence.

Each dimension is scored from 0 to 5.

The final percentage is then calculated by application code.

For example:

```text
Total criterion score = 30
Maximum score         = 40

Overall score = 30 / 40 × 100
              = 75%
```

The LLM therefore evaluates individual design dimensions rather than inventing an unrestricted 0–100 score.

---

## 10. Evidence-Grounded Feedback

One of the most important risks identified with LLM evaluation was hallucination.

For example, the model might say:

```text
PaymentService has too many responsibilities.
```

even though the learner never created a `PaymentService`.

That would make the feedback misleading.

Cipher DesignLab therefore converts the learner submission into a catalogue of valid evidence references.

Examples might include:

```text
section:requirement-understanding
class:ParkingLot
class:Vehicle
interface:ParkingStrategy
relationship:0
tradeoff:0
edge-case:0
```

The model is instructed to cite only those references.

After the model responds, the backend validates every returned evidence reference.

The flow becomes:

```text
Learner Submission
        ↓
Evidence Catalogue
        ↓
LLM Evaluation
        ↓
Structured Response
        ↓
Schema Validation
        ↓
Evidence Validation
        ↓
Accepted Evaluation
```

If the AI invents an evidence reference, the response is rejected instead of silently becoming learner feedback.

This does not eliminate every possible LLM error, but it provides an important grounding mechanism.

---

## 11. Treating AI Output as Untrusted Input

Another research conclusion was that prompt instructions alone are not sufficient validation.

Even if the model is told:

```text
Return JSON only.
```

the application should still assume that the response may be incorrect.

The backend therefore checks:

- whether a response exists;
- whether JSON can be extracted;
- whether the structure matches the expected schema;
- whether all required rubric criteria exist;
- whether criteria were duplicated;
- whether evidence references are valid.

Only after those checks does the response become application data.

This follows the same principle used with any external service:

> Validate data at the boundary instead of trusting the provider.

---

## 12. Extensibility as an Evaluation Target

A design may work perfectly for the current requirements and still be difficult to change.

Because of this, each problem can contain change scenarios.

For example:

```text
What if another parking allocation strategy is introduced?

What if pricing rules differ by vehicle type?

What if multiple notification channels are added?
```

The learner's design can then be evaluated against realistic future changes.

This is more useful than rewarding abstractions simply because a known design pattern was used.

The question becomes:

> Does this abstraction protect a real variation point?

rather than:

> How many patterns did the learner use?

---

## 13. Learning Loop

The MVP is designed around repeated improvement.

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
      ↓
Improved Attempt
```

Attempt history is therefore part of the learning model rather than simply an activity log.

A learner should eventually be able to observe progression such as:

```text
Attempt 1
Extensibility: 2/5

        ↓

Feedback:
Allocation behaviour is tightly coupled
to ParkingLot.

        ↓

Attempt 2
Introduce a meaningful strategy boundary.

        ↓

Extensibility: 4/5
```

The value comes from the relationship between **feedback and the next attempt**.

---

## 14. Evaluation Failure Is Different From Learner Failure

External AI providers can fail.

During development, realistic failure cases included:

- rate limiting;
- slow responses;
- timeouts;
- provider errors;
- malformed responses.

These failures should not imply that the learner's design is bad.

The product therefore distinguishes:

```text
Learner submitted successfully
            ↓
Evaluation infrastructure failed
```

from:

```text
Learner submitted successfully
            ↓
Evaluation completed
            ↓
Design received critical feedback
```

A failed evaluation can be retried without requiring the learner to recreate the solution.

This preserves an important product principle:

> **Infrastructure failure should not be treated as learner failure.**

---

## 15. Retry Evaluation vs Try Again

Researching the learner flow also revealed that these actions represent different intentions.

### Retry Evaluation

Used when evaluation failed for a technical reason.

```text
Same learner design
Same attempt
New evaluation execution
```

### Try Again

Used when the learner wants to improve the design.

```text
Previous Attempt
       ↓
Feedback
       ↓
New Attempt
       ↓
Modified Design
```

Keeping these actions separate prevents infrastructure problems from polluting learner progress history.

---

## 16. Scope Decisions

Several features were deliberately excluded from the MVP:

- authentication;
- collaborative editing;
- full code execution;
- drag-and-drop UML editor;
- Kafka-based workers;
- microservices;
- advanced analytics;
- production observability.

These could be useful in a larger platform, but they do not improve the core prototype enough to justify their implementation cost.

The MVP instead focuses on:

- structured learner evidence;
- clear domain boundaries;
- explainable evaluation;
- hybrid AI and deterministic checks;
- failure handling;
- attempt history;
- repeated improvement;
- extensibility.

This keeps the prototype centred on the actual research question rather than the number of implemented features.

---

## 17. Known Limitations

The current prototype intentionally does not solve every problem required by a production learning platform.

Current limitations include:

- fixed demo learner instead of authentication;
- no complete class-diagram editor;
- no source-code compiler or execution environment;
- no human evaluator;
- no durable background queue;
- dependency on an external AI provider;
- limited production metrics and tracing;
- no collaborative editing;
- no automatic visual comparison between attempts;
- a relatively small problem catalogue.

These limitations provide clear directions for future iterations without blocking evaluation of the core learner experience.

---

## 18. Future Research Questions

If Cipher DesignLab were developed further, several questions would be worth testing.

### Does structured feedback improve the next attempt?

The most important measure is not whether learners like the feedback.

It is whether their next design becomes better.

### Which rubric dimensions improve fastest?

Learners may improve quickly at identifying classes but struggle longer with coupling, extensibility, or trade-off reasoning.

Tracking this could make future practice more personalised.

### How consistent is AI evaluation?

The same design could be evaluated repeatedly to measure score and feedback stability.

This would help determine where stronger deterministic rules or additional validation are needed.

### Can diagrams become another evidence source?

A future submission could include:

```text
Structured Text
      +
Class Diagram
      +
Optional Code
```

Each representation could contribute evidence to the same evaluation pipeline.

### When should human feedback be introduced?

AI feedback could eventually complement rather than replace mentors.

For example:

```text
Independent Practice
        ↓
AI Feedback
        ↓
Repeated Attempts
        ↓
Mentor Review for Advanced Designs
```

This could reserve human review for situations where it provides the most value.

---

## 19. Product Hypothesis

The final hypothesis behind Cipher DesignLab is:

> **LLD learners improve faster when feedback evaluates their reasoning against a stable rubric, points to evidence in their own design, distinguishes objective problems from subjective judgement, and provides a concrete direction for the next attempt.**

The prototype is designed to test that learning loop rather than recreate a complete learning management system.

---

## 20. Research Conclusion

The main conclusion from this exploration is that the difficult part of an LLD practice platform is not displaying problems or collecting class names.

The difficult part is creating feedback that is:

- flexible enough to accept multiple valid designs;
- structured enough to remain consistent;
- grounded enough to be explainable;
- reliable enough to handle AI failures;
- useful enough to influence the learner's next attempt.

That led to the final product direction:

```text
Structured Submission
        +
Deterministic Checks
        +
LLM Design Judgement
        +
Evidence Grounding
        +
Stable Rubric
        +
Attempt History
        +
Repeated Improvement
```

Cipher DesignLab is intentionally a focused prototype.

Its purpose is not to automate every part of software-design education.

Its purpose is to explore whether **structured, evidence-backed feedback can make independent Low-Level Design practice more useful and repeatable**.