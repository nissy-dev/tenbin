import { sleep } from "./helper";

describe("test-8s-1-a", () => {
  it("4s", async () => {
    await sleep(4);
    expect(1).toBe(1);
  });
});

describe("test-8s-1-b", () => {
  it("4s", async () => {
    await sleep(4);
    expect(1).toBe(1);
  });
});
