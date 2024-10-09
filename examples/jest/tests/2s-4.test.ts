import { sleep } from "./helper";

describe("test-2s-4-a", () => {
  it("1s", async () => {
    await sleep(1);
    expect(1).toBe(1);
  });
});

describe("test-2s-4-b", () => {
  it("1s", async () => {
    await sleep(1);
    expect(1).toBe(1);
  });
});
