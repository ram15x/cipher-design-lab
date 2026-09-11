# Cipher DesignLab

**AI-assisted Low-Level Design practice platform**

Cipher DesignLab helps learners practise software design, receive structured feedback, understand weaknesses in their reasoning, and improve through repeated attempts.

Unlike coding problems where an answer can often be marked simply right or wrong, Low-Level Design problems can have multiple valid solutions.

Cipher DesignLab therefore evaluates **design reasoning rather than comparison with one fixed reference architecture**.

---

## What Does It Do?

A learner moves through a complete LLD practice loop:

```text
Choose Problem
      ↓
Start Attempt
      ↓
Design Solution
      ↓
Save Draft
      ↓
Review & Submit
      ↓
AI + Rule Evaluation
      ↓
Structured Feedback
      ↓
Attempt History
      ↓
Try Again & Improve
```

The goal is not simply to produce a score.

The platform tries to explain:

- what was done well;
- what could cause design problems;
- which part of the learner's submission supports the feedback;
- what should be improved in the next attempt.

---

## Core Features

### Structured LLD Workspace

Instead of one large text box, learners describe their design through structured sections:

- requirement understanding;
- assumptions;
- classes and responsibilities;
- interfaces;
- relationships;
- trade-offs;
- edge cases.

This encourages learners to explain **why their design works**, not simply name classes or design patterns.

### Hybrid Evaluation

Cipher DesignLab combines two evaluation strategies:

```text
                 Learner Design
                       ↓
               CompositeEvaluator
                 /           \
                ↓             ↓
       Rule-Based Checks   LLM Review
                \             /
                 └─────┬─────┘
                       ↓
              Structured Feedback
```

The **rule-based evaluator** handles objectively verifiable problems such as duplicate classes, invalid relationship references, weak structural evidence, and missing design information.

The **LLM evaluator** handles areas that require judgement, such as class responsibilities, coupling and cohesion, abstraction choices, extensibility, trade-offs, and explanation quality.

---

## Evaluation Rubric

Every submission is evaluated across eight dimensions:

1. Requirement Understanding
2. Class Responsibilities
3. Coupling / Cohesion
4. Encapsulation / Interfaces
5. Abstraction / Patterns
6. Extensibility
7. Edge Cases / Testability
8. Explanation Quality

Each criterion receives a score from **0–5**.

The backend then calculates the final percentage deterministically.

For example:

```text
Total rubric score = 32
Maximum score      = 40

Final score = 32 / 40 × 100 = 80%
```

The LLM therefore does not directly invent an arbitrary percentage.

---

## Evidence-Grounded AI Feedback

LLM output is treated as **untrusted external input**.

Before evaluation, the learner submission is converted into an evidence catalogue containing references such as:

```text
section:requirement-understanding
class:ParkingLot
class:Vehicle
interface:ParkingStrategy
relationship:0
tradeoff:0
edge-case:0
```

The AI may only reference evidence contained in this catalogue.

After receiving the response, the backend validates:

- JSON structure;
- rubric structure;
- required criteria;
- duplicate criteria;
- evidence references.

If the model invents evidence that does not exist in the learner's submission, the response is rejected.

---

## Attempt Lifecycle

Each solution is represented by an `Attempt`.

Normal flow:

```text
DRAFT
  ↓
SUBMITTED
  ↓
EVALUATING
  ↓
COMPLETED
```

Failure flow:

```text
EVALUATING
    ↓
FAILED
```

Failed evaluations can be retried:

```text
FAILED
  ↓
SUBMITTED
  ↓
EVALUATING
```

There is an important distinction between **Retry Evaluation** and **Try Again**.

**Retry Evaluation** keeps the same learner submission and retries only the failed evaluation.

**Try Again** creates a new attempt so the learner can modify the design based on previous feedback.

---

## Asynchronous Evaluation & Failure Recovery

AI evaluation may take several seconds and external providers can fail because of rate limits, timeouts, or network problems.

Cipher DesignLab therefore persists the learner submission **before** AI evaluation begins.

```text
Submit
  ↓
Persist Submission
  ↓
EVALUATING
  ↓
COMPLETED / FAILED
```

This ensures that an AI provider failure does not cause the learner's work to disappear.

The frontend displays evaluation progress while polling for the final result.

---

## Frontend

The frontend was designed as a modern interactive learning environment rather than a traditional form-heavy dashboard.

It includes:

- dark UI;
- neon purple gradients;
- glass-style panels;
- animated transitions;
- 3D visual elements;
- animated evaluation states;
- score visualisation;
- responsive problem and workspace views.

The visual layer is independent from the core domain behaviour.

---

## Technology Stack

### Frontend

- React
- TypeScript
- Vite
- React Router
- Framer Motion
- Three.js
- React Three Fiber
- React Three Drei
- Lucide React

### Backend

- Node.js
- TypeScript
- Express
- MongoDB
- Zod

### AI

- OpenRouter
- structured LLM evaluation
- fixed scoring rubric
- evidence validation

### Infrastructure & Testing

- Docker Compose
- MongoDB 7
- Vitest

---

## Architecture

Cipher DesignLab uses a **modular monolith** with clear responsibility boundaries.

```text
Presentation
    ↓
Application
    ↓
Domain
    ↑
Infrastructure
```

The backend separates:

- HTTP handling;
- application workflows;
- domain rules;
- persistence;
- evaluation strategies;
- external AI communication.

Important abstractions include:

```text
Repository
Evaluator
EvaluationDispatcher
```

These abstractions exist because persistence, evaluation strategy, and execution infrastructure are realistic variation points.

