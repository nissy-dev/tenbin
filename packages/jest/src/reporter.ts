import * as fs from "node:fs";
import * as path from "node:path";
import type {
  AggregatedResult,
  Reporter,
  Test,
  TestResult,
} from "@jest/reporters";
import { REPORT_FILENAME, logger } from "./utils";

export default class TenbinReporter implements Reporter {
  private durations: Record<string, number> = {};

  onTestResult(test: Test, testResult: TestResult): void {
    const relativePath = path.relative(process.cwd(), test.path);
    this.durations[relativePath] = this.getDuration(test, testResult) / 1000;
  }

  onRunComplete(_: unknown, results: AggregatedResult): void {
    const reportFilePath = path.join(process.cwd(), REPORT_FILENAME);
    try {
      fs.writeFileSync(reportFilePath, JSON.stringify(this.durations));
      logger(`tenbin-report.json written to ${reportFilePath}`);
    } catch (err) {
      logger("Failed to generate tenbin-report.json");
      console.error(err);
    }
  }

  private getDuration(test: Test, testResult: TestResult): number {
    if (test.duration !== undefined) {
      return test.duration;
    }
    const { start, end } = testResult.perfStats;
    return start && end ? end - start : 0;
  }
}
