import { expect, test } from "@playwright/test";
import { sleep } from "./helper";

test.describe("test-2s-5-a", () => {
  test("1s", async () => {
    await sleep(1);
    expect(1).toBe(1);
  });

  test.describe("test-2s-5-b", () => {
    test("1s", async () => {
      await sleep(1);
      expect(1).toBe(1);
    });
  });
});
