export class InProcessEvaluationDispatcher {
    evaluationService;
    constructor(evaluationService) {
        this.evaluationService = evaluationService;
    }
    dispatch(attemptId) {
        setImmediate(async () => {
            try {
                await this
                    .evaluationService
                    .evaluateAttempt(attemptId);
            }
            catch (error) {
                console.error(`Evaluation failed for attempt ${attemptId}:`, error);
            }
        });
    }
}
