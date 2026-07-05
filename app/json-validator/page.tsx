import { JsonValidatorTool } from "components/tools"
import { createPageMetadata } from "components/seo"
import { ToolArticle } from "components/tool-article"

export const metadata = createPageMetadata({
  title: "JSON構文チェック - JSONバリデーター",
  description:
    "JSONをオンラインで構文検証。構文エラー時はエラー箇所の行番号・列番号を表示し、有効な場合は整形済みJSONを出力。",
  path: "/json-validator/",
})

const Page = () => (
  <ToolArticle href="/json-validator/">
    <JsonValidatorTool />
  </ToolArticle>
)

export default Page
