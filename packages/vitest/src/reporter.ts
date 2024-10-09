import * as fs from "node:fs";
import * as path from "node:path";
import type { RunnerTestFile } from "vitest";
import { DefaultReporter } from "vitest/reporters";

const FILENAME = "tenbin-report.json";

export default class TenbinReporter extends DefaultReporter {
  private durations: Record<string, number> = {};

  onFinished(files?: RunnerTestFile[]): void {
    if (!files) return;
    for (const file of files) {
      this.durations[file.name] = this.getDuration(file) / 1000;
    }
    try {
      fs.writeFileSync(
        path.join(process.cwd(), FILENAME),
        JSON.stringify(this.durations),
      );
      console.log(
        `Test durations written to ${path.join(process.cwd(), FILENAME)}`,
      );
    } catch (err) {
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
