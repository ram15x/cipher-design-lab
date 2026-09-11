export class RuleBasedEvaluator {
    key = "rule-based-v1";
    async evaluate(context) {
        const submission = context.submission;
        const findings = [];
        /*
         * Duplicate class names
         */
        const normalizedClassNames = submission.classes.map((item) => item.name
            .trim()
            .toLowerCase());
        const duplicates = normalizedClassNames.filter((name, index) => normalizedClassNames
            .indexOf(name) !== index);
        const uniqueDuplicates = [
            ...new Set(duplicates),
        ];
        for (const duplicate of uniqueDuplicates) {
            findings.push({
                code: "DUPLICATE_CLASS",
                severity: "ERROR",
                message: `Duplicate class detected: ${duplicate}`,
                evidenceRefs: [
                    `class:${duplicate}`,
                ],
            });
        }
        /*
         * Very broad / weak class
         * responsibilities
         */
        for (const designClass of submission.classes) {
            if (designClass
                .responsibility
                .trim()
                .length < 25) {
                findings.push({
                    code: "WEAK_RESPONSIBILITY",
                    severity: "WARNING",
                    message: `Class '${designClass.name}' has a very short responsibility description.`,
                    evidenceRefs: [
                        `class:${designClass.name}`,
                    ],
                });
            }
        }
        /*
         * Relationship references
         * should point to declared
         * classes or interfaces.
         */
        const declaredNames = new Set([
            ...submission.classes.map((item) => item.name
                .trim()
                .toLowerCase()),
            ...submission.interfaces.map((item) => item.name
                .trim()
                .toLowerCase()),
        ]);
        for (const relationship of submission.relationships) {
            if (!declaredNames.has(relationship.from
                .trim()
                .toLowerCase())) {
                findings.push({
                    code: "UNKNOWN_RELATIONSHIP_SOURCE",
                    severity: "ERROR",
                    message: `Relationship source '${relationship.from}' is not declared as a class or interface.`,
                    evidenceRefs: [
                        `relationship:${relationship.from}->${relationship.to}`,
                    ],
                });
            }
            if (!declaredNames.has(relationship.to
                .trim()
                .toLowerCase())) {
                findings.push({
                    code: "UNKNOWN_RELATIONSHIP_TARGET",
                    severity: "ERROR",
                    message: `Relationship target '${relationship.to}' is not declared as a class or interface.`,
                    evidenceRefs: [
                        `relationship:${relationship.from}->${relationship.to}`,
                    ],
                });
            }
        }
        /*
         * No relationships at all
         */
        if (submission.relationships.length ===
            0) {
            findings.push({
                code: "NO_RELATIONSHIPS",
                severity: "WARNING",
                message: "The design does not describe any relationships between its components.",
                evidenceRefs: [],
            });
        }
        /*
         * No interface / abstraction
         */
        if (submission.interfaces.length ===
            0) {
            findings.push({
                code: "NO_INTERFACES",
                severity: "INFO",
                message: "No explicit interface or variation point was described. This may be fine, but consider whether any behavior is likely to change.",
                evidenceRefs: [],
            });
        }
        /*
         * Requirement explanation
         * exists but may be too shallow.
         */
        if (submission
            .requirementUnderstanding
            .trim()
            .length < 80) {
            findings.push({
                code: "SHALLOW_REQUIREMENT_EXPLANATION",
                severity: "WARNING",
                message: "Requirement understanding is quite brief and may not provide enough reasoning evidence.",
                evidenceRefs: [
                    "section:requirement-understanding",
                ],
            });
        }
        /*
         * Assumptions matter in LLD
         * because ambiguous requirements
         * are common.
         */
        if (submission.assumptions.length ===
            0) {
            findings.push({
                code: "NO_ASSUMPTIONS",
                severity: "INFO",
                message: "No assumptions were documented.",
                evidenceRefs: [
                    "section:assumptions",
                ],
            });
        }
        return {
            /*
             * Rules alone do not produce
             * a subjective design score.
             *
             * The LLM evaluator will
             * populate rubric scores.
             */
            overallScore: null,
            criteria: [],
            ruleFindings: findings,
        };
    }
}
