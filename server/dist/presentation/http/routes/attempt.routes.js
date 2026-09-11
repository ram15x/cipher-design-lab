import { Router, } from "express";
import { StartAttemptSchema, SubmissionSchema, } from "../../../application/attempt/attempt.schemas.js";
export function createAttemptRouter(attemptService, evaluationDispatcher) {
    const router = Router();
    router.post("/problems/:slug/attempts", async (request, response, next) => {
        try {
            const input = StartAttemptSchema.parse(request.body);
            const attempt = await attemptService
                .startAttempt({
                learnerId: input.learnerId,
                problemSlug: String(request.params
                    .slug),
                previousAttemptId: input
                    .previousAttemptId,
            });
            response
                .status(201)
                .json({
                success: true,
                data: attempt,
            });
        }
        catch (error) {
            next(error);
        }
    });
    router.get("/attempts/:attemptId", async (request, response, next) => {
        try {
            const attempt = await attemptService
                .getAttempt(String(request.params
                .attemptId));
            response.json({
                success: true,
                data: attempt,
            });
        }
        catch (error) {
            next(error);
        }
    });
    router.patch("/attempts/:attemptId/draft", async (request, response, next) => {
        try {
            const submission = SubmissionSchema.parse(request.body);
            const attempt = await attemptService
                .updateDraft(String(request.params
                .attemptId), submission);
            response.json({
                success: true,
                data: attempt,
            });
        }
        catch (error) {
            next(error);
        }
    });
    /*
     * SUBMIT
     *
     * Important:
     *
     * 1. Persist submission
     * 2. Respond immediately
     * 3. Dispatch evaluation
     *
     * Evaluation therefore does
     * not block the HTTP response.
     */
    router.post("/attempts/:attemptId/submit", async (request, response, next) => {
        try {
            const attempt = await attemptService
                .submitAttempt(String(request.params
                .attemptId));
            /*
             * Return SUBMITTED first.
             */
            response
                .status(202)
                .json({
                success: true,
                message: "Submission accepted for evaluation",
                data: attempt,
            });
            /*
             * Then schedule evaluation.
             */
            evaluationDispatcher
                .dispatch(attempt.id);
        }
        catch (error) {
            next(error);
        }
    });
    router.get("/learners/:learnerId/attempts", async (request, response, next) => {
        try {
            const attempts = await attemptService
                .getLearnerHistory(String(request.params
                .learnerId));
            response.json({
                success: true,
                count: attempts.length,
                data: attempts,
            });
        }
        catch (error) {
            next(error);
        }
    });
    return router;
}
