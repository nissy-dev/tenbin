import TenbinReporter from "@tenbin/vitest/reporter";
import TenbinSequencer from "@tenbin/vitest/sequencer";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    fileParallelism: false,
    reporters: [new TenbinReporter()],
    sequence: {
      sequencer: TenbinSequencer,
    },
  },
});
