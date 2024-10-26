import { expect, test } from "@playwright/test";
import { sleep } from "./helper";

test.describe("test-1s-9", () => {
  test("1s", async () => {
    await sleep(1);
    expect(1).toBe(1);
  });
});
