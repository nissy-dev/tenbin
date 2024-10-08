# @tenbin/vitest

`@tenbin/vitest` provides custom reporter and sequencer for Vitest.

## Usage

Install:

```sh
npm i @tenbin/vitest -D
```

Vitest configuration:

```ts
import TenbinReporter from "@tenbin/vitest/reporter";
import TenbinSequencer from "@tenbin/vitest/sequencer";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    reporters: [new TenbinReporter()],
    sequence: {
      sequencer: TenbinSequencer,
    },
  },
});
```

GitHub Actions:

```yaml
name: examples workflow
on:
  push:

jobs:
  use-tenbin-vitest:
    runs-on: ubuntu-latest
    strategy:
      fail-fast: false
      matrix:
        shardIndex: [1, 2, 3]
        shardTotal: [3]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: "pnpm"
      - uses: pnpm/action-setup@v4
        with:
          version: "9"
      - name: Install dependencies
        run: pnpm install
      - name: Run build
        run: pnpm run build
      # Restore the tenbin-report.json file, which records the execution time of each test file.
      # @tenbin/vitest/sequencer use this file for sharding.
      - name: Restore tenbin-report.json
        id: tenbin-report-cache
        uses: actions/cache/restore@v4
        with:
          path: tenbin-report.json
          key: tenbin-report
          restore-keys: |
            tenbin-report-*
      - name: Run test
        run: pnpx vitest --shard=${{ matrix.shardIndex }}/${{ matrix.shardTotal }}
      # @tenbin/vitest/reporter generates a tenbin-report.json for each shard.
      - name: Upload tenbin-report.json
        if: github.ref_name == 'main'
        uses: actions/upload-artifact@v4
        with:
          name: tenbin-report-${{ matrix.shardIndex }}
          path: tenbin-report.json

  # Merge and cache tenbin-report.json
  cache-tenbin-report:
    if: github.ref_name == 'main'
    runs-on: ubuntu-latest
    needs: [use-tenbin-vitest]
    steps:
      - uses: actions/download-artifact@v4
        with:
          path: tenbin-report
          pattern: tenbin-report-*
      - name: Merge  tenbin-report
        run: jq -s add tenbin-report/**/tenbin-report.json > tenbin-report.json
      - name: Cache tenbin-report.json
        uses: actions/cache/save@v4
        with:
          path: tenbin-report.json
          key: tenbin-report-${{ github.run_id }}
```
