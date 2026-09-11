import {
  model,
  Schema,
} from "mongoose";

const DesignClassSchema =
  new Schema(
    {
      name: {
        type: String,
        required: true,
      },

      responsibility: {
        type: String,
        required: true,
      },
    },
    {
      _id: false,
    }
  );

const DesignInterfaceSchema =
  new Schema(
    {
      name: {
        type: String,
        required: true,
      },

      purpose: {
        type: String,
        required: true,
      },

      methods: [
        {
          type: String,
        },
      ],
    },
    {
      _id: false,
    }
  );

const DesignRelationshipSchema =
  new Schema(
    {
      from: {
        type: String,
        required: true,
      },

      to: {
        type: String,
        required: true,
      },

      type: {
        type: String,

        enum: [
          "ASSOCIATION",
          "COMPOSITION",
          "AGGREGATION",
          "INHERITANCE",
          "DEPENDENCY",
        ],

        required: true,
      },

      description: {
        type: String,
        required: true,
      },
    },
    {
      _id: false,
    }
  );

const StructuredSubmissionSchema =
  new Schema(
    {
      requirementUnderstanding: {
        type: String,
        default: "",
      },

      assumptions: [
        {
          type: String,
        },
      ],

      classes: [
        DesignClassSchema,
      ],

      interfaces: [
        DesignInterfaceSchema,
      ],

      relationships: [
        DesignRelationshipSchema,
      ],

      tradeOffs: [
        {
          type: String,
        },
      ],

      edgeCases: [
        {
          type: String,
        },
      ],
    },
    {
      _id: false,
    }
  );

const AttemptSchema =
  new Schema(
    {
      attemptId: {
        type: String,
        required: true,
        unique: true,
        index: true,
      },

      learnerId: {
        type: String,
        required: true,
        index: true,
      },

      problemId: {
        type: String,
        required: true,
        index: true,
      },

      problemSlug: {
        type: String,
        required: true,
      },

      attemptNumber: {
        type: Number,
        required: true,
      },

      status: {
        type: String,

        enum: [
          "DRAFT",
          "SUBMITTED",
          "EVALUATING",
          "COMPLETED",
          "FAILED",
        ],

        required: true,
      },

      submission: {
        type:
          StructuredSubmissionSchema,

        required: true,
      },

      previousAttemptId: {
        type: String,
        default: null,
      },

      submittedAt: {
        type: Date,
        default: null,
      },
    },

    {
      timestamps: true,
    }
  );

AttemptSchema.index(
  {
    learnerId: 1,
    problemId: 1,
    attemptNumber: 1,
  },
  {
    unique: true,
  }
);

export const AttemptModel =
  model(
    "Attempt",
    AttemptSchema
  );