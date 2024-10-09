import { sleep } from "./helper";

describe("test-6s-2", () => {
  it("4s", async () => {
    await sleep(4);
    expect(1).toBe(1);
  });

  it("2s", async () => {
    await sleep(2);
    expect(1).toBe(1);
  });
});
