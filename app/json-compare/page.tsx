import { JsonCompareTool } from "components/tools"
import { createPageMetadata } from "components/seo"
import { ToolArticle } from "components/tool-article"

export const metadata = createPageMetadata({
  title: "JSON比較",
  description: "JSONを検証し、整形表示と構造比較。",
  path: "/json-compare/",
})

const Page = () => (
  <ToolArticle href="/json-compare/">
    <JsonCompareTool />
  </ToolArticle>
)

export default Page
