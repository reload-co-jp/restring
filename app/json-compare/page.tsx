import { JsonCompareTool } from "components/tools"
import { createPageMetadata } from "components/seo"
import { ToolArticle } from "components/tool-article"

export const metadata = createPageMetadata({
  title: "JSON比較・整形",
  description:
    "2つのJSONをオンラインで比較・整形（フォーマット）。キー順の違いを無視して構造の一致・不一致を判定し、構文エラーも検証。API開発やレスポンスのデバッグに。",
  path: "/json-compare/",
})

const Page = () => (
  <ToolArticle href="/json-compare/">
    <JsonCompareTool />
  </ToolArticle>
)

export default Page
