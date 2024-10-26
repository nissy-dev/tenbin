# Tenbin ⚖️

Tenbin provides tools to minimize the differences in test execution times across shards.

## Usage

- [Jest](./packages/jest/README.md)
- [Vitest](./packages/vitest/README.md)
- [Playwright](./packages/playwright/README.md)

## Why

A typical test runner implements a sharding feature that splits tests to run on different machines. However, the sharding algorithm often randomly splits tests, leading to uneven execution times across shards.

Tenbin provides tools to minimize the differences in execution time across shards.
It uses the execution times of past test run when splitting tests.

For example:

| shard | default | use tenbin |
| ----- | ------- | -----------|
|  1/3  | 3min    | 4min       |
|  2/3  | 5min    | 4min       |
|  3/3  | 4min    | 4min       |

The optimization of the sharding algorithm is considered in E2E testing tools where test execution time is a more critical issue.
In Playwright, this is being discussed in [playwright#17969](https://github.com/microsoft/playwright/issues/17969), and [it seems that some implementation is in progress](https://github.com/microsoft/playwright/pull/30962).
In Cypress, the ["load-balancing strategy"](https://docs.cypress.io/guides/cloud/smart-orchestration/load-balancing) is available. 