The project deliberately avoids adding architectural complexity where it provides no practical benefit.

For a detailed explanation, see:

```text
DESIGN.md
```

---

## Project Structure

```text
cipher-design-lab/
│
├── client/
│   └── src/
│       ├── components/
│       ├── pages/
│       └── lib/
│
├── server/
│   └── src/
│       ├── application/
│       ├── config/
│       ├── domain/
│       ├── infrastructure/
│       ├── presentation/
│       └── seed/
│
├── docker-compose.yml
├── README.md
├── DESIGN.md
├── RESEARCH.md
├── AI_USAGE.md
└── .gitignore
```

---

## Running Locally

### Requirements

Install:

- Node.js
- npm
- Docker Desktop

### 1. Start MongoDB

From the project root:

```bash
docker compose up -d
```

### 2. Configure Backend

Create:

```text
server/.env
```

Example:

```env
PORT=4000
CLIENT_ORIGIN=http://localhost:5173
MONGODB_URI=mongodb://localhost:27017/cipher-design-lab

OPENROUTER_API_KEY=your_openrouter_api_key_here
OPENROUTER_MODEL=openai/gpt-oss-20b
```

Never commit a real API key.

### 3. Start Backend

```bash
cd server
npm install
npm run seed
npm run dev
```

Backend:

```text
http://localhost:4000
```

### 4. Configure Frontend

Create:

```text
client/.env
```

Example:

```env
VITE_API_BASE_URL=http://localhost:4000/api
```

### 5. Start Frontend

```bash
cd client
npm install
npm run dev
```

Frontend:

```text
http://localhost:5173
```

---

## Build & Test

### Backend

```bash
cd server
npm run build
npm test
```

Current test suite:

```text
Test Files  2 passed
Tests       24 passed
```

Tests cover important domain and evaluation behaviour including attempt state transitions, submission validation, evaluation retry, duplicate classes, invalid relationships, and structural design checks.

### Frontend

```bash
cd client
npm run build
```

Both frontend and backend currently compile successfully.

The frontend build may report a bundle-size warning because Three.js and the 3D visualisation increase the JavaScript bundle size. This is an optimisation opportunity rather than a build failure.

---

## Scope Decisions

Cipher DesignLab intentionally focuses on the core LLD learning loop.

The MVP does **not** attempt to provide:

- authentication;
- collaborative editing;
- full source-code execution;
- drag-and-drop UML editing;
- Kafka-based workers;
- microservices;
- advanced analytics;
- production observability.

These features could be useful in a larger platform, but they would add substantial complexity without being necessary to validate the core learner experience.

The prototype instead prioritises:

- clear domain boundaries;
- structured learner evidence;
- explainable evaluation;
- failure handling;
- attempt history;
- extensibility.

---

## Product Hypothesis

The central product hypothesis is:

> **LLD learners improve faster when feedback evaluates their reasoning against a stable rubric, points to evidence in their own design, and gives a concrete direction for the next attempt.**

The platform therefore aims to say more than:

```text
"Your design is wrong."
```

Instead, feedback should communicate something closer to:

```text
"This part of your design is reasonable,
but this responsibility is too broad,
this relationship increases coupling,
and here is what you could improve next time."
```

The prototype is designed to test this learning loop rather than recreate an entire Learning Management System.

---

## Known Limitations

The current version is an MVP rather than a production-ready education platform.

Current limitations include:

- fixed demo learner instead of authentication;
- no full visual UML editor;
- no source-code compiler or execution environment;
- no human evaluator;
- in-process rather than durable background evaluation;
- dependency on an external AI provider;
- limited production metrics and tracing;
- no collaborative editing;
- no automatic visual comparison between attempts;
- relatively small problem catalogue.

These are deliberate scope decisions rather than requirements hidden behind unnecessary infrastructure.

---

## Future Improvements

Possible future additions include:

- authentication and learner profiles;
- larger LLD problem library;
- visual UML editor;
- attempt-to-attempt improvement analytics;
- human mentor review;
- source-code evaluation;
- diagram submissions;
- durable evaluation queues;
- dedicated evaluation workers;
- multiple AI-provider fallback;
- learner analytics;
- collaborative design sessions.

---

## Documentation

More detailed engineering reasoning is intentionally kept outside this README.

### `DESIGN.md`

Detailed architecture, domain modelling, state transitions, evaluator design, asynchronous processing, failure recovery, extensibility and engineering trade-offs.

### `AI_USAGE.md`

Documents meaningful examples of how AI assisted development, including suggestions that were accepted, modified or rejected and why.

### `RESEARCH.md`

Documents the problem exploration, product reasoning, scope decisions and research behind the learner experience.

---

## Security

Environment files containing real credentials are excluded from Git:

```text
server/.env
client/.env
```

Only placeholder/example configuration should be committed.

Never commit real API keys or credentials.

---

## Design Philosophy

Cipher DesignLab follows one central engineering principle:

> **Add an abstraction when it protects a real variation point or domain rule, not simply because a design pattern exists.**

The goal of the project is not to demonstrate the maximum number of technologies or patterns.

It is to demonstrate:

- clear responsibilities;
- understandable behaviour;
- testable domain rules;
- explainable AI integration;
- sensible failure handling;
- realistic extension points;
- deliberate engineering trade-offs.

---

## Summary

Cipher DesignLab combines:

```text
Structured LLD Practice
        +
Deterministic Validation
        +
AI Design Review
        +
Evidence-Grounded Feedback
        +
Attempt History
        +
Repeated Improvement
```

into one focused learning experience.

The ultimate goal is simple:

> **Help learners understand why their design works, where it can improve, and what they should change in their next attempt.**