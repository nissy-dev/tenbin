import * as fs from "node:fs";
import * as path from "node:path";
import { partition } from "@tenbin/core";
import { BaseSequencer, type Vitest, type WorkspaceSpec } from "vitest/node";
import { REPORT_FILENAME, logger } from "./utils";

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
    const filePath = path.join(process.cwd(), REPORT_FILENAME);
    try {
      const durations = JSON.parse(fs.readFileSync(filePath, "utf8"));
      logger("Load tenbin-report.json successfully");
      return durations;
    } catch (err) {
      logger(`Failed to load tenbin-report.json from ${filePath}`);
      return {};
    }
  }
}
