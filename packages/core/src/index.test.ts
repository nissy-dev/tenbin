import { describe, expect, test } from "vitest";
import { partition } from "./index";

const range = (start: number, end: number) => {
  const array: number[] = [];
  for (let i = start; i <= end; i++) {
    array.push(i);
  }
  return array;
};

describe("partition", () => {
  test("number array", () => {
    expect(partition([4, 5, 6, 7, 8], 2)).toEqual([
      [6, 8],
      [4, 5, 7],
    ]);
    expect(partition([4, 5, 6, 7, 8], 3)).toEqual([[8], [4, 7], [5, 6]]);
    expect(partition([5, 6, 4, 8, 7], 3)).toEqual([[8], [4, 7], [5, 6]]);
    expect(partition(range(10, 30), 3)).toEqual([
      [10, 15, 16, 21, 22, 27, 28], // = 129
      [11, 14, 17, 20, 23, 26, 29], // = 130
      [12, 13, 18, 19, 24, 25, 30], // = 131
    ]);
  });

  test("object array", () => {
    expect(
      partition(
        [{ value: 4 }, { value: 5 }, { value: 6 }, { value: 7 }, { value: 8 }],
        2,
        (item) => item.value,
      ),
    ).toEqual([
      [{ value: 6 }, { value: 8 }],
      [{ value: 4 }, { value: 5 }, { value: 7 }],
    ]);
  });
});
