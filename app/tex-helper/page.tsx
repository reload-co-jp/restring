import { TexHelperTool } from "components/tex-helper"
import { createPageMetadata } from "components/seo"
import { ToolArticle } from "components/tool-article"

export const metadata = createPageMetadata({
  title: "TeX数式入力補助（KaTeXプレビュー・Markdown出力）",
  description:
    "ギリシャ文字・演算子・分数・累乗・総和・積分などのTeX記法をボタンから入力し、KaTeXでリアルタイムプレビュー。インライン数式$…$、ブロック数式$$…$$のMarkdown形式でコピー・保存できる。",
  path: "/tex-helper/",
})

const Page = () => (
  <ToolArticle href="/tex-helper/">
    <TexHelperTool />
  </ToolArticle>
)

export default Page
