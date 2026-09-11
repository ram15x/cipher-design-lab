export class CompositeEvaluator {
    ruleEvaluator;
    llmEvaluator;
    key = "hybrid-v1";
    constructor(ruleEvaluator, llmEvaluator) {
        this.ruleEvaluator = ruleEvaluator;
        this.llmEvaluator = llmEvaluator;
    }
    async evaluate(context) {
        /*
         * Both evaluators are independent,
         * so they can run concurrently.
         */
        const [ruleResult, llmResult,] = await Promise.all([
            this.ruleEvaluator
                .evaluate(context),
            this.llmEvaluator
                .evaluate(context),
        ]);
        return {
            /*
             * Score comes from the fixed
             * AI rubric, but aggregation
             * was calculated in code.
             */
            overallScore: llmResult
                .overallScore,
            /*
             * Judgment-heavy feedback.
             */
            criteria: llmResult.criteria,
            /*
             * Objective deterministic
             * findings.
             */
            ruleFindings: ruleResult
                .ruleFindings,
        };
    }
}
