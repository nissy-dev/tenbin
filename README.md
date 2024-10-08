# tenbin

Tenbin is tools for minimizing the difference of execution time in each shard.

## Usage

- [Jest](./packages/jest/README.md)
- Vitest (WIP)

## Why

A general test runner implements a sharding feature that allows tests to be split up and run on different machines.
However, the sharding algorithm seems to be a random split, resulting in differences in the execution time of each shard.

For example:

| shard | time |
| ----- | ---- |
| 1/3 | 3min |
| 2/3 | 5min |
| 3/3 | 4min |

Tenbin provide tools for minimizing the difference of execution time in each shard.

Use tenbin:

| shard | time |
| ----- | ---- |
| 1/3 | 4min |
| 2/3 | 4min |
| 3/3 | 4min |

The optimization of the sharding algorithm is considered in E2E testing tools where test execution time is a critical issue.
For example, in Playwright, this is being discussed in [playwright#17969](https://github.com/microsoft/playwright/issues/17969), and [it seems some implementation is progressing](https://github.com/microsoft/playwright/pull/30962).
In Cypress, the ["load-balancing strategy"](https://docs.cypress.io/guides/cloud/smart-orchestration/load-balancing) is available. 
