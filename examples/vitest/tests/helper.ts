export const sleep = (second: number) =>
  new Promise((resolve) => setTimeout(resolve, 1000 * second));
