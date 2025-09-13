import { defineConfig } from "../../src/config";

export default defineConfig({
  site: {
    siteTitle: "Blog Site Example",
    description: "これは /examples/blog-site のテスト用設定です。",
    baseUrl: "/",
  },

  paths: {
    postsDir: "posts",
    outputDir: "dist",
    templateDir: "templates/minimal",
  },

  options: {
    cleanOutputDir: true,
  }
});
