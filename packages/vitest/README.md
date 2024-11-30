# @tenbin/vitest

`@tenbin/vitest` provides custom reporter and sequencer for Vitest.

## Usage

This package provide two modules:

### `TenbinReporter`

This module is served as the default export from `@tenbin/vitest/reporter`.

`TenbinReporter` generates a JSON report showing the execution time (in seconds) for each test file, as shown below:

```json:tenbin-report.json
{
  "tests/file-a.test.ts": 1.223,
  "tests/file-b.test.ts": 2.334,
  ...
}
```

The report is saved as `tenbin-report.json` in the current working directory (cwd). This file is uploaded to external storage, such as S3, and is used by `TenbinSequencer` when running next tests. In the case of GitHub Actions, the file can be stored using a cache that persists between workflows. (See the Example section for details.)

### `TenbinSequencer`

This module is served as the default export from `@tenbin/vitest/sequencer`.

`TenbinSequencer` reads the `tenbin-report.json` file from the current working directory (cwd) and splits tests to minimize the differences in test execution times across shards For test files not listed in `tenbin-report.json`, the execution time is assumed to be 0 seconds. If the tenbin-report.json file is not found, the shards are split randomly.

## Example

Install:

```sh
npm i @tenbin/vitest -D
```

Configuration:

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
      # Restore tenbin-report.json file, which records the execution time of each test file.
      # @tenbin/vitest/sequencer uses this file for sharding.
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
      # @tenbin/vitest/reporter generates tenbin-report.json for each shard.
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
