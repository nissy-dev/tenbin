import * as fs from "node:fs";
import * as path from "node:path";
import type { Test } from "@jest/test-result";
import Sequencer from "@jest/test-sequencer";
import type { ShardOptions } from "@jest/test-sequencer";
import { partition } from "@tenbin/core";
import { REPORT_FILENAME, logger } from "./utils";

// if value is 0, partition won't work correctly
const FALLBACK_DURATION = 0.1;

export default class TenbinSequencer extends Sequencer {
  private durations: Record<string, number> = {};

  constructor() {
    super();
    this.durations = this.loadDurations();
  }

  shard(
    tests: Array<Test>,
    options: ShardOptions,
  ): Array<Test> | Promise<Array<Test>> {
    for (const test of tests) {
      const relativePath = path.relative(process.cwd(), test.path);
      test.duration = this.durations[relativePath] ?? FALLBACK_DURATION;
    }
    const partitions = partition<Test>(
      tests,
      options.shardCount,
      (test) => test.duration ?? FALLBACK_DURATION,
    );
    return partitions[options.shardIndex - 1];
  }

  private loadDurations(): Record<string, number> {
    const filePath = path.join(process.cwd(), REPORT_FILENAME);
    try {
      const durations = JSON.parse(fs.readFileSync(filePath, "utf8"));
      logger("Load tenbin-report.json successfully");
      return durations;
    } catch (_err) {
      logger(`Failed to load tenbin-report.json from ${filePath}`);
      return {};
    }
  }
}
