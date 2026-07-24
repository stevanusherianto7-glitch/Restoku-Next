// Shared MSW seed helpers for placeholder features (Restoku-Next).
// Used by src/mocks/handlers/* to generate stable-ish mock IDs and simulate latency.

let counter = 0;

export function makeId(prefix: string): string {
  counter += 1;
  return `${prefix}_${counter.toString().padStart(4, "0")}`;
}

export function delay(ms = 250): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
