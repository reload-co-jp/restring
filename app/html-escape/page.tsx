import { HtmlEscapeTool } from "components/tools"
import { createPageMetadata } from "components/seo"
import { ToolArticle } from "components/tool-article"

export const metadata = createPageMetadata({
  title: "HTMLエスケープ・アンエスケープ",
  description:
    "HTML特殊文字（&・<・>・引用符）をオンラインでエスケープ・アンエスケープ。コード例の掲載やテンプレート作成、表示崩れの調査に。ブラウザだけで完結。",
  path: "/html-escape/",
})

const Page = () => (
  <ToolArticle href="/html-escape/">
    <HtmlEscapeTool />
  </ToolArticle>
)

export default Page
