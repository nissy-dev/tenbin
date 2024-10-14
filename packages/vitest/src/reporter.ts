import * as fs from "node:fs";
import * as path from "node:path";
import type { RunnerTestFile } from "vitest";
import { DefaultReporter } from "vitest/reporters";
import { REPORT_FILENAME, logger } from "./utils";

export default class TenbinReporter extends DefaultReporter {
  private durations: Record<string, number> = {};

  onFinished(files?: RunnerTestFile[]): void {
    if (!files) return;
    for (const file of files) {
      this.durations[file.name] = this.getDuration(file) / 1000;
    }
    const reportFilePath = path.join(process.cwd(), REPORT_FILENAME);
    try {
      fs.writeFileSync(reportFilePath, JSON.stringify(this.durations));
      logger(`tenbin-report.json written to ${reportFilePath}`);
    } catch (err) {
      logger("Failed to generate tenbin-report.json");
      console.error(err);
    }
  }

  private getDuration(file: RunnerTestFile): number {
    let duration = 0;
    for (const task of file.tasks) {
      duration += task.result?.duration ?? 0;
    }
    return duration;
  }
}
