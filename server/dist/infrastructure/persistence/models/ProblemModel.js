import { model, Schema, } from "mongoose";
const ProblemSchema = new Schema({
    slug: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    title: {
        type: String,
        required: true,
    },
    difficulty: {
        type: String,
        required: true,
        enum: [
            "BEGINNER",
            "INTERMEDIATE",
        ],
    },
    brief: {
        type: String,
        required: true,
    },
    requirements: [
        {
            type: String,
            required: true,
        },
    ],
    constraints: [
        {
            type: String,
            required: true,
        },
    ],
    changeScenarios: [
        {
            type: String,
            required: true,
        },
    ],
}, {
    timestamps: true,
});
export const ProblemModel = model("Problem", ProblemSchema);
