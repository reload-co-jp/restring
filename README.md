# Restring

開発者向け文字列処理・比較ツール集。

Restring は、テキスト比較、JSON比較、エンコード、正規化、Unicode調査などをブラウザだけで実行できるWebツールです。各機能は独立URLを持ち、トップページからタブと機能一覧で移動できます。

## 本番URL

https://restring.reload.co.jp

## 実装済み機能

- `/text-compare/` テキスト比較
  - 行単位、単語単位、文字単位で比較
  - インライン表示、左右表示
  - スペース、改行、タブ、大文字小文字の無視
- `/json-compare/` JSON比較
  - JSON Validation
  - Pretty Print
  - キー順を無視した構造比較
- `/jwt-decoder/` JWT解析
  - Header、Payload、Signatureに分解
  - Base64URLデコード
  - exp、nbf、iatなどの時刻クレーム確認
  - HS256、HS384、HS512のHMAC署名検証
- `/text-diff/` テキスト差分
  - 追加・削除された差分だけ抽出
- `/text-normalize/` テキスト正規化
  - Trim
  - Collapse Spaces
  - Unicode NFC正規化
  - 改行コード統一
- `/invisible-character-viewer/` 不可視文字ビューア
  - Space、Tab、CR、LF、NBSP、Zero Width Spaceを可視化
- `/line-ending-converter/` 改行コード変換
  - LF、CRLF、CRへ変換
- `/case-converter/` ケース変換
  - UPPERCASE、lowercase、camelCase、PascalCase、snake_case、kebab-case
- `/url-encode-decode/` URLエンコード・デコード
  - `encodeURIComponent`
  - `decodeURIComponent`
- `/base64/` Base64
  - UTF-8文字列のBase64エンコード・デコード
- `/html-escape/` HTMLエスケープ
  - HTML特殊文字のエスケープ・アンエスケープ
- `/unicode-inspector/` Unicodeインスペクタ
  - Code Point、UTF-8、UTF-16、UTF-32、Unicode Name、Blockを表示

## 各ページの構成

- ツール本体
- 使い方
- 仕組み

説明文は `components/tool-links.ts` に集約し、`components/tool-article.tsx` で各機能ページに表示します。

## 共通UI

- ダークモード
- コピー
- 保存
- 機能タブナビゲーション
- トップページの機能紹介リンク
- レスポンシブ対応

## SEO

- `metadataBase`
- title template
- canonical
- description
- Open Graph
- Twitter Card
- robots meta
- JSON-LD `WebSite`
- JSON-LD `ItemList`
- `/robots.txt`
- `/sitemap.xml`
- favicon `/icon.svg`

本番URLは `components/seo.ts` で管理します。既定値は `https://restring.reload.co.jp` です。環境変数 `NEXT_PUBLIC_SITE_URL` で上書きできます。

## 技術構成

- Next.js 16
- React 19
- TypeScript
- ESLint
- Static Export `output: "export"`
- pnpm

## 開発

```bash
pnpm install
pnpm dev
```

## 検証

```bash
pnpm lint
pnpm typecheck
pnpm build
```

## 主なファイル

- `app/page.tsx` トップページ
- `app/*/page.tsx` 各機能ページ
- `components/tools.tsx` ツール本体
- `components/tool-links.ts` 機能情報、使い方、仕組み
- `components/tool-article.tsx` 説明表示
- `components/tool-tabs.tsx` タブナビ
- `components/seo.ts` SEO共通設定
- `app/robots.ts` robots.txt
- `app/sitemap.ts` sitemap.xml
- `app/icon.svg` favicon
