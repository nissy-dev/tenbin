import { expect, test } from "@playwright/test";
import { sleep } from "./helper";

test.describe("test-2s-1", () => {
  test("2s", async () => {
    await sleep(2);
    expect(1).toBe(1);
  });
});
