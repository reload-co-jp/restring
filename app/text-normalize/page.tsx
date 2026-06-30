import { TextNormalizeTool } from "components/tools"
import { createPageMetadata } from "components/seo"
import { ToolArticle } from "components/tool-article"

export const metadata = createPageMetadata({
  title: "テキスト正規化",
  description: "空白削除、スペース圧縮、Unicode正規化、改行統一。",
  path: "/text-normalize/",
})

const Page = () => (
  <ToolArticle href="/text-normalize/">
    <TextNormalizeTool />
  </ToolArticle>
)

export default Page
