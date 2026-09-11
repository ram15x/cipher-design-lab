import {
  defineConfig,
} from "vitest/config";

export default defineConfig({
  test: {
    /*
     * Only source test files should run.
     *
     * Never execute compiled test artifacts
     * from the production dist directory.
     */
    include: [
      "src/**/*.test.ts",
    ],

    exclude: [
      "dist/**",
      "node_modules/**",
    ],
  },
});