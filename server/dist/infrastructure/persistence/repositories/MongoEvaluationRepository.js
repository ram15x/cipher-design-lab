import { Evaluation, } from "../../../domain/evaluation/Evaluation.js";
import { EvaluationModel, } from "../models/EvaluationModel.js";
function toDomain(document) {
    const props = {
        id: document.evaluationId,
        attemptId: document.attemptId,
        evaluatorKey: document.evaluatorKey,
        status: document.status,
        result: document.result ?? null,
        errorMessage: document.errorMessage ??
            null,
        startedAt: document.startedAt ??
            null,
        completedAt: document.completedAt ??
            null,
        createdAt: document.createdAt,
        updatedAt: document.updatedAt,
    };
    return Evaluation.restore(props);
}
export class MongoEvaluationRepository {
    async save(evaluation) {
        const data = evaluation.toObject();
        await EvaluationModel.updateOne({
            evaluationId: data.id,
        }, {
            $set: {
                attemptId: data.attemptId,
                evaluatorKey: data.evaluatorKey,
                status: data.status,
                result: data.result,
                errorMessage: data.errorMessage,
                startedAt: data.startedAt,
                completedAt: data.completedAt,
            },
        }, {
            upsert: true,
        });
    }
    async findLatestForAttempt(attemptId) {
        const document = await EvaluationModel
            .findOne({
            attemptId,
        })
            .sort({
            createdAt: -1,
        })
            .lean();
        if (!document) {
            return null;
        }
        return toDomain(document);
    }
}
