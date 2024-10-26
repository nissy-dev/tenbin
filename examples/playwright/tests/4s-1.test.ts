import { expect, test } from "@playwright/test";
import { sleep } from "./helper";

test.describe("test-4s-1", () => {
  test("4s", async () => {
    await sleep(4);
    expect(1).toBe(1);
  });
});
