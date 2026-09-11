import { createApp } from "./app.js";

import { env } from "./config/env.js";

import { connectDatabase } from "./infrastructure/db/mongoose.js";

async function bootstrap() {
  await connectDatabase();

  const app =
    createApp();

  app.listen(
    env.PORT,

    () => {
      console.log(
        `🚀 Cipher DesignLab API`
      );

      console.log(
        `http://localhost:${env.PORT}`
      );
    }
  );
}

bootstrap().catch(
  (error) => {
    console.error(
      "❌ Server failed to start",
      error
    );

    process.exit(1);
  }
);