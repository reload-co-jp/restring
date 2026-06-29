# restring

> Developer-oriented string processing and comparison tools.

---

# Overview

restring は、文字列処理・比較・変換・解析を行う無料のWebツール集です。

SEOを重視し、各ツールは独立したURLを持ち、
それぞれに解説ページ・FAQ・関連記事を用意します。

目的

- 開発者の日常業務を効率化
- ブラウザだけで完結
- 高速・広告が邪魔にならない
- モバイル対応
- AI時代でも使われ続ける実用ツール

---

# Target

- Webエンジニア
- バックエンドエンジニア
- フロントエンドエンジニア
- インフラエンジニア
- QA
- データ分析
- 学生

---

# MVP

## Text Compare

2つの文字列を比較

機能

- 行単位比較
- 単語単位比較
- 文字単位比較
- Inline表示
- Side-by-side表示

オプション

- 空白無視
- 改行無視
- タブ無視
- 大文字小文字無視

---

## JSON Compare

- 構造比較
- キー順無視
- Pretty Print
- JSON Validation

---

## Text Diff

差分のみ抽出

- Added
- Removed
- Changed

---

## Text Normalize

文字列正規化

- Trim
- Collapse Spaces
- Normalize Unicode
- Convert Line Ending

---

## Invisible Character Viewer

不可視文字の可視化

対象

- Space
- Tab
- CR
- LF
- NBSP
- Zero Width Space

---

## Line Ending Converter

改行コード変換

- LF
- CRLF
- CR

---

## Case Converter

- UPPERCASE
- lowercase
- camelCase
- PascalCase
- snake_case
- kebab-case

---

## URL Encode / Decode

- Encode
- Decode

---

## Base64

- Encode
- Decode

---

## HTML Escape

- Escape
- Unescape

---

## Unicode Inspector

入力文字から

表示

- Code Point
- UTF-8
- UTF-16
- UTF-32
- Unicode Name
- Block

---

# Future Tools

## String

- Reverse
- Sort
- Shuffle
- Remove Duplicate Lines
- Count Characters
- Count Words
- Count Bytes

---

## JSON

- Formatter
- Minifier
- Schema Generator
- Patch Generator
- Merge Patch

---

## CSV

- CSV Compare
- CSV Viewer
- CSV to JSON
- JSON to CSV

---

## XML

- XML Formatter
- XML Compare
- XPath Tester

---

## YAML

- YAML Formatter
- YAML Validator
- YAML ⇔ JSON

---

## Markdown

- Preview
- Diff
- Formatter

---

## SQL

- Formatter
- Diff
- Pretty Print

---

## Regex

- Tester
- Cheat Sheet
- Generator

---

# Common UI

全ツール共通

- Dark Mode
- Copy Button
- Download
- Share URL
- Drag & Drop
- Sample Data
- Reset
- Auto Run

---

# Search

全ツール検索

例

```
json
unicode
diff
camel
```

---

# SEO

各ツールは

```
/text-compare
/json-compare
/base64
/unicode
```

のように独立ページを持つ。

各ページ

- タイトル
- Description
- FAQ
- How to
- Examples
- Related Tools

---

# Blog

コンテンツ

- Unicodeとは
- Diffとは
- JSON比較方法
- Base64とは
- UTF-8とは

---

# Performance

- JavaScriptのみで動作
- API不要
- クライアントサイド処理
- オフライン対応(PWA対応予定)

---

# Accessibility

- WCAG AA
- キーボード操作
- Screen Reader対応
- 色だけで判別しない

---

# Analytics

収集

- Tool Usage
- Popular Tools
- Search Query

※入力テキストは送信しない

---

# Privacy

- 入力文字列はサーバー送信しない
- Cookie最小限
- GDPR対応可能設計

---

# Tech Stack

Frontend

- Next.js
- React
- TypeScript

UI

- TailwindCSS
- shadcn/ui

Diff

- diff
- jsdiff

JSON

- jsonc-parser

State

- Zustand

SEO

- next-sitemap
- Schema.org

Deploy

- Cloudflare Pages
- Vercel

---

# Design Principles

- Fast
- Minimal
- Mobile First
- Keyboard Friendly
- No Login
- Free Forever
