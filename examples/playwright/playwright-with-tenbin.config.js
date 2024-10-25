import { defineConfig } from "@playwright/test";
import { splitTests } from "@tenbin/playwright";

export default defineConfig({
  fullyParallel: false,
  workers: 1,
  testMatch: splitTests({
    pattern: ["tests/**.test.ts"],
    reportFile: "./test-results.json",
  }),
  reporter: [["json", { outputFile: "test-results.json" }]],
});
