# Design Note — Cipher DesignLab

## 1. Overview

Cipher DesignLab is a focused Low-Level Design (LLD) practice platform.

The purpose of the product is simple:

> Give learners a structured environment where they can practise software design, receive meaningful feedback, understand their weaknesses, and improve through repeated attempts.

The platform is intentionally not designed as a complete Learning Management System (LMS).

It does not try to solve unrelated problems such as course management, video lessons, certificates, payments, attendance, or large-scale classroom administration.

Instead, the MVP concentrates on one learning loop:

```text
Understand a design problem
        ↓
Create a solution
        ↓
Explain the reasoning
        ↓
Submit the design
        ↓
Receive structured feedback
        ↓
Understand weaknesses
        ↓
Try again
        ↓
Improve
```

This narrow scope influenced many of the architecture decisions described in this document.

---

# 2. MVP Capabilities

The MVP allows a learner to:

1. browse available Low-Level Design problems;
2. open a problem and understand its requirements;
3. start a new design attempt;
4. describe the design using a structured workspace;
5. save unfinished work as a draft;
6. review the design before submission;
7. submit the attempt for evaluation;
8. receive asynchronous hybrid evaluation;
9. inspect criterion-level feedback;
10. understand which parts of the submission support that feedback;
11. recover from an evaluation failure without losing the submission;
12. inspect previous attempts;
13. start another attempt and improve the design.

The central domain objects are therefore not courses or lessons.

They are primarily:

```text
Problem
Attempt
Evaluation
```

These three concepts represent the core learning workflow.

---

# 3. Product Flow

The main learner journey is:

```text
Problem Library
        ↓
Problem Details
        ↓
Start Attempt
        ↓
      DRAFT
        ↓
Structured Design Workspace
        ↓
Save Draft
        ↓
Review Submission
        ↓
Submit
        ↓
    SUBMITTED
        ↓
    EVALUATING
        ↓
 ┌─────────────────────┐
 │ Hybrid Evaluation   │
 └─────────────────────┘
        ↓
 ┌─────────────────────┐
 │ Rule-Based Evaluator│
 └─────────────────────┘
          +
 ┌─────────────────────┐
 │ LLM Evaluator       │
 └─────────────────────┘
        ↓
 Composite Evaluation
        ↓
 ┌───────────┬─────────┐
 │ COMPLETED │ FAILED  │
 └───────────┴─────────┘
        ↓
Feedback / Recovery
        ↓
Attempt History
        ↓
Try Again
        ↓
New Attempt
```

The important idea is that evaluation is only one part of the learning loop.

The final goal is not simply to produce a score.

The goal is to help the learner understand what could be improved in the **next attempt**.

---

# 4. Structured Design Submission

A learner does not submit one large free-form paragraph.

Instead, the design is represented using a `StructuredSubmission`.

It contains:

```text
requirementUnderstanding
assumptions
classes
interfaces
relationships
tradeOffs
edgeCases
```

For example, a Parking Lot design might contain:

```text
Requirement Understanding
    ↓
"The system manages vehicle entry, parking allocation,
tickets, occupancy and exit."

Classes
    ↓
ParkingLot
ParkingSpot
Vehicle
ParkingTicket
FeeCalculator

Interfaces
    ↓
ParkingStrategy

Relationships
    ↓
ParkingLot → ParkingSpot
ParkingLot → ParkingStrategy
ParkingTicket → Vehicle

Trade-offs
    ↓
Using ParkingStrategy introduces another abstraction,
but allows allocation behaviour to change independently.

Edge Cases
    ↓
Parking lot full
Invalid ticket
Duplicate vehicle entry
No compatible parking spot
```

## Why structured input?

A completely free-form design submission would be easier to build initially, but harder to evaluate consistently.

Structured input provides several advantages.

### Better learner thinking

The learner is encouraged to think separately about:

- requirements;
- responsibilities;
- abstractions;
- relationships;
- trade-offs;
- failure scenarios.

### Better validation

The backend can detect structural problems without relying on AI.

### Better evaluation

The evaluator can reason about specific parts of the learner's design.

### Better evidence grounding

Feedback can refer to identifiable parts of the submission.

### Future extensibility

The representation can later be expanded to support diagrams or richer modelling information.

---

# 5. High-Level Code Organisation

The backend is organised into layers with different responsibilities.

Conceptually:

