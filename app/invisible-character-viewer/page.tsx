import { InvisibleCharacterViewerTool } from "components/tools"
import { createPageMetadata } from "components/seo"
import { ToolArticle } from "components/tool-article"

export const metadata = createPageMetadata({
  title: "不可視文字ビューア - ゼロ幅スペース・NBSP可視化",
  description:
    "文字列に紛れたスペース・タブ・改行・NBSP・ゼロ幅スペースなどの見えない文字をオンラインで可視化。文字化けやdiff不一致、コピペ起因の不具合調査に。",
  path: "/invisible-character-viewer/",
})

const Page = () => (
  <ToolArticle href="/invisible-character-viewer/">
    <InvisibleCharacterViewerTool />
  </ToolArticle>
)

export default Page
