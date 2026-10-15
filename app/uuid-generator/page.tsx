import { UuidGeneratorTool } from "components/tools"
import { createPageMetadata } from "components/seo"
import { ToolArticle } from "components/tool-article"

export const metadata = createPageMetadata({
  title: "UUID生成（v4）",
  description:
    "UUID v4をオンラインで一括生成。crypto.randomUUID()による安全な乱数を使い、大文字・ハイフンなしの形式にも対応。データベースの主キーやテストデータ作成に。",
  path: "/uuid-generator/",
})

const Page = () => (
  <ToolArticle href="/uuid-generator/">
    <UuidGeneratorTool />
  </ToolArticle>
)

export default Page
