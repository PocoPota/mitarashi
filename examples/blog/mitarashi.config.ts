import { defineConfig } from "../../src/config";

export default defineConfig({
  site: {
    title: "Blog Site Example",
    description: "これは /examples/blog-site のテスト用設定です。",
    baseUrl: "/",
  },

  paths: {
    contentDir: "posts",
    outputDir: "dist",
    templateDir: "templates/minimal",
  },
});
