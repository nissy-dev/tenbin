type Partition<T> = {
  partition: T[][];
  diff: number;
};

/**
 * Partition data into k partitions such that the difference between the sum of the values of each partition is minimized.
 * cf: https://en.wikipedia.org/wiki/Largest_differencing_method
 */
export function partition<T>(
  data: T[],
  k: number,
  keyFunc: (item: T) => number = (item) => Number(item),
): T[][] {
  if (k === 1) {
    throw new Error("k must be greater than 1");
  }

  let partitions: Partition<T>[] = Array.from(
    { length: data.length },
    (_, i) => {
      return {
        partition: Array.from({ length: k }, (_, k) =>
          k === 0 ? [data[i]] : [],
        ),
        diff: keyFunc(data[i]),
      };
    },
  );

  while (partitions.length > 1) {
    partitions = sortBy(partitions, (item) => item.diff, "asc");
    const partitionA = partitions.pop();
    const partitionB = partitions.pop();
    if (!partitionA || !partitionB) {
      throw new Error("partitionA or partitionB should not be undefined");
    }
    const sortedPartitionA = sortBy<T[]>(
      partitionA.partition,
      (item: T[]) => sum(item, keyFunc),
      "asc",
    );
    const sortedPartitionB = sortBy<T[]>(
      partitionB.partition,
      (item: T[]) => sum(item, keyFunc),
      "desc",
    );
    const newPartition = [];
    for (let i = 0; i < k; i++) {
      newPartition.push([...sortedPartitionA[i], ...sortedPartitionB[i]]);
    }
    partitions.push({
      partition: newPartition,
      diff: diff(newPartition.map((item) => sum(item, keyFunc))),
    });
  }
  return partitions[0].partition.map((item) => sortBy(item, keyFunc));
}

function sum<T>(
  array: T[],
  keyFunc: (item: T) => number = (item) => Number(item),
) {
  let sum = 0;
  for (let i = 0; i < array.length; i++) {
    sum += keyFunc(array[i]);
  }
  return sum;
}

const diff = (array: number[]) => {
  return max(array) - min(array);
};

const max = (array: number[]) => {
  let max = array[0];
  for (let i = 1; i < array.length; i++) {
    if (array[i] > max) {
      max = array[i];
    }
  }
  return max;
};

const min = (array: number[]) => {
  let min = array[0];
  for (let i = 1; i < array.length; i++) {
    if (array[i] < min) {
      min = array[i];
    }
  }
  return min;
};

const sortBy = <T>(
  array: T[],
  keyFunc: (item: T) => number = (item) => Number(item),
  order: "asc" | "desc" = "asc",
) => {
  return array.sort((a, b) => {
    const aKey = keyFunc(a);
    const bKey = keyFunc(b);
    return order === "asc" ? aKey - bKey : bKey - aKey;
  });
};
