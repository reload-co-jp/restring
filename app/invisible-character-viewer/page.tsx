import { InvisibleCharacterViewerTool } from "components/tools"
import { createPageMetadata } from "components/seo"
import { ToolArticle } from "components/tool-article"

export const metadata = createPageMetadata({
  title: "不可視文字ビューア",
  description: "スペース、タブ、改行、NBSP、ゼロ幅スペースを可視化。",
  path: "/invisible-character-viewer/",
})

const Page = () => (
  <ToolArticle href="/invisible-character-viewer/">
    <InvisibleCharacterViewerTool />
  </ToolArticle>
)

export default Page
