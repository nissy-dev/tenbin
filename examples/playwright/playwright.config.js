import { defineConfig } from "@playwright/test";

export default defineConfig({
  fullyParallel: false,
  workers: 1,
  testMatch: ["tests/**.test.ts"],
  reporter: [["blob"]],
});
