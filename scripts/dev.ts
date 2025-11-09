// build script for development use

import { buildSite } from "../src/core/compiler";

const EXAMPLE_DIR = "examples/blog";

console.log("🍡 Mitarashi Development Build");
console.log(`🍡 Target: ${EXAMPLE_DIR}\n`);

try {
  const startTime = Date.now();
  await buildSite(EXAMPLE_DIR);
  const duration = Date.now() - startTime;

  console.log(`\n🍡 Build completed in ${duration}ms`);
  console.log(`🍡 Output: ${EXAMPLE_DIR}/dist/`);
  console.log(`\n🍡 View the site: open ${EXAMPLE_DIR}/dist/index.html`);
} catch (error) {
  console.error("\n🍡 Build failed:");
  console.error(error);
  process.exit(1);
}
