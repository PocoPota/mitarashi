import { defineConfig } from "../../dist/index.js";

export default defineConfig({
  site: {
    siteTitle: "Blog Site Example",
    description: "これは /examples/blog-site のテスト用設定です。",
  },

  paths: {
    postsDir: "posts",
    outputDir: "dist",
    templateDir: "templates/minimal",
    customSyntaxFile: "mitarashi.syntax.json",
  },

  theme: {
    layout: "layout.html",
    post: "post.html"
  },

  options: {
    cleanOutputDir: true,
  }
});