```text
┌───────────────────────────────────────────┐
│              Presentation                 │
│                                           │
│ HTTP routes, request validation, response │
└─────────────────────┬─────────────────────┘
                      │
                      ▼
┌───────────────────────────────────────────┐
│               Application                 │
│                                           │
│ Use cases and workflow orchestration      │
└─────────────────────┬─────────────────────┘
                      │
                      ▼
┌───────────────────────────────────────────┐
│                  Domain                   │
│                                           │
│ Business rules, entities and interfaces   │
└─────────────────────┬─────────────────────┘
                      │
                      ▼
┌───────────────────────────────────────────┐
│              Infrastructure               │
│                                           │
│ MongoDB, OpenRouter, dispatcher, adapters │
└───────────────────────────────────────────┘
```

This separation is not intended to make the application look artificially complex.

Its purpose is to keep important business rules independent from infrastructure details.

For example, an `Attempt` should know whether it is legal to move from `DRAFT` to `SUBMITTED`.

It should not need to know how MongoDB works.

Similarly, evaluation logic should not need to know how an Express HTTP request was received.

---

# 6. The `Problem` Domain

A `Problem` describes the design challenge that the learner must solve.

A problem contains information such as:

- title;
- slug;
- difficulty;
- brief;
- requirements;
- constraints;
- change scenarios.

The change scenarios are particularly important for LLD evaluation.

A design may satisfy today's requirements while being difficult to modify tomorrow.

For example, a Parking Lot problem might ask the learner to consider what happens if:

- a new vehicle type is introduced;
- a different parking allocation strategy is required;
- pricing rules change.

These scenarios help evaluate whether the learner's design has reasonable extension points.

The evaluator should not demand one specific architecture.

Instead, it should examine whether the learner's own design can reasonably accommodate the expected changes.

---

# 7. The `Attempt` Domain Model

`Attempt` is one of the most important domain objects in Cipher DesignLab.

It represents one learner's solution to one problem.

An attempt contains information such as:

```text
id
learnerId
problemId
problemSlug
attemptNumber
status
submission
previousAttemptId
submittedAt
createdAt
updatedAt
```

The object is not simply a database record.

It also protects important business rules.

For example, an attempt decides whether:

- a draft may be edited;
- an attempt may be submitted;
- evaluation may begin;
- evaluation may complete;
- evaluation may fail;
- a failed evaluation may be retried.

These rules live close to the domain object because they describe the lifecycle of an attempt itself.

---

# 8. Attempt State Machine

An attempt moves through explicit states.

The normal successful lifecycle is:

```text
DRAFT
   ↓
SUBMITTED
   ↓
EVALUATING
   ↓
COMPLETED
```

A failure may produce:

```text
DRAFT
   ↓
SUBMITTED
   ↓
EVALUATING
   ↓
FAILED
```

A failed evaluation can be retried:

```text
FAILED
   ↓
SUBMITTED
   ↓
EVALUATING
   ↓
COMPLETED
```

or, if evaluation fails again:

```text
FAILED
   ↓
SUBMITTED
   ↓
EVALUATING
   ↓
FAILED
```

## Why use explicit states?

Without explicit state rules, accidental behaviour becomes possible.

For example:

```text
COMPLETED → edit draft
```

should not be allowed.

Neither should:

```text
COMPLETED → submit again
```

Similarly:

```text
DRAFT → COMPLETED
```

would make no sense because evaluation never occurred.

The `Attempt` domain model therefore protects these transitions.

For example:

- only `DRAFT` can be edited;
- only `DRAFT` can initially be submitted;
- only `SUBMITTED` can begin evaluation;
- only `EVALUATING` can become `COMPLETED`;
- only `EVALUATING` can become `FAILED`;
- only `FAILED` can prepare an evaluation retry.

This prevents invalid application states even if another part of the system accidentally attempts an illegal operation.

---

# 9. Why Evaluation Failure Does Not Create a New Attempt

This distinction is important.

Consider:

```text
Attempt 4
    ↓
Learner submits successfully
    ↓
AI provider times out
```

The learner did not fail to submit a design.

The infrastructure failed to evaluate it.

Creating `Attempt 5` would therefore incorrectly suggest that the learner made another design attempt.

Instead:

```text
Attempt 4
status = FAILED
```

can be prepared for another evaluation.

The same learner submission remains associated with the same attempt.

This separates two different concepts:

```text
Learner work
```

from:

```text
Evaluation execution
```

A simple analogy is an online exam.

