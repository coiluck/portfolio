# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

就活用の個人ポートフォリオサイト（Astro + MDX）。個人サイト `C:\Users\toshi\OneDrive\デスクトップ\coiluck.github.io`（coiluck.moe）の続編という位置づけで、**デザインはそちらを流用する**。現状は Astro の初期テンプレートから移行し始めた段階。

## コマンド

パッケージマネージャは pnpm（Node >= 22.12）。

```
pnpm dev        # 開発サーバ
pnpm build      # 静的ビルド（dist/）
pnpm preview    # ビルド結果のプレビュー
```

開発サーバはバックグラウンドで起動する: `pnpm astro dev --background`（管理は `astro dev stop` / `status` / `logs`）。

型チェックは元サイトの CI と同じく `pnpm astro check` 。

## ページ構成

```
/                        トップ（ほぼ全部ここで完結させる）: Hero / About / Internship / Posts / Works
├─ /works/<slug>/        作品の詳細記事ページ。posts コレクションの各記事から生成される
└─ /internships/<slug>/  インターン経験の詳細ページ。トップには一覧のリンクだけ出す
```

## ディレクトリ構成

- `src/pages/index.astro` はセクションを並べるだけにし、各セクションの中身とスタイルは `src/components/top/`（Hero, SkillTable, PickupList, WorksTimeline, InternshipList）に置く。作品詳細ページの部品は `src/components/works/`（WorkHeader）。
- どこでも使う部品は `src/components/` 直下（SectionTitle, Tag, BlogLine, IconImage, LinkButton）。`Tag` は `hash` を渡すと先頭に `#` がつく。`LinkButton` は外部リンク用の平行四辺形ボタンで、slot に渡したアイコンがテキストの前に入る。
- Content Collections を触る処理（`getCollection` / `getEntry` / `render`）はすべて `src/utils/getWorks.ts` に置き、ページやコンポーネントから `astro:content` を直接 import しない。
- サイトは `coiluck.moe/portfolio/` で配信される（`base: '/portfolio'`）。サイト内のパス（`/images/...`, `/works/...`）は直書きせず、必ず `src/utils/path.ts` の `withBase()` を通す。例外として、記事（MDX）の Markdown 画像 `![](/images/...)` は `src/plugins/hast-image-base.ts` がビルド時に base をつけるので、元サイトと同じく public からのパスで書く。

## コンテンツ管理

- 作品一覧は `works` コレクション（`src/content/works/works.yaml`、1 ファイルに全件）。元サイトの `creates` から移したもので、`date` は元の `published_date`、`link` は元の `url` に対応する。
- 作品詳細の記事は `posts` コレクション（`src/content/posts/*.mdx`）。`works` とは独立していて、`title` / `description` / `tags` は記事側の frontmatter に持つ。`workLink` があると記事上部に「作品を見る」リンクが出る。内容は `G:\マイドライブ\job\submission\glacia_summary.pdf` のような作品サマリー（提出資料）を Web 化したもの。
- トップの Posts には posts を全件、`order` の小さい順に出す。Works の年表には works を全件出す。
- インターン経験は `internships` コレクション（`src/content/internships/*.md`、1 社 1 ファイル）。frontmatter に `company` / `role` / `period`、本文に Markdown で内容を書く。トップには社名・役割・期間のリンクだけ出し、本文は `/internships/<id>/` で表示する。ファイル名が id（URL）になる。

## 元サイトから流用するもの

新規に作り直す前に、まず元リポジトリ（`../coiluck.github.io`）の該当ファイルを読んで移植すること。

- **共通部品**: `src/components/`（Topbar, Footer, LabelTitle など）、`src/styles/article.css`（記事本文のスタイル）。
- **Markdown 処理**: 元サイトは `@astrojs/markdown-satteri` の `satteri()` プロセッサに `src/plugins/` の mdast/hast プラグイン（リンクカード、注記、図キャプション等）と `satteri-expressive-code` を組み合わせている。このリポジトリには `@astrojs/markdown-satteri` が依存として入っているが、`astro.config.ts` ではまだ `mdx()` だけで未設定。
- **設定の慣習**: `trailingSlash: 'always'`, `build.format: 'directory'`, `image.service: passthroughImageService()`, `<html lang="ja">`。デプロイは GitHub Pages（`withastro/action`）。

## 参考

Astro ドキュメント: https://docs.astro.build（ルーティング、Content Collections、スタイリングの各ガイド）
