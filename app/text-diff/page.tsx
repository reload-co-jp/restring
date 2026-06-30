import { TextDiffTool } from "components/tools"
import { createPageMetadata } from "components/seo"
import { ToolArticle } from "components/tool-article"

export const metadata = createPageMetadata({
  title: "テキスト差分",
  description: "追加・削除されたテキスト差分を抽出。",
  path: "/text-diff/",
})

const Page = () => (
  <ToolArticle href="/text-diff/">
    <TextDiffTool />
  </ToolArticle>
)

export default Page
