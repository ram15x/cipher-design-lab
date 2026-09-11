# Design Note — Cipher DesignLab

## 1. MVP Overview

Cipher DesignLab is a focused Low-Level Design practice platform.

The MVP allows a learner to:

1. choose an LLD problem;
2. start an attempt;
3. create a structured design submission;
4. save the design as a draft;
5. submit it;
6. receive asynchronous hybrid evaluation;
7. review evidence-backed feedback;
8. inspect attempt history;
9. create another attempt and improve.

The design intentionally focuses on the learner practice loop rather than building a complete LMS.

---

# 2. User Flow

```text
Problem Library
      ↓
Problem Details
      ↓
Start Attempt
      ↓
DRAFT
      ↓
Structured Workspace
      ↓
Save Draft
      ↓
Review
      ↓
Submit
      ↓
SUBMITTED
      ↓
EVALUATING
      ↓
┌───────────────┬───────────────┐
│ Rule Evaluator│ LLM Evaluator │
└───────────────┴───────────────┘
      ↓
Composite Evaluation
      ↓
COMPLETED / FAILED
      ↓
Feedback
      ↓
Attempt History
      ↓
Try Again