If a student successfully submits an exam but the grading server crashes, the student should not be forced to take the exam again.

The grading process should be retried.

Cipher DesignLab follows the same principle.

---

# 10. `AttemptService`

The domain object protects rules, while `AttemptService` coordinates application use cases.

Examples include:

```text
startAttempt()
getAttempt()
updateDraft()
submitAttempt()
getLearnerHistory()
prepareEvaluationRetry()
```

The service coordinates repositories and domain objects.

For example, starting an attempt conceptually looks like:

```text
Request to start attempt
        ↓
Find Problem
        ↓
Count learner's previous attempts
        ↓
Create Attempt
        ↓
Assign attempt number
        ↓
Persist Attempt
        ↓
Return result
```

The service does not duplicate the state rules owned by `Attempt`.

Instead, it asks the domain object to perform operations such as:

```text
attempt.updateDraft(...)
attempt.submit()
attempt.retryEvaluation()
```

This keeps workflow coordination and domain rules separate.

---

# 11. Repository Abstractions

Persistence is hidden behind repository interfaces.

Conceptually:

```text
Application
     ↓
AttemptRepository
     ↓
MongoAttemptRepository
     ↓
MongoDB
```

The application depends on the repository abstraction rather than directly writing MongoDB queries throughout the business logic.

The same principle applies to other persistent domain information.

## Why?

MongoDB is an implementation choice.

The learner-attempt rules are business rules.

Those concerns should not become unnecessarily coupled.

If persistence changed later, the core attempt lifecycle should not need to be redesigned.

It also makes domain and application logic easier to test without requiring a real database for every test.

---

# 12. Evaluation Architecture

Evaluating an LLD submission is difficult because it contains two different kinds of questions.

Some questions are objective.

For example:

```text
Does this relationship reference a class that exists?
```

Other questions require judgement.

For example:

```text
Is this class taking on too many responsibilities?
```

Cipher DesignLab therefore uses a hybrid evaluation architecture.

```text
                EvaluationContext
                       │
                       ▼
              CompositeEvaluator
                 /           \
                /             \
               ▼               ▼
     RuleBasedEvaluator   LLM Evaluator
               \               /
                \             /
                 ▼           ▼
              Combined Result
```

This allows deterministic logic and AI judgement to complement each other.

---

# 13. The `Evaluator` Abstraction

Evaluation strategies implement a common evaluator contract.

Conceptually:

```text
Evaluator
   │
   ├── RuleBasedEvaluator
   │
   └── OpenRouterLlmEvaluator
```

The application can therefore work with an evaluator without depending on the internal implementation.

This creates a real extension point.

Future evaluators could include:

```text
StaticAnalysisEvaluator
DiagramEvaluator
CodeEvaluator
AlternativeLlmEvaluator
```

without requiring the entire evaluation workflow to be rewritten.

The abstraction exists because evaluation strategy is genuinely expected to vary.

---

# 14. Rule-Based Evaluation

`RuleBasedEvaluator` handles checks that should not require probabilistic AI judgement.

Examples include structural conditions such as:

- duplicate class definitions;
- relationships referencing unknown design elements;
- missing structural evidence;
- inconsistencies that can be determined directly from submitted data.

The rule evaluator is deterministic.

The same input should produce the same structural findings.

This is useful because objective validation should not become less reliable merely because an external AI model behaves differently.

---

# 15. LLM-Based Evaluation

`OpenRouterLlmEvaluator` handles the qualitative side of design review.

The evaluator considers eight fixed criteria:

```text
REQUIREMENT_UNDERSTANDING
CLASS_RESPONSIBILITIES
COUPLING_COHESION
ENCAPSULATION_INTERFACES
ABSTRACTION_PATTERNS
EXTENSIBILITY
EDGE_CASES_TESTABILITY
EXPLANATION_QUALITY
```

Each criterion receives a score from:

```text
0 to 5
```

where the scale ranges from missing/fundamentally problematic to excellent.

The AI is not asked:

```text
"Is this design good?"
```

That question is too vague.

Instead, it evaluates the design against a known rubric.

---

# 16. Deterministic Final Score

The LLM does not directly decide the final percentage.

Suppose the eight criterion scores are:

```text
5
4
4
4
4
4
4
3
```

The backend calculates:

```text
Total = 32
Maximum = 40

32 / 40 × 100 = 80%
```

Therefore:

```text
Overall Score = 80%
```

