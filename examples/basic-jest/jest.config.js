/** @type {import("@jest/types").Config.InitialOptions} */
module.exports = {
  transform: {
    "^.+\\.(t|j)sx?$": "@swc/jest",
  },
  testSequencer: "@tenbin/jest/sequencer",
  reporters: ["default", "@tenbin/jest/reporter"],
};
