import { describe, expect, it } from "vitest";
import { sleep } from "./helper";

describe("test-1s-9", () => {
  it("1s", async () => {
    await sleep(1);
    expect(1).toBe(1);
  });
});
