# @tenbin/playwright

`@tenbin/playwright` provides the test split function for custom sharding.

## Usage

Install:

```sh
npm i @tenbin/playwright -D
```

Playwright configuration:

```js
import { defineConfig } from "@playwright/test";
import { splitTests } from "@tenbin/playwright";

export default defineConfig({
  testMatch: splitTests({
    shard: process.env.TENBIN_SHARD,
    pattern: ["tests/**.test.ts"],
    reportFile: "./test-results.json",
  }),
  reporter: [["blob", { fileName: process.env.REPORT_FILE_NAME }]],
});
```

GitHub Actions:

```yaml
name: examples workflow
on:
  push:

jobs:
  use-tenbin-playwright:
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
      # Restore test-results.json file, which records the execution time of each test file.
      # splitTests function use this file for sharding.
      - name: Restore test-results.json
        uses: actions/cache/restore@v4
        with:
          path: test-results.json
          key: test-results
          restore-keys: |
            test-results-*
      - name: Run test
        run: pnpm exec playwright test
        env:
          # these variables are used in playwright.config.js
          TENBIN_SHARD: ${{ matrix.shardIndex }}/${{ matrix.shardTotal }}
          REPORT_FILE_NAME: report-${{ matrix.shardIndex }}.zip
      # see: https://playwright.dev/docs/test-sharding#github-actions-example
      - name: Upload blob report
        if: github.ref_name == 'main'
        uses: actions/upload-artifact@v4
        with:
          name: blob-report-${{ matrix.shardIndex }}
          path: blob-report

  # Merge and cache test-results.json
  cache-test-results:
    if: github.ref_name == 'main'
    runs-on: ubuntu-latest
    needs: [use-tenbin-playwright]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: "pnpm"
      - uses: pnpm/action-setup@v4
        with:
          version: "9"
      - uses: actions/download-artifact@v4
        with:
          path: all-blob-reports
          pattern: blob-report-*
          merge-multiple: true
      - name: Merge blob reports into json
        run: pnpm dlx playwright merge-reports --reporter json ./all-blob-reports > test-results.json
      - name: Cache test-results.json
        uses: actions/cache/save@v4
        with:
          path: test-results.json
          key: test-results-${{ github.run_id }}
```
