/** @type {import("jest").Config} */
module.exports = {
  transform: {
    "^.+\\.(t|j)sx?$": "@swc/jest",
  },
  maxWorkers: 1,
  testSequencer: "@tenbin/jest/sequencer",
  reporters: ["default", "@tenbin/jest/reporter"],
};
