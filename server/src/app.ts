import cors from "cors";
import express from "express";

import {
  env,
} from "./config/env.js";

import {
  ProblemService,
} from "./application/problem/ProblemService.js";

import {
  AttemptService,
} from "./application/attempt/AttemptService.js";

import {
  EvaluationService,
} from "./application/evaluation/EvaluationService.js";

import {
  RuleBasedEvaluator,
} from "./application/evaluation/RuleBasedEvaluator.js";

import {
  CompositeEvaluator,
} from "./application/evaluation/CompositeEvaluator.js";

import {
  MongoProblemRepository,
} from "./infrastructure/persistence/repositories/MongoProblemRepository.js";

import {
  MongoAttemptRepository,
} from "./infrastructure/persistence/repositories/MongoAttemptRepository.js";

import {
  MongoEvaluationRepository,
} from "./infrastructure/persistence/repositories/MongoEvaluationRepository.js";

import {
  InProcessEvaluationDispatcher,
} from "./infrastructure/evaluation/InProcessEvaluationDispatcher.js";

import {
  OpenRouterLlmEvaluator,
} from "./infrastructure/evaluation/OpenRouterLlmEvaluator.js";

import {
  healthRouter,
} from "./presentation/http/routes/health.routes.js";

import {
  createProblemRouter,
} from "./presentation/http/routes/problem.routes.js";

import {
  createAttemptRouter,
} from "./presentation/http/routes/attempt.routes.js";

import {
  createEvaluationRouter,
} from "./presentation/http/routes/evaluation.routes.js";

import {
  errorHandler,
} from "./presentation/http/middleware/errorHandler.js";

export function createApp() {
  const app =
    express();

  app.use(
    cors({
      origin:
        env.CLIENT_ORIGIN,
    })
  );

  app.use(
    express.json({
      limit: "1mb",
    })
  );

  /*
   * Repositories
   */

  const problemRepository =
    new MongoProblemRepository();

  const attemptRepository =
    new MongoAttemptRepository();

  const evaluationRepository =
    new MongoEvaluationRepository();

  /*
   * Evaluation strategies
   */

  const ruleEvaluator =
    new RuleBasedEvaluator();

  const llmEvaluator =
    new OpenRouterLlmEvaluator();

  const evaluator =
    new CompositeEvaluator(
      ruleEvaluator,
      llmEvaluator
    );

  /*
   * Application services
   */

  const problemService =
    new ProblemService(
      problemRepository
    );

  const attemptService =
    new AttemptService(
      attemptRepository,
      problemRepository
    );

  const evaluationService =
    new EvaluationService(
      attemptRepository,
      problemRepository,
      evaluationRepository,
      evaluator
    );

  /*
   * Async dispatcher
   */

  const evaluationDispatcher =
    new InProcessEvaluationDispatcher(
      evaluationService
    );

  /*
   * Routes
   */

  app.use(
    "/api/health",
    healthRouter
  );

  app.use(
    "/api/problems",
    createProblemRouter(
      problemService
    )
  );

  app.use(
    "/api",
    createAttemptRouter(
      attemptService,
      evaluationDispatcher
    )
  );

 app.use(
  "/api",
  createEvaluationRouter(
    evaluationService,
    attemptService,
    evaluationDispatcher
  )
);
  /*
   * Keep last.
   */

  app.use(
    errorHandler
  );

  return app;
}