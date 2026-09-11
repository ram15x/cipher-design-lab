import { Attempt, } from "../../../domain/attempt/Attempt.js";
import { AttemptModel } from "../models/AttemptModel.js";
function toDomain(document) {
    const props = {
        id: document.attemptId,
        learnerId: document.learnerId,
        problemId: document.problemId,
        problemSlug: document.problemSlug,
        attemptNumber: document.attemptNumber,
        status: document.status,
        submission: document.submission,
        previousAttemptId: document.previousAttemptId ??
            null,
        submittedAt: document.submittedAt ??
            null,
        createdAt: document.createdAt,
        updatedAt: document.updatedAt,
    };
    return Attempt.restore(props);
}
export class MongoAttemptRepository {
    async save(attempt) {
        const data = attempt.toObject();
        await AttemptModel.updateOne({
            attemptId: data.id,
        }, {
            $set: {
                learnerId: data.learnerId,
                problemId: data.problemId,
                problemSlug: data.problemSlug,
                attemptNumber: data.attemptNumber,
                status: data.status,
                submission: data.submission,
                previousAttemptId: data.previousAttemptId,
                submittedAt: data.submittedAt,
            },
        }, {
            upsert: true,
        });
    }
    async findById(attemptId) {
        const document = await AttemptModel.findOne({
            attemptId,
        }).lean();
        if (!document) {
            return null;
        }
        return toDomain(document);
    }
    async countForLearnerAndProblem(learnerId, problemId) {
        return AttemptModel.countDocuments({
            learnerId,
            problemId,
        });
    }
    async findForLearner(learnerId) {
        const documents = await AttemptModel.find({
            learnerId,
        })
            .sort({
            createdAt: -1,
        })
            .lean();
        return documents.map(toDomain);
    }
}
