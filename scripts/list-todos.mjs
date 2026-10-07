// Lists placeholder content still marked TODO, so nothing ships half-finished.
// Usage: npm run todo
import { readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const dirs = ["web/content"];
const files = ["README.md"];

const paths = [
  ...dirs.flatMap((dir) =>
    readdirSync(join(root, dir))
      .filter((file) => file !== "types.ts") // documents the convention itself
      .map((file) => join(root, dir, file)),
  ),
  ...files.map((file) => join(root, file)),
];

let count = 0;
for (const path of paths) {
  readFileSync(path, "utf8")
    .split("\n")
    .forEach((line, i) => {
      if (!line.includes("TODO")) return;
      count++;
      console.log(`${relative(root, path)}:${i + 1}  ${line.trim()}`);
    });
}

console.log(count === 0 ? "No TODOs left." : `\n${count} TODO(s) remaining.`);
