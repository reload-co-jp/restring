import { Metadata } from "next"

export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://restring.reload.co.jp"

export const siteName = "Restring"

export const siteDescription =
  "開発者向け文字列処理・比較ツール集。テキスト比較、JSON比較、Base64、URLエンコード、HTMLエスケープ、Unicode確認をブラウザで実行。"

export const absoluteUrl = (path = "/") => new URL(path, siteUrl).toString()

export const createPageMetadata = ({
  description,
  path,
  title,
}: {
  description: string
  path: string
  title: string
}): Metadata => ({
  title,
  description,
  alternates: {
    canonical: path,
  },
  openGraph: {
    title,
    description,
    url: path,
    siteName,
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary",
    title,
    description,
  },
})
