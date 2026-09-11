Scope Decisions

Several features were deliberately excluded from the MVP:

authentication
collaborative editing
full code execution
UML drag-and-drop editor
Kafka-based workers
microservices
advanced analytics
production observability

These may be useful in a larger platform, but they do not directly improve the core two-day LLD practice loop enough to justify their implementation cost.

The prototype instead focuses on:

clear domain boundaries
structured learner evidence
explainable evaluation
failure handling
attempt history
extensibility


Product Hypothesis

The core hypothesis behind Cipher DesignLab is:

LLD learners improve faster when feedback evaluates their reasoning against a stable rubric, points to evidence in their own design, and gives a concrete direction for the next attempt.

The prototype is designed to test that learning loop rather than recreate a full learning management system.


This aligns directly with the assignment's guidance that a strong MVP can be only 3–5 problems, one submission model, one evaluation flow, feedback, and history—not a giant feature set. :contentReference[oaicite:1]{index=1}

After you fix `.gitignore` and save `RESEARCH.md`, we'll do **6C `DESIGN.md`**, which is arguably the most impo