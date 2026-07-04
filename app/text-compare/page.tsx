import { TextCompareTool } from "components/tools"
import { createPageMetadata } from "components/seo"
import { ToolArticle } from "components/tool-article"

export const metadata = createPageMetadata({
  title: "テキスト比較 - 文字列の差分チェック",
  description:
    "2つのテキスト・文字列の違いをオンラインで比較。行・単語・文字単位の差分を色分け表示し、スペースや大文字小文字を無視した比較にも対応。インストール不要。",
  path: "/text-compare/",
})

const Page = () => (
  <ToolArticle href="/text-compare/">
    <TextCompareTool />
  </ToolArticle>
)

export default Page
