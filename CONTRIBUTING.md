# Contributing to Mitarashi

## 開発環境のセットアップ

### 必要な環境

- Node.js
- npm

### セットアップ手順

1. リポジトリをクローン

```bash
git clone https://github.com/PocoPota/mitarashi.git
cd mitarashi
```

2. 依存関係をインストール

```bash
npm install
```

3. TypeScriptをビルド

```bash
npm run build
```

4. ローカルでCLIをリンク

```bash
npm link
```

## 開発ワークフロー

### ビルド

TypeScriptファイルをJavaScriptにコンパイル:

```bash
npm run build
```

### ローカルでのテスト

開発中は2つの方法があります：

#### 方法1: 開発用スクリプト（推奨・開発中）

TypeScriptを直接実行して素早く動作確認:

```bash
npm run dev
```

生成されたHTMLファイルを確認:

```bash
open examples/blog/dist/index.html
```

#### 方法2: 本番環境と同じ動作確認

ビルド後のJavaScriptで動作確認（ユーザーと同じ体験）:

```bash
npm run build
cd examples/blog
mitarashi
```

生成されたHTMLファイルを確認:

```bash
open dist/index.html
```

### デバッグ

CLIスクリプトを直接実行してデバッグ:

```bash
node bin/cli.js examples/blog
```

## プロジェクト構成

```
mitarashi/
├── bin/
│   └── cli.js              # CLIエントリーポイント
├── src/
│   ├── config.ts           # 設定ファイル用ヘルパー
│   ├── types.ts            # 型定義
│   └── core/
│       ├── compiler.ts     # メインのビルド処理
│       ├── finder.ts       # Markdownファイル検索
│       ├── loader.ts       # ファイル読み込み
│       ├── loadConfig.ts   # 設定ファイル読み込み
│       ├── parser.ts       # Markdown → AST
│       ├── generator.ts    # AST → HTML
│       ├── pageBuilder.ts  # 個別ページ生成
│       ├── indexBuilder.ts # トップページ生成
│       └── modules/
│           └── token.ts    # トークン型定義
├── templates/
│   └── minimal/            # デフォルトテーマ
│       ├── layout.html     # ベースレイアウト
│       ├── post.html       # 記事テンプレート
│       └── index.html      # トップページテンプレート
├── examples/
│   └── blog/               # サンプルプロジェクト
│       ├── mitarashi.config.ts
│       ├── posts/          # サンプル記事
│       └── dist/           # ビルド出力先
└── dist/                   # TypeScriptビルド出力
```

## コードベースの理解

### 主要なモジュール

#### compiler.ts
メインのビルドプロセスを管理。以下の処理を実行:
1. 設定ファイルの読み込み
2. 出力ディレクトリの初期化
3. Markdownファイルの検索
4. 各ページのビルド
5. インデックスページの生成

#### parser.ts
Markdownテキストを抽象構文木（AST）に変換。トークン化されたデータを生成。

#### generator.ts
ASTをHTMLに変換。各トークンタイプに対応するHTML生成関数を持つ。

#### pageBuilder.ts
個別の記事ページを生成:
1. Markdownファイルの読み込み
2. Front Matterのパース
3. Markdownのパース・生成
4. テンプレートへのデータ挿入
5. HTMLファイルの出力

#### indexBuilder.ts
トップページ（一覧ページ）の生成を担当。