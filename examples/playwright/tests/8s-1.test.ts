import { expect, test } from "@playwright/test";
import { sleep } from "./helper";

test.describe("test-8s-1-a", () => {
  test("4s", async () => {
    await sleep(4);
    expect(1).toBe(1);
  });
});

test.describe("test-8s-1-b", () => {
  test("4s", async () => {
    await sleep(4);
    expect(1).toBe(1);
  });
});
