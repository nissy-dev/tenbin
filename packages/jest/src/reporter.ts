import type { Reporter } from "@jest/reporters";

export default class TenbinReporter implements Reporter {
  onRunComplete() {
    console.log("TenbinReporter.onRunComplete");
  }
}
