import { HtmlEscapeTool } from "components/tools"
import { createPageMetadata } from "components/seo"
import { ToolArticle } from "components/tool-article"

export const metadata = createPageMetadata({
  title: "HTMLエスケープ",
  description: "HTML特殊文字をエスケープ・アンエスケープ。",
  path: "/html-escape/",
})

const Page = () => (
  <ToolArticle href="/html-escape/">
    <HtmlEscapeTool />
  </ToolArticle>
)

export default Page