This creates a clearer relationship between criterion scores and the final result.

The LLM provides qualitative judgement inside the rubric.

The application remains responsible for the final mathematical calculation.

---

# 17. Evidence-Grounded AI Feedback

AI feedback should be based on the learner's actual submission.

Before evaluation, the structured submission is converted into an evidence catalogue.

Conceptually:

```text
section:requirement-understanding
class:ParkingLot
class:Vehicle
interface:ParkingStrategy
relationship:ParkingLot->ParkingStrategy
tradeoff:0
edgecase:0
```

The exact catalogue is derived from the learner's submitted design.

The LLM is told that these are the valid pieces of evidence it may reference.

The response includes `evidenceRefs`.

The backend then validates those references.

The process is:

```text
Structured Submission
        ↓
Build Evidence Catalogue
        ↓
Send Problem + Evidence to LLM
        ↓
Receive Structured Evaluation
        ↓
Validate Response Schema
        ↓
Validate Rubric Criteria
        ↓
Validate Evidence References
        ↓
Calculate Overall Score
        ↓
Accept Evaluation
```

If the AI invents a reference that does not exist, the response is rejected.

This is an important boundary:

> The model is allowed to make design judgements, but it is not allowed to invent the learner's design.

---

# 18. Structured AI Output Validation

LLM output is treated as untrusted external input.

Even if the prompt requests JSON, the backend does not assume that the model will always follow the instruction correctly.

The evaluation pipeline therefore validates:

- whether a response exists;
- whether JSON can be extracted;
- whether the JSON is structurally valid;
- whether all required rubric criteria exist;
- whether criteria are duplicated;
- whether evidence references are valid;
- whether scores match the expected schema.

This prevents malformed AI output from silently becoming application data.

Conceptually:

```text
LLM response
     ↓
JSON extraction
     ↓
Schema validation
     ↓
Rubric validation
     ↓
Evidence validation
     ↓
Application result
```

Only after passing these boundaries is the AI response accepted.

---

# 19. Composite Evaluation

`CompositeEvaluator` combines the two evaluation approaches.

Conceptually:

```text
                    Submission
                        ↓
                CompositeEvaluator
                  /            \
                 /              \
                ▼                ▼
      RuleBasedEvaluator   LLM Evaluator
                │                │
                ▼                ▼
        Rule Findings      Rubric Feedback
                 \              /
                  \            /
                   ▼          ▼
                  Final Result
```

This avoids forcing one technique to solve every evaluation problem.

Rules handle objective structure.

The LLM handles qualitative design judgement.

The final result gives the learner both perspectives.

---

# 20. Asynchronous Evaluation

LLM evaluation can take significantly longer than normal application operations.

It can also depend on an external provider.

The system therefore separates:

```text
Submission
```

from:

```text
Evaluation processing
```

using an `EvaluationDispatcher` abstraction.

Conceptually:

```text
Learner submits
      ↓
Attempt becomes SUBMITTED
      ↓
Submission is persisted
      ↓
Evaluation is dispatched
      ↓
Attempt becomes EVALUATING
      ↓
Evaluation executes
      ↓
COMPLETED or FAILED
```

This is safer than pretending evaluation is an instantaneous database operation.

---

# 21. Why the MVP Uses an In-Process Dispatcher

A production system could use:

```text
API
 ↓
Message Queue
 ↓
Worker
 ↓
Evaluation Provider
```

For example, a future version could introduce a durable queue or dedicated worker service.

The MVP deliberately does not introduce that infrastructure.

Instead:

```text
EvaluationDispatcher
        ↓
InProcessEvaluationDispatcher
```

is used.

## Reason

The prototype is primarily about Low-Level Design and the learner feedback loop.

Introducing distributed messaging infrastructure would add:

- deployment complexity;
- operational overhead;
- more failure modes;
- additional configuration;
- more code unrelated to the central assignment.

The abstraction is retained because dispatch strategy is a genuine future variation point.

Therefore the current implementation stays simple without tightly coupling the entire application to the in-process approach.

---

# 22. External AI Failure Handling

The AI provider is an external dependency.

It may:

- time out;
- rate-limit requests;
- return an HTTP error;
- return empty content;
- return malformed JSON;
- return structurally invalid evaluation data.

These failures are not ignored.

The evaluation is marked as failed and the attempt enters a recoverable failure state.

During development, real provider failures were observed, including upstream rate limiting.

That validated the need for explicit failure handling rather than assuming every AI request succeeds.

