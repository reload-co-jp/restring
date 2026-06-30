import { CaseConverterTool } from "components/tools"
import { createPageMetadata } from "components/seo"
import { ToolArticle } from "components/tool-article"

export const metadata = createPageMetadata({
  title: "ケース変換",
  description: "文字列を大文字、小文字、camelCase、snake_caseなどへ変換。",
  path: "/case-converter/",
})

const Page = () => (
  <ToolArticle href="/case-converter/">
    <CaseConverterTool />
  </ToolArticle>
)

export default Page
