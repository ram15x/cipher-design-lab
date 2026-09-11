import { Attempt, } from "../../domain/attempt/Attempt.js";
export class AttemptService {
    attemptRepository;
    problemRepository;
    constructor(attemptRepository, problemRepository) {
        this.attemptRepository = attemptRepository;
        this.problemRepository = problemRepository;
    }
    /*
     * Start a new learner attempt.
     */
    async startAttempt(input) {
        const problem = await this.problemRepository
            .findBySlug(input.problemSlug);
        if (!problem) {
            const error = new Error("Problem not found");
            error.name =
                "NotFoundError";
            throw error;
        }
        /*
         * Determine the learner's next
         * attempt number for this problem.
         */
        const existingCount = await this.attemptRepository
            .countForLearnerAndProblem(input.learnerId, problem.id);
        const attempt = Attempt.start({
            learnerId: input.learnerId,
            problemId: problem.id,
            problemSlug: problem.slug,
            attemptNumber: existingCount + 1,
            previousAttemptId: input.previousAttemptId,
        });
        await this.attemptRepository
            .save(attempt);
        return attempt.toObject();
    }
    /*
     * Retrieve one attempt.
     */
    async getAttempt(attemptId) {
        const attempt = await this.getRequiredAttempt(attemptId);
        return attempt.toObject();
    }
    /*
     * Save/update a DRAFT submission.
     */
    async updateDraft(attemptId, submission) {
        const attempt = await this.getRequiredAttempt(attemptId);
        attempt.updateDraft(submission);
        await this.attemptRepository
            .save(attempt);
        return attempt.toObject();
    }
    /*
     * Submit the learner design.
     *
     * Important:
     *
     * The SUBMITTED state is persisted
     * BEFORE async evaluation begins.
     *
     * This means the learner's submission
     * is safe even if the AI provider fails.
     */
    async submitAttempt(attemptId) {
        const attempt = await this.getRequiredAttempt(attemptId);
        attempt.submit();
        await this.attemptRepository
            .save(attempt);
        return attempt.toObject();
    }
    /*
     * Prepare a FAILED attempt
     * for evaluation retry.
     *
     * FAILED -> SUBMITTED
     *
     * The dispatcher/EvaluationService
     * will then continue:
     *
     * SUBMITTED
     *    ->
     * EVALUATING
     *    ->
     * COMPLETED / FAILED
     */
    async prepareEvaluationRetry(attemptId) {
        const attempt = await this.getRequiredAttempt(attemptId);
        attempt.retryEvaluation();
        await this.attemptRepository
            .save(attempt);
        return attempt.toObject();
    }
    /*
     * Retrieve history for a learner.
     */
    async getLearnerHistory(learnerId) {
        const attempts = await this.attemptRepository
            .findForLearner(learnerId);
        return attempts.map((attempt) => attempt.toObject());
    }
    /*
     * Shared resource lookup.
     *
     * Application methods should not
     * repeatedly implement their own
     * Attempt-not-found logic.
     */
    async getRequiredAttempt(attemptId) {
        const attempt = await this.attemptRepository
            .findById(attemptId);
        if (!attempt) {
            const error = new Error("Attempt not found");
            error.name =
                "NotFoundError";
            throw error;
        }
        return attempt;
    }
}
