import { sleep } from "./helper";

describe("test-2s-2", () => {
  it("2s", async () => {
    await sleep(2);
    expect(1).toBe(1);
  });
});
