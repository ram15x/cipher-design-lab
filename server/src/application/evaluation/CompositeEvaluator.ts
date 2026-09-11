import type {
  Evaluator,
  EvaluationContext,
} from "../../domain/evaluation/Evaluator.js";

import type {
  EvaluationResult,
} from "../../domain/evaluation/Evaluation.js";

export class CompositeEvaluator
  implements Evaluator
{
  readonly key =
    "hybrid-v1";

  constructor(
    private readonly ruleEvaluator:
      Evaluator,

    private readonly llmEvaluator:
      Evaluator
  ) {}

  async evaluate(
    context:
      EvaluationContext
  ): Promise<EvaluationResult> {
    /*
     * Both evaluators are independent,
     * so they can run concurrently.
     */

    const [
      ruleResult,
      llmResult,
    ] =
      await Promise.all([
        this.ruleEvaluator
          .evaluate(
            context
          ),

        this.llmEvaluator
          .evaluate(
            context
          ),
      ]);

    return {
      /*
       * Score comes from the fixed
       * AI rubric, but aggregation
       * was calculated in code.
       */

      overallScore:
        llmResult
          .overallScore,

      /*
       * Judgment-heavy feedback.
       */

      criteria:
        llmResult.criteria,

      /*
       * Objective deterministic
       * findings.
       */

      ruleFindings:
        ruleResult
          .ruleFindings,
    };
  }
}