import {
  model,
  Schema,
} from "mongoose";

interface ProblemRecord {
  slug: string;

  title: string;

  difficulty:
    | "BEGINNER"
    | "INTERMEDIATE";

  brief: string;

  requirements: string[];

  constraints: string[];

  changeScenarios: string[];

  createdAt: Date;

  updatedAt: Date;
}

const ProblemSchema =
  new Schema<ProblemRecord>(
    {
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
    },

    {
      timestamps: true,
    }
  );

export const ProblemModel =
  model<ProblemRecord>(
    "Problem",
    ProblemSchema
  );