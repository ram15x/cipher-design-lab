import {
  connectDatabase,
  disconnectDatabase,
} from "../infrastructure/db/mongoose.js";

import { ProblemModel } from "../infrastructure/persistence/models/ProblemModel.js";

import { problems } from "./problems.js";

async function seedProblems() {
  await connectDatabase();

  for (const problem of problems) {
    await ProblemModel.updateOne(
      {
        slug: problem.slug,
      },

      {
        $set: problem,
      },

      {
        upsert: true,
      }
    );
  }

  console.log(
    `✅ Seeded ${problems.length} LLD problems`
  );

  await disconnectDatabase();
}

seedProblems().catch(
  async (error) => {
    console.error(
      "❌ Problem seeding failed",
      error
    );

    await disconnectDatabase();

    process.exit(1);
  }
);