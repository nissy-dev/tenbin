import * as fs from "node:fs";
import * as path from "node:path";
import type { JSONReport, JSONReportSuite } from "@playwright/test/reporter";
import { partition } from "@tenbin/core";
import { globSync } from "glob";

// if value is 0, partition won't work correctly
const FALLBACK_DURATION = 0.1;

type Config = {
  shard: string;
  reportFile: string;
  pattern: string[];
};

type Test = {
  duration?: number;
  path: string;
};

export function splitTests(config: Config): string[] {
  const { shard, reportFile, pattern } = config;
  const tests: Test[] = globSync(pattern).map((path) => ({ path }));
  const { shardCount, shardIndex } = extractShardConfig(shard);
  const durations = loadDurations(reportFile);
  console.log(durations);
  for (const test of tests) {
    test.duration = durations[test.path] ?? FALLBACK_DURATION;
  }
  console.log(tests);
  const partitions = partition<Test>(
    tests,
    shardCount,
    (test) => test.duration ?? FALLBACK_DURATION,
  );
  return partitions[shardIndex - 1].map((test) => test.path);
}

type ShardConfig = {
  shardCount: number;
  shardIndex: number;
};

function extractShardConfig(shard: string): ShardConfig {
  try {
    const [shardIndex, shardCount] = shard.split("/");
    return { shardCount: Number(shardCount), shardIndex: Number(shardIndex) };
  } catch (err) {
    throw new Error(
      "The shard value is invalid. The value requires '<shardCount>/<shardIndex>' format.",
    );
  }
}

function loadDurations(reportFile: string): Record<string, number> {
  const filePath = path.join(process.cwd(), reportFile);
  try {
    const report: JSONReport = JSON.parse(fs.readFileSync(filePath, "utf8"));
    const durations: Record<string, number> = {};
    for (const suite of report.suites) {
      durations[suite.file] = calculateDuration(suite);
    }
    return durations;
  } catch (_err) {
    return {};
  }
}

function calculateDuration(suite: JSONReportSuite): number {
  let duration = 0;
  for (const spec of suite.specs) {
    for (const test of spec.tests) {
      for (const result of test.results) {
        duration += result.duration / 1000;
      }
    }
  }
  for (const test of suite.suites ?? []) {
    duration += calculateDuration(test);
  }
  return duration;
}