---

# 23. Evaluation Retry

Retry is intentionally restricted.

The application does not allow:

```text
COMPLETED → retry
```

because a successful evaluation has already completed.

It allows retry only when the attempt is in:

```text
FAILED
```

The transition becomes:

```text
FAILED
   ↓
SUBMITTED
   ↓
EVALUATING
```

The existing learner submission is preserved.

This keeps retry semantics focused on evaluation recovery rather than creating a new learner solution.

---

# 24. Attempt History and Improvement

Attempt history is not included only as an activity log.

It supports the educational purpose of the application.

For example:

```text
Attempt 1
Score: 58%
        ↓
Learner reviews feedback
        ↓
Attempt 2
Score: 71%
        ↓
Learner improves responsibilities
and edge cases
        ↓
Attempt 3
Score: 80%
```

The value is not merely that the score increased.

The learner can compare design decisions and feedback across attempts.

`previousAttemptId` also provides a way to express continuity between attempts.

This supports the central learning loop:

```text
Attempt
   ↓
Feedback
   ↓
Reflection
   ↓
New Attempt
   ↓
Improvement
```

---

# 25. Frontend Design

The frontend is implemented as a React + TypeScript application.

Its purpose is to expose the domain workflow clearly rather than hiding everything behind one large form.

The main views include:

```text
Home
Problem Library
Problem Details
Workspace
Review
Evaluation
Results
History
```

Each screen corresponds to a meaningful stage in the learner journey.

---

# 26. Workspace Design

The workspace mirrors the structured submission model.

Instead of asking the learner for one giant answer, it separates the design into areas such as:

```text
Requirement Understanding
Assumptions
Classes
Interfaces
Relationships
Trade-offs
Edge Cases
```

This serves two purposes.

First, it improves usability.

Second, the UI structure matches the backend domain representation.

That reduces unnecessary transformation between what the learner sees and what the application evaluates.

---

# 27. Visual Design

Cipher DesignLab uses a modern dark interface with:

- neon accents;
- purple gradients;
- glass-like panels;
- motion;
- 3D visual elements.

These choices are primarily presentation decisions rather than domain architecture.

The visual style is intended to make a software-design practice tool feel interactive and modern while preserving readability for the actual learning workflow.

The core product does not depend on the 3D effects.

If they were removed, the learner workflow and domain behaviour would continue to function.

This separation keeps presentation concerns from affecting the core application design.

---

# 28. Error Handling

The HTTP API returns structured errors rather than arbitrary strings where possible.

Examples of application-level error categories include:

```text
INVALID_REQUEST
NOT_FOUND
INVALID_ATTEMPT_STATE
```

For example, attempting to edit an already submitted design produces an invalid state error rather than silently changing historical work.

This distinction is useful both for frontend behaviour and debugging.

---

# 29. Testing Strategy

Tests focus particularly on areas where regressions would damage domain correctness.

## Attempt domain tests

The `Attempt` tests verify behaviour such as:

- creation starts in `DRAFT`;
- meaningful submissions can be submitted;
- invalid submissions are rejected;
- submitted attempts cannot be edited;
- submitted attempts cannot be submitted twice;
- evaluation begins only from the correct state;
- completion occurs only while evaluating;
- failure occurs only while evaluating;
- retry is allowed only after failure.

These tests protect the attempt state machine.

## Rule evaluator tests

The `RuleBasedEvaluator` tests verify deterministic evaluation behaviour.

This is important because objective findings should remain predictable even when the external LLM provider changes.

At the final development stage, the backend test suite contained:

```text
24 passing tests
```

across the domain and rule-based evaluator test suites.

---

# 30. Dependency Direction

A useful way to understand the architecture is:

```text
Presentation
     ↓
Application
     ↓
Domain
```

Infrastructure provides implementations required by the application/domain boundaries.

For example:

```text
AttemptRepository
        ↑
MongoAttemptRepository
```

and:

```text
Evaluator
   ↑
OpenRouterLlmEvaluator
```

The intention is that core business rules should not be defined by MongoDB, OpenRouter, Express, or another external technology.

Those technologies support the application.

They do not define its domain behaviour.

---

# 31. Important Abstractions

Cipher DesignLab does not introduce interfaces everywhere.

The important abstractions exist around areas where change is realistic.

## Persistence

```text
Repository
```

protects the application from direct dependency on persistence implementation details.

## Evaluation Strategy

