import { sleep } from "./helper";

describe("test-1s-5", () => {
  it("1s", async () => {
    await sleep(1);
    expect(1).toBe(1);
  });
});
