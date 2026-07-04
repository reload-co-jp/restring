import { UnicodeInspectorTool } from "components/tools"
import { createPageMetadata } from "components/seo"
import { ToolArticle } from "components/tool-article"

export const metadata = createPageMetadata({
  title: "Unicodeインスペクタ - 文字コード・コードポイント確認",
  description:
    "文字のUnicodeコードポイント、UTF-8・UTF-16・UTF-32表現、文字名、Unicodeブロックをオンラインで確認。文字化けや異体字、絵文字、不可視文字の調査に。",
  path: "/unicode-inspector/",
})

const Page = () => (
  <ToolArticle href="/unicode-inspector/">
    <UnicodeInspectorTool />
  </ToolArticle>
)

export default Page