```text
Evaluator
```

allows different evaluation approaches.

## Evaluation Dispatch

```text
EvaluationDispatcher
```

allows asynchronous execution strategy to change.

## Submission Representation

```text
StructuredSubmission
```

creates a clear boundary around the learner's current design representation.

These abstractions correspond to real variation points.

---

# 32. What Was Deliberately Not Abstracted

Not every class needs an interface.

Not every operation needs a strategy.

Not every service needs a factory.

Adding abstractions without a real reason can make an application harder to understand.

For example, the MVP does not introduce distributed microservices simply to demonstrate architectural complexity.

It also does not create design-pattern wrappers around every small operation.

The guiding question was:

> Is this concept likely to vary independently, or does it protect an important domain rule?

If the answer was no, the implementation generally remained simple.

---

# 33. Change Scenario — Adding Another Evaluation Approach

Suppose the platform later introduces a specialised static design analyser.

The desired architecture is:

```text
Evaluator
   │
   ├── RuleBasedEvaluator
   ├── OpenRouterLlmEvaluator
   └── StaticAnalysisEvaluator
```

The new evaluator should fit behind the same conceptual boundary.

The application should not need to redesign the entire attempt lifecycle simply because evaluation technology changes.

This is why `Evaluator` represents a useful abstraction rather than abstraction for its own sake.

---

# 34. Change Scenario — Replacing the AI Provider

The current LLM evaluator communicates through OpenRouter.

However, OpenRouter is infrastructure, not the core domain.

A future implementation might use:

```text
OpenAI
Anthropic
Google
Local model
Enterprise-hosted model
```

The learner workflow should remain conceptually unchanged:

```text
Submit
  ↓
Evaluate
  ↓
Validate
  ↓
Store Feedback
```

Provider-specific behaviour should remain inside the relevant infrastructure adapter.

---

# 35. Change Scenario — Durable Evaluation Queue

The MVP currently uses:

```text
EvaluationDispatcher
        ↓
InProcessEvaluationDispatcher
```

A production deployment could instead use:

```text
EvaluationDispatcher
        ↓
QueueEvaluationDispatcher
        ↓
Durable Queue
        ↓
Evaluation Worker
```

The reason for retaining the dispatcher boundary is to make this change possible without rewriting the core attempt and evaluation behaviour.

The prototype therefore avoids production infrastructure while still recognising the likely future variation point.

---

# 36. Change Scenario — Diagram-Based Submissions

A future version of Cipher DesignLab may allow learners to create or upload UML-style diagrams.

That changes the representation of the submission.

Today:

```text
Learner
   ↓
Structured Text Workspace
   ↓
StructuredSubmission
```

A future version might support:

```text
Learner
   ↓
Diagram Editor
   ↓
Diagram Submission
```

or:

```text
Learner
   ↓
Structured Workspace + Diagram
   ↓
Combined Submission
```

The important design principle is that evaluation should consume a meaningful representation of learner evidence rather than being permanently coupled to one UI form.

A future diagram feature may therefore introduce diagram-specific evidence and possibly a specialised evaluator without requiring the entire learner-attempt lifecycle to change.

---

# 37. Change Scenario — More LLD Problems

The platform should be able to add problems without creating problem-specific application logic for every new exercise.

For example:

```text
Parking Lot
Library Management
Elevator System
Movie Booking
Notification System
Food Delivery
```

Each problem can provide its own:

- brief;
- requirements;
- constraints;
- change scenarios.

The evaluation framework then reasons about the learner's submission in the context of that problem.

The platform should therefore grow by adding problem definitions rather than creating a completely new application flow for every problem.

---

# 38. Security and Trust Boundaries

The system treats several forms of input as untrusted.

## Learner input

Learner-provided design content is data, not executable instruction.

## AI output

LLM responses are validated before being accepted.

## Environment secrets

External service credentials such as the OpenRouter API key are stored in environment configuration rather than source code.

Environment files containing secrets are excluded from version control.

Example environment files contain placeholders rather than real credentials.

This became particularly important during repository preparation, where secret scanning was used as an additional safety boundary.

---

# 39. Why a Monolith Is Appropriate for the MVP

Cipher DesignLab currently uses a straightforward application structure rather than multiple independently deployed services.

This is intentional.

The MVP does not currently have a demonstrated need for:

- independent service scaling;
- multiple deployment teams;
- separate service ownership;
- complex distributed transactions;
- high-volume event processing.

