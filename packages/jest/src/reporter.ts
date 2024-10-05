import * as fs from "node:fs";
import * as path from "node:path";
import type {
  AggregatedResult,
  Reporter,
  Test,
  TestResult,
} from "@jest/reporters";

const FILENAME = "tenbin-report.json";

export default class TenbinReporter implements Reporter {
  private durations: Record<string, number> = {};

  onTestResult(test: Test, testResult: TestResult): void {
    const relativePath = path.relative(process.cwd(), test.path);
    this.durations[relativePath] = this.getDuration(test, testResult) / 1000;
  }

  onRunComplete(_: unknown, results: AggregatedResult): void {
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

  private getDuration(test: Test, testResult: TestResult): number {
    if (test.duration !== undefined) {
      return test.duration;
    }
    const { start, end } = testResult.perfStats;
    return start && end ? end - start : 0;
  }
}
