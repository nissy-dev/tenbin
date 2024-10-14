import pc from "picocolors";

export const REPORT_FILENAME = "tenbin-report.json";

export const logger = (log: string) =>
  console.log(pc.gray(`\n[tenbin]: ${log}`));
