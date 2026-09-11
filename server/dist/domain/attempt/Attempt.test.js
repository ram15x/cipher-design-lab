import { describe, expect, it, } from "vitest";
import { Attempt, } from "./Attempt.js";
const validSubmission = {
    requirementUnderstanding: "The parking system should manage vehicle entry and exit, allocate compatible parking spots, create tickets, and calculate parking fees.",
    assumptions: [
        "Every vehicle has a unique registration number.",
        "One vehicle occupies only one parking spot at a time.",
    ],
    classes: [
        {
            name: "ParkingLot",
            responsibility: "Coordinates parking operations and delegates parking spot allocation.",
        },
        {
            name: "ParkingSpot",
            responsibility: "Represents an individual parking location and tracks its availability.",
        },
    ],
    interfaces: [
        {
            name: "ParkingStrategy",
            purpose: "Encapsulates replaceable parking spot allocation behaviour.",
            methods: [
                "findSpot(vehicleType)",
            ],
        },
    ],
    relationships: [
        {
            from: "ParkingLot",
            to: "ParkingStrategy",
            type: "DEPENDENCY",
            description: "ParkingLot delegates allocation decisions to ParkingStrategy.",
        },
    ],
    tradeOffs: [
        "Introducing ParkingStrategy adds abstraction but keeps allocation policies replaceable.",
    ],
    edgeCases: [
        "Parking lot is full.",
    ],
};
function createAttempt() {
    return Attempt.start({
        learnerId: "learner-test-001",
        problemId: "problem-test-001",
        problemSlug: "parking-lot",
        attemptNumber: 1,
    });
}
describe("Attempt domain entity", () => {
    it("starts a new attempt in DRAFT state", () => {
        const attempt = createAttempt();
        expect(attempt.status).toBe("DRAFT");
        expect(attempt.attemptNumber).toBe(1);
        expect(attempt.problemSlug).toBe("parking-lot");
    });
    it("allows a learner to update a draft", () => {
        const attempt = createAttempt();
        attempt.updateDraft(validSubmission);
        const stored = attempt.toObject();
        expect(stored.submission
            .classes).toHaveLength(2);
        expect(stored.submission
            .requirementUnderstanding).toBe(validSubmission
            .requirementUnderstanding);
    });
    it("submits a meaningful draft", () => {
        const attempt = createAttempt();
        attempt.updateDraft(validSubmission);
        attempt.submit();
        expect(attempt.status).toBe("SUBMITTED");
        expect(attempt
            .toObject()
            .submittedAt).toBeInstanceOf(Date);
    });
    it("rejects an empty submission", () => {
        const attempt = createAttempt();
        try {
            attempt.submit();
            throw new Error("Expected submit to fail");
        }
        catch (error) {
            expect(error).toBeInstanceOf(Error);
            expect(error
                .name).toBe("SubmissionValidationError");
            expect(error
                .message).toContain("Requirement understanding must contain at least 20 characters");
        }
    });
    it("rejects a submission with fewer than two classes", () => {
        const attempt = createAttempt();
        attempt.updateDraft({
            ...validSubmission,
            classes: [
                validSubmission
                    .classes[0],
            ],
        });
        expect(() => attempt.submit()).toThrow("At least two classes must be described");
    });
    it("does not allow editing after submission", () => {
        const attempt = createAttempt();
        attempt.updateDraft(validSubmission);
        attempt.submit();
        try {
            attempt.updateDraft(validSubmission);
            throw new Error("Expected updateDraft to fail");
        }
        catch (error) {
            expect(error
                .name).toBe("InvalidAttemptStateError");
            expect(error
                .message).toBe("Only a draft attempt can be edited");
        }
    });
    it("does not allow duplicate submission", () => {
        const attempt = createAttempt();
        attempt.updateDraft(validSubmission);
        attempt.submit();
        expect(() => attempt.submit()).toThrow("Only a draft attempt can be submitted");
    });
    it("supports the successful evaluation lifecycle", () => {
        const attempt = createAttempt();
        attempt.updateDraft(validSubmission);
        attempt.submit();
        expect(attempt.status).toBe("SUBMITTED");
        attempt.markEvaluating();
        expect(attempt.status).toBe("EVALUATING");
        attempt.markCompleted();
        expect(attempt.status).toBe("COMPLETED");
    });
    it("supports the failed evaluation lifecycle", () => {
        const attempt = createAttempt();
        attempt.updateDraft(validSubmission);
        attempt.submit();
        attempt.markEvaluating();
        attempt.markFailed();
        expect(attempt.status).toBe("FAILED");
    });
    it("allows a failed evaluation to return to SUBMITTED for retry", () => {
        const attempt = createAttempt();
        attempt.updateDraft(validSubmission);
        attempt.submit();
        const originalSubmittedAt = attempt
            .toObject()
            .submittedAt;
        attempt.markEvaluating();
        attempt.markFailed();
        attempt.retryEvaluation();
        expect(attempt.status).toBe("SUBMITTED");
        /*
         * Evaluation retry must not
         * pretend the learner submitted
         * the design again.
         */
        expect(attempt
            .toObject()
            .submittedAt).toEqual(originalSubmittedAt);
    });
    it("does not allow a completed attempt to retry evaluation", () => {
        const attempt = createAttempt();
        attempt.updateDraft(validSubmission);
        attempt.submit();
        attempt.markEvaluating();
        attempt.markCompleted();
        try {
            attempt.retryEvaluation();
            throw new Error("Expected retryEvaluation to fail");
        }
        catch (error) {
            expect(error
                .name).toBe("InvalidAttemptStateError");
            expect(error
                .message).toBe("Only a failed attempt can retry evaluation");
        }
    });
    it("does not allow evaluation to start directly from DRAFT", () => {
        const attempt = createAttempt();
        expect(() => attempt.markEvaluating()).toThrow("Only a submitted attempt can begin evaluation");
    });
    it("returns a defensive copy of submission data", () => {
        const attempt = createAttempt();
        attempt.updateDraft(validSubmission);
        const copy = attempt.toObject();
        copy.submission
            .classes[0]
            .name =
            "ModifiedOutsideDomain";
        const freshCopy = attempt.toObject();
        expect(freshCopy
            .submission
            .classes[0]
            .name).toBe("ParkingLot");
    });
});
