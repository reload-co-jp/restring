import { TextCompareTool } from "components/tools"
import { createPageMetadata } from "components/seo"

export const metadata = createPageMetadata({
  title: "テキスト比較",
  description: "2つの文字列を行・単語・文字単位で比較。",
  path: "/text-compare/",
})

export default TextCompareTool
