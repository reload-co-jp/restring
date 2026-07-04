import { TextNormalizeTool } from "components/tools"
import { createPageMetadata } from "components/seo"
import { ToolArticle } from "components/tool-article"

export const metadata = createPageMetadata({
  title: "テキスト正規化 - 空白・改行・Unicode一括整形",
  description:
    "前後の空白削除、連続スペースの圧縮、改行コード統一、Unicode正規化（NFC）をオンラインで一括実行。コピペで崩れたテキストやデータクレンジングの下処理に。",
  path: "/text-normalize/",
})

const Page = () => (
  <ToolArticle href="/text-normalize/">
    <TextNormalizeTool />
  </ToolArticle>
)

export default Page
