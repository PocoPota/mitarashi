# Mitarashi

JSON設定のみでカスタム構文を追加できるMarkdownパーサを搭載した静的サイトジェネレーター。
コード変更なしにプロジェクト固有のインライン・ブロック構文を定義し、MarkdownからHTMLサイトを生成します。

## 特徴

- **JSON設定だけで構文拡張** - コード変更不要。JSON定義ファイルにルールを追加するだけで独自のMarkdown構文を使える
- **インライン構文・ブロック構文の両対応** - テキスト装飾からブロック要素まで、2種類の構文タイプで柔軟に拡張
- **メタ情報のサポート** - ブロック構文の開始行にメタ情報を付与し、テンプレートで参照可能

## クイックスタート

```bash
npx create-mitarashi-app my-blog
cd my-blog
npm install
npm run build
```

手動セットアップの場合:

```bash
npm install mitarashi
```

## プロジェクト構成

```
my-blog/
├── mitarashi.config.ts        # サイト設定
├── mitarashi.syntax.json      # カスタム構文定義（オプション）
├── posts/                     # Markdown記事
│   └── hello.md
├── templates/
│   └── minimal/
│       ├── layout.html        # 共通レイアウト
│       ├── post.html          # 記事テンプレート
│       └── index.html         # トップページテンプレート
└── package.json
```

## 設定ファイル

`mitarashi.config.ts` でサイト全体を設定します。

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
    customSyntaxFile: "mitarashi.syntax.json",
  },
  theme: {
    layout: "layout.html",
    post: "post.html",
  },
  options: {
    cleanOutputDir: true,
  },
});
```

| キー | 説明 | 必須 |
|------|------|:----:|
| `site.siteTitle` | サイトのタイトル | ○ |
| `site.description` | サイトの説明文 | - |
| `site.baseUrl` | ベースURL | - |
| `paths.postsDir` | Markdownファイルのディレクトリ | ○ |
| `paths.outputDir` | ビルド出力先ディレクトリ | ○ |
| `paths.templateDir` | テンプレートファイルのディレクトリ | ○ |
| `paths.customSyntaxFile` | カスタム構文定義ファイルのパス | - |
| `theme.layout` | レイアウトテンプレートのファイル名 | ○ |
| `theme.post` | 記事テンプレートのファイル名 | ○ |
| `options.cleanOutputDir` | ビルド前に出力ディレクトリを削除するか | ○ |

## 使い方

`posts/` ディレクトリにFront Matter付きのMarkdownファイルを配置し、ビルドを実行します。

```markdown
---
title: "Hello, World!"
date: "2025-07-30"
---

# Hello, World!

ブログ記事の内容をここに書きます。
```

```bash
npx mitarashi
or
npm run build
```

`dist/` ディレクトリにHTMLファイルが生成されます。サブディレクトリ構造は維持されます。

## カスタム構文

Mitarashiの中核機能です。`mitarashi.syntax.json` にルールを定義するだけで、コード変更なしにMarkdown記法を拡張できます。

### 構文定義

```json
{
  "rules": [
    {
      "name": "highlight",
      "type": "inline",
      "pattern": "==",
      "template": "<mark>{{content}}</mark>"
    },
    {
      "name": "note_block",
      "type": "block",
      "pattern": ":::",
      "template": "<div class='note {{meta}}'>{{content}}</div>"
    }
  ]
}
```

### インライン構文 (`type: "inline"`)

文章中の一部分を装飾します。テキストノードを正規表現で検索し、マッチした部分をテンプレートで置換します。

```markdown
これは==重要な==テキストです。
```
```html
<p>これは<mark>重要な</mark>テキストです。</p>
```

### ブロック構文 (`type: "block"`)

複数行にわたるブロック要素を定義します。段落ノードから開始/終了マーカーを探索し、マーカー間の内容をブロック要素に変換します。

開始行のパターンに続くテキストをメタ情報として `{{meta}}` で参照できます。ブロック内のインライン構文（太字・斜体など）も処理されます。

```markdown
:::note important
注意事項を**強調**できます。
:::
```
```html
<div class="note important">
  <p>注意事項を<strong>強調</strong>できます。</p>
</div>
```

### プレースホルダー

| プレースホルダー | 説明 |
|-----------------|------|
| `{{content}}` | ルールで囲まれたコンテンツ |
| `{{meta}}` | ブロック開始行のメタ情報 |

## テンプレート

`{{ 変数名 }}` 形式の変数置換によるHTMLテンプレートです。`layout.html`（共通レイアウト）、`post.html`（記事ページ）、`index.html`（トップページ）の3種類を使用します。

利用可能な変数:

| テンプレート | 変数 | 説明 |
|-------------|------|------|
| layout | `{{ siteTitle }}` | サイトのタイトル |
| layout | `{{ slot }}` | ページコンテンツの挿入位置 |
| post | `{{ title }}` | 記事タイトル（Front Matterから） |
| post | `{{ date }}` | 記事日付（Front Matterから） |
| post | `{{ content }}` | 変換済みHTMLコンテンツ |
| index | `{{ posts }}` | 記事一覧HTML |
| index | `{{ pathToIndex }}` | トップページへの相対パス |

## アーキテクチャ

Mitarashiは Parser → Transformer → Generator の3層パイプラインでMarkdownをHTMLに変換します。

```
Markdownテキスト
    ↓
[Parser] 標準Markdown構文を解析 → 標準AST
    ↓
[Transformer] カスタム構文を検出・変換 → 拡張AST
    ↓
[Generator] HTML生成 → HTML出力
```

### Transformerの処理

Transformerは、Parserが生成した標準ASTをカスタム構文対応の拡張ASTに変換する中間処理層です。

入力: 標準AST
```typescript
[{ type: "paragraph", children: [
  { type: "text", value: "これは==重要な==テキスト" }
]}]
```

出力: 拡張AST
```typescript
[{ type: "paragraph", children: [
  { type: "text", value: "これは" },
  { type: "highlight", children: [
    { type: "text", value: "重要な" }
  ]},
  { type: "text", value: "テキスト" }
]}]
```

### Transformer分離の設計意図

1. 関心の分離 - Parserは標準構文の解析、Transformerはカスタム構文の変換、GeneratorはHTML出力。各層が独立してテスト可能
2. Parser交換可能性 - 自作Parserをmarkdown-it・remarkなどに置き換え可能（ASTアダプタは必要）。Parser変更時もTransformer・Generatorは影響を受けない
3. 拡張性 - 複数のTransformerをチェーン可能。プラグインとしての切り出しにも対応できる設計

## 対応Markdown記法

| 記法 | 構文 |
|------|------|
| 見出し | `# H1` 〜 `###### H6` |
| 太字 | `**text**` |
| 斜体 | `*text*` |
| 段落 | 空行区切り |
| リスト | `- item` |
| リンク | `[text](url)` |
| 画像 | `![alt](url)` |
| インラインコード | `` `code` `` |
| コードブロック | ` ```lang ` |
| インライン引用 | `> text` |
| ブロック引用 | 複数行の `>` |
| テーブル | `\| col1 \| col2 \|` |
