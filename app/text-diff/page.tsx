import { TextDiffTool } from "components/tools"
import { createPageMetadata } from "components/seo"
import { ToolArticle } from "components/tool-article"

export const metadata = createPageMetadata({
  title: "テキスト差分抽出 - 追加・削除だけを表示",
  description:
    "2つのテキストから追加・削除された差分だけをオンラインで抽出。行・単語・文字単位に対応し、変更点の洗い出しや文書レビューに。ブラウザだけで完結。",
  path: "/text-diff/",
})

const Page = () => (
  <ToolArticle href="/text-diff/">
    <TextDiffTool />
  </ToolArticle>
)

export default Page
