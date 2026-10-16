import { JsonToTypeScriptTool } from "components/tools"
import { createPageMetadata } from "components/seo"
import { ToolArticle } from "components/tool-article"

export const metadata = createPageMetadata({
  title: "JSONからTypeScript型生成",
  description:
    "JSONを貼り付けてTypeScriptのinterfaceを自動生成。ネストしたオブジェクト、配列、ユニオン型、オプショナルなキーに対応。APIレスポンスの型付けに。",
  path: "/json-to-typescript/",
})

const Page = () => (
  <ToolArticle href="/json-to-typescript/">
    <JsonToTypeScriptTool />
  </ToolArticle>
)

export default Page