A modular monolith keeps the development and deployment model understandable while still allowing internal boundaries between:

```text
Problem
Attempt
Evaluation
Persistence
External AI
HTTP
```

The goal is not to avoid future scalability.

The goal is to avoid paying the complexity cost before the problem requires it.

---

# 40. Design Trade-Offs

Several trade-offs were consciously accepted.

## Structured submissions vs complete freedom

**Choice:** Structured submission.

**Benefit:** Easier evaluation, validation and evidence grounding.

**Cost:** Learners have less freedom than a completely open canvas.

---

## Hybrid evaluation vs LLM-only evaluation

**Choice:** Hybrid.

**Benefit:** Objective checks remain deterministic while qualitative judgement can use AI.

**Cost:** More evaluation components must be maintained.

---

## Fixed rubric vs completely open AI judgement

**Choice:** Fixed rubric.

**Benefit:** More explainable and comparable feedback.

**Cost:** The evaluator is constrained to known assessment dimensions.

---

## In-process evaluation vs production queue

**Choice:** In-process dispatcher for the MVP.

**Benefit:** Simpler deployment and implementation.

**Cost:** It does not provide the durability or horizontal worker scaling of a production queue.

---

## External LLM vs local model

**Choice:** External LLM through OpenRouter.

**Benefit:** Access to capable models without hosting inference infrastructure.

**Cost:** Evaluation depends on provider availability, latency and rate limits.

The failure and retry model exists partly because of this trade-off.

---

# 41. Known MVP Limitations

The current design intentionally leaves several areas for future work.

Examples include:

- no full authentication and account system;
- limited problem catalogue;
- no collaborative design sessions;
- no real-time multi-user editing;
- no durable external evaluation queue;
- no visual UML editor;
- no code-level implementation evaluation;
- no teacher/admin analytics dashboard;
- dependence on an external LLM provider for qualitative evaluation;
- no sophisticated cross-attempt learning analytics yet.

These are not hidden as architectural failures.

They represent boundaries of the MVP.

---

# 42. Possible Production Evolution

If Cipher DesignLab were developed beyond the prototype, a reasonable evolution could be:

```text
Current MVP
    ↓
More LLD Problems
    ↓
Authentication + Learner Profiles
    ↓
Improved Attempt Comparison
    ↓
Diagram-Based Design Workspace
    ↓
Durable Evaluation Queue
    ↓
Dedicated Evaluation Workers
    ↓
Multiple Evaluation Strategies
    ↓
Teacher / Mentor Analytics
```

Importantly, these changes should be introduced when product requirements justify them.

The current architecture does not attempt to prematurely implement all of them.

---

# 43. Final Design Principle

Cipher DesignLab follows one central design principle:

> **Add an abstraction when it protects a real variation point or an important domain rule, not simply because a design pattern exists.**

The important abstractions exist because these areas are genuinely expected to change or require protection:

```text
Persistence
Evaluation strategy
Evaluation dispatch
Submission representation
Attempt lifecycle
```

Other areas are deliberately kept straightforward.

The architecture therefore aims for:

```text
Clear responsibilities
        +
Explicit domain behaviour
        +
Controlled dependencies
        +
Useful extension points
        +
Minimal unnecessary complexity
```

rather than:

```text
More layers
+
More patterns
+
More services
=
Better design
```

That is especially important for a Low-Level Design project.

Good LLD is not measured by how many design patterns or interfaces can be added.

It is measured by whether responsibilities are clear, behaviour is protected, dependencies are manageable, changes can be accommodated reasonably, and another developer can understand why the system was designed this way.

---

# 44. Conclusion

Cipher DesignLab was designed around a small but complete learning cycle:

```text
Design
  ↓
Submit
  ↓
Evaluate
  ↓
Understand
  ↓
Retry
  ↓
Improve
```

The architecture supports that cycle through:

- a structured learner submission model;
- an explicit attempt state machine;
- repository boundaries for persistence;
- hybrid deterministic and AI evaluation;
- evidence-grounded feedback;
- validated AI output;
- asynchronous evaluation dispatch;
- failure recovery and retry;
- attempt history;
- clear future extension points.

The system deliberately avoids unnecessary High-Level Design complexity.

Its primary concern is the quality of the objects, responsibilities, interfaces, behaviours and interactions that make the learner workflow work correctly.

The result is an MVP that is simple enough to understand today while preserving clear places for tomorrow's changes.