import { sleep } from "./helper";

describe("test-4s-1", () => {
  it("4s", async () => {
    await sleep(4);
    expect(1).toBe(1);
  });
});
