# Mitarashi

## インストール

```bash
npm install mitarashi
```

## 使い方

### 1. プロジェクトの初期化

プロジェクトディレクトリに以下の構造を作成します：

```
my-blog/
├── mitarashi.config.ts
├── posts/
│   └── hello.md
└── templates/
    └── minimal/
        ├── layout.html
        ├── post.html
        └── index.html
```

### 2. 設定ファイルの作成

`mitarashi.config.ts`:

```typescript
import { defineConfig } from "mitarashi";

export default defineConfig({
  site: {
    siteTitle: "My Blog",
    description: "ブログの説明",
    baseUrl: "/",
  },

  paths: {
    postsDir: "posts",
    outputDir: "dist",
    templateDir: "templates/minimal",
  },

  theme: {
    layout: "layout.html",
    post: "post.html"
  },

  options: {
    cleanOutputDir: true,
  }
});
```

### 3. Markdownファイルの作成

`posts/hello.md`:

```markdown
---
title: "Hello, World!"
date: "2025-07-30"
---

# Hello, World!

はじめまして。今日からブログを始めることにしました。

## なぜブログを始めたのか

日々の学びや気づきを記録しておきたいと思い、アウトプットの場としてブログを選びました。
```

### 4. ビルドの実行

```bash
# カレントディレクトリでビルド
mitarashi

# 特定のディレクトリを指定
mitarashi ./my-blog
```

ビルドが完了すると、`dist/`ディレクトリにHTMLファイルが生成されます。

## テンプレート

### 利用可能な変数

#### layout.html
- `{{ siteTitle }}` - サイトのタイトル
- `{{ slot }}` - 記事やページのコンテンツが挿入される場所

#### post.html
- `{{ title }}` - 記事のタイトル（Front Matterから）
- `{{ date }}` - 記事の日付（Front Matterから）
- `{{ content }}` - MarkdownからHTMLに変換されたコンテンツ

#### index.html
- トップページ用のテンプレート

### テンプレートの例

`templates/minimal/layout.html`:

```html
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{ siteTitle }}</title>
</head>
<body>
  <header>
    <h1><a href="/">{{ siteTitle }}</a></h1>
  </header>
  <main>
    {{ slot }}
  </main>
</body>
</html>
```

`templates/minimal/post.html`:

```html
<article>
  <h1>{{ title }}</h1>
  <p>{{ date }}</p>
  <div>{{ content }}</div>
</article>
```

## 対応しているMarkdown記法

- 見出し（`#`）
- 太字（`**text**`）
- 斜体（`*text*`）
- 段落
- リスト
- リンク（`[text](url)`）
- 画像（`![alt](url)`）
- インラインコード（`` `code` ``）
- インライン引用（`"quote"`）
- ブロック引用（`>`）
- テーブル
