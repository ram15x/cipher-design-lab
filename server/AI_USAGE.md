# AI Usage

AI tools were used as an engineering and design partner during this assignment.
Important suggestions were reviewed rather than accepted automatically.

## Decision 1 — Keep the prototype monolithic

### AI suggestion

Possible implementations included an external evaluation worker,
Redis-backed jobs, and Kafka-based asynchronous processing.

### Decision

Rejected those components for the initial MVP.

### Reason

The assignment focuses primarily on Low-Level Design and the learner
practice loop. Kafka or distributed workers would add operational
complexity without materially improving the two-day prototype.

The system will instead define an EvaluationDispatcher abstraction.
The first implementation can execute evaluation in-process.
A durable queue can later replace it without modifying the core
Attempt or Evaluation domain behaviour.