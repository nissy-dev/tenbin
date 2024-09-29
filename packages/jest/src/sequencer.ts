import type { Test } from "@jest/test-result";
import Sequencer from "@jest/test-sequencer";
import type { ShardOptions } from "@jest/test-sequencer";

export default class TenbinSequencer extends Sequencer {
  shard(
    tests: Array<Test>,
    options: ShardOptions,
  ): Array<Test> | Promise<Array<Test>> {
    console.log("TenbinSequencer shard");
    const shardSize = Math.ceil(tests.length / options.shardCount);
    const shardStart = shardSize * (options.shardIndex - 1);
    const shardEnd = shardSize * options.shardIndex;
    return [...tests]
      .sort((a, b) => (a.path > b.path ? 1 : -1))
      .slice(shardStart, shardEnd);
  }
}
