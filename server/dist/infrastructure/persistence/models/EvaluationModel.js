import { model, Schema, } from "mongoose";
const EvaluationSchema = new Schema({
    evaluationId: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    attemptId: {
        type: String,
        required: true,
        index: true,
    },
    evaluatorKey: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: [
            "PENDING",
            "RUNNING",
            "COMPLETED",
            "FAILED",
        ],
        required: true,
    },
    result: {
        type: Schema.Types.Mixed,
        default: null,
    },
    errorMessage: {
        type: String,
        default: null,
    },
    startedAt: {
        type: Date,
        default: null,
    },
    completedAt: {
        type: Date,
        default: null,
    },
}, {
    timestamps: true,
});
EvaluationSchema.index({
    attemptId: 1,
    createdAt: -1,
});
export const EvaluationModel = model("Evaluation", EvaluationSchema);
