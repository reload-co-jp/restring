import { MarkdownEditorTool } from "components/markdown-editor"
import { createPageMetadata } from "components/seo"
import { ToolArticle } from "components/tool-article"

export const metadata = createPageMetadata({
  title: "Markdownエディタ（WYSIWYG・数式対応）",
  description:
    "Markdown文書を見たまま編集できるWYSIWYGエディタ。見出し・リスト・表・コードブロックに加え、KaTeXによるインライン数式・ブロック数式に対応。ブラウザだけで完結。",
  path: "/markdown-editor/",
})

const Page = () => (
  <ToolArticle href="/markdown-editor/">
    <MarkdownEditorTool />
  </ToolArticle>
)

export default Page
