#!/usr/bin/env -S node --import tsx/esm

import { buildSite } from "../dist/core/compiler.js";
import path from "path";

const targetDir = process.argv[2] || process.cwd();
const rootDir = path.resolve(targetDir);

console.log("🍡 Mitarashi - Static Site Generator");
console.log(`🍡 Target: ${rootDir}\n`);

try {
  const startTime = Date.now();
  await buildSite(rootDir);
  const duration = Date.now() - startTime;

  console.log(`\n🍡 Build completed in ${duration}ms`);
  console.log(`🍡 Output: ${rootDir}/dist/`);
} catch (error) {
  console.error("\n🍡 Build failed:");
  console.error(error);
  process.exit(1);
}
