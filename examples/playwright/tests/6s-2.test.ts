import { expect, test } from "@playwright/test";
import { sleep } from "./helper";

test.describe("test-6s-2", () => {
  test("4s", async () => {
    await sleep(4);
    expect(1).toBe(1);
  });

  test("2s", async () => {
    await sleep(2);
    expect(1).toBe(1);
  });
});
