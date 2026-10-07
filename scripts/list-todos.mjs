// Lists placeholder content still marked TODO, so nothing ships half-finished.
// Usage: npm run todo
import { readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const dirs = ["web/content"];

let count = 0;
for (const dir of dirs) {
  for (const file of readdirSync(join(root, dir))) {
    if (file === "types.ts") continue; // documents the convention itself
    const path = join(root, dir, file);
    readFileSync(path, "utf8")
      .split("\n")
      .forEach((line, i) => {
        if (!line.includes("TODO")) return;
        count++;
        console.log(`${relative(root, path)}:${i + 1}  ${line.trim()}`);
      });
  }
}

console.log(count === 0 ? "No TODOs left." : `\n${count} TODO(s) remaining.`);
