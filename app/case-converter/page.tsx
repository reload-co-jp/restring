import { CaseConverterTool } from "components/tools"
import { createPageMetadata } from "components/seo"
import { ToolArticle } from "components/tool-article"

export const metadata = createPageMetadata({
  title: "ケース変換 - camelCase・snake_case・kebab-case",
  description:
    "文字列をcamelCase・PascalCase・snake_case・kebab-case・大文字・小文字へオンラインで一括変換。変数名やファイル名、URLスラッグの作成に。",
  path: "/case-converter/",
})

const Page = () => (
  <ToolArticle href="/case-converter/">
    <CaseConverterTool />
  </ToolArticle>
)

export default Page
