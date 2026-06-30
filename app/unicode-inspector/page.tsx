import { UnicodeInspectorTool } from "components/tools"
import { createPageMetadata } from "components/seo"
import { ToolArticle } from "components/tool-article"

export const metadata = createPageMetadata({
  title: "Unicodeインスペクタ",
  description: "UnicodeコードポイントとUTF表現を確認。",
  path: "/unicode-inspector/",
})

const Page = () => (
  <ToolArticle href="/unicode-inspector/">
    <UnicodeInspectorTool />
  </ToolArticle>
)

export default Page
