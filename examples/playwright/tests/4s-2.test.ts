import { expect, test } from "@playwright/test";
import { sleep } from "./helper";

test.describe("test-4s-2", () => {
  test("2s-a", async () => {
    await sleep(2);
    expect(1).toBe(1);
  });

  test("2s-b", async () => {
    await sleep(2);
    expect(1).toBe(1);
  });
});