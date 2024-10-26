import { defineConfig } from "@playwright/test";
import { splitTests } from "@tenbin/playwright";

export default defineConfig({
  fullyParallel: false,
  workers: 1,
  testMatch: splitTests({
    shard: process.env.TENBIN_SHARD,
    pattern: ["tests/**.test.ts"],
    reportFile: "./test-results.json",
  }),
  reporter: [["blob", { fileName: process.env.REPORT_FILE_NAME }]],
});
