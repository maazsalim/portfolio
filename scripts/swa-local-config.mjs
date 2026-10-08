// Writes a copy of the built staticwebapp.config.json for the local SWA emulator.
//
// The SWA CLI validates against a bundled schema that lags behind Azure: it
// rejects apiRuntime "dotnet-isolated:10.0", which Azure supports
// (https://learn.microsoft.com/azure/static-web-apps/languages-runtimes).
// The platform section only matters in the cloud (locally we run `func start`
// ourselves), so it's dropped from the local copy. Everything else, including
// routes and security headers, is tested exactly as deployed.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const root = new URL("..", import.meta.url).pathname;
const config = JSON.parse(readFileSync(`${root}web/out/staticwebapp.config.json`, "utf8"));
delete config.platform;

mkdirSync(`${root}.swa`, { recursive: true });
writeFileSync(`${root}.swa/staticwebapp.config.json`, JSON.stringify(config, null, 2));
console.log("Wrote .swa/staticwebapp.config.json for the local emulator");
