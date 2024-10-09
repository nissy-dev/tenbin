import * as fs from "node:fs";
import * as path from "node:path";
import { partition } from "@tenbin/core";
import { BaseSequencer, type Vitest, type WorkspaceSpec } from "vitest/node";

const FILENAME = "tenbin-report.json";
// if value is 0, partition won't work correctly
const FALLBACK_DURATION = 0.1;

export default class TenbinSequencer extends BaseSequencer {
  private durations: Record<string, number> = {};

  constructor(ctx: Vitest) {
    super(ctx);
    this.durations = this.loadDurations();
  }

  async shard(files: WorkspaceSpec[]): Promise<WorkspaceSpec[]> {
    const { config } = this.ctx;
    if (!config.shard) {
      return files;
    }
    const filesWithDuration = files.map((file) => {
      const relativePath = path.relative(process.cwd(), file.moduleId);
      const duration = this.durations[relativePath] ?? FALLBACK_DURATION;
      return { file, duration: duration };
    });
    const partitions = partition(
      filesWithDuration,
      config.shard.count,
      (test) => test.duration ?? FALLBACK_DURATION,
    );
    return partitions[config.shard.index - 1].map((test) => test.file);
  }

  private loadDurations(): Record<string, number> {
    try {
      return JSON.parse(
        fs.readFileSync(path.join(process.cwd(), FILENAME), "utf8"),
      );
    } catch (err) {
      console.log(
        "Failed to load tenbin-report.json, so sharding may be efficient",
      );
      return {};
    }
  }
}
