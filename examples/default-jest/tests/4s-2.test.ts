import { sleep } from "./helper";

describe("test-4s-2", () => {
  it("2s-a", async () => {
    await sleep(2);
    expect(1).toBe(1);
  });

  it("2s-b", async () => {
    await sleep(2);
    expect(1).toBe(1);
  });
});
