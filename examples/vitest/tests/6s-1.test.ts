import { describe, expect, it } from "vitest";
import { sleep } from "./helper";

describe("test-6s-1", () => {
  it("2s-a", async () => {
    await sleep(2);
    expect(1).toBe(1);
  });

  it("2s-b", async () => {
    await sleep(2);
    expect(1).toBe(1);
  });

  it("2s-c", async () => {
    await sleep(2);
    expect(1).toBe(1);
  });
});